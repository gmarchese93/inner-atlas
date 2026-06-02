# Inner Atlas Audio Architecture

## Scope

This document captures the current Web Audio architecture after R0.2. It is intended to preserve the state-machine reasoning behind the Begin, Pause, Resume, End, and Discard race fix.

Runtime files:

- `artifacts/inner-atlas/src/lib/audioEngine.js`
- `artifacts/inner-atlas/src/pages/Session.jsx`
- `artifacts/inner-atlas/src/components/AudioMixer.jsx`
- `artifacts/inner-atlas/src/lib/constants.js`

## Design Goals

- Smooth fades for Begin, Pause, Resume, End, and Discard.
- No overlapping fade operations.
- No UI state that claims audio is active while the engine is stuck silent.
- Slider value `0` means true silence for that layer.
- Preserve current sound design.
- Preserve localStorage session and draft compatibility.

## Engine State Machine

The audio engine has an explicit state enum:

```js
const STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  PLAYING: 'playing',
  PAUSING: 'pausing',
  PAUSED: 'paused',
  RESUMING: 'resuming',
  DISPOSING: 'disposing',
};
```

Meaning:

- `idle`: no active playable graph is considered running
- `starting`: context/graph setup or fade-in is in progress
- `playing`: audio should be audible according to the current mix
- `pausing`: fade-out and suspend are in progress
- `paused`: context is suspended after fade-out
- `resuming`: context resume and fade-in are in progress
- `disposing`: teardown is in progress

## Audible States

Droplet scheduling and other audible time-based behaviors are gated by:

```js
const AUDIBLE_STATES = new Set([STATE.STARTING, STATE.PLAYING, STATE.RESUMING]);
```

This prevents rain droplet scheduling while paused, pausing, idle, or disposing. The droplet scheduler also checks that the AudioContext is running before firing.

## Transition Mutex

The engine uses `_runTransition(task)` as a mutex around async operations:

```js
async _runTransition(task) {
  if (this._transition) return false;
  this._transition = task();
  try {
    await this._transition;
    return true;
  } finally {
    this._transition = null;
  }
}
```

Rules:

- Only one engine transition can run at a time.
- A second transition request while one is pending returns `false`.
- Errors propagate because the function uses `try/finally` without `catch`.
- `_transition` is cleared when the transition settles.

This is the engine-level guard against overlapping fades.

## Fade Behavior

Master fade is centralized:

```js
async _fadeMasterTo(target, duration) {
  const now = this.ctx.currentTime;
  this.masterGain.gain.cancelScheduledValues(now);
  this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
  this.masterGain.gain.linearRampToValueAtTime(target, now + duration);
  await wait(duration * 1000 + 120);
}
```

Important behavior:

- any scheduled master gain automation is cancelled before a new ramp
- ramp starts from the current master gain value
- the extra wait buffer lets automation settle before the next state change

Constants:

- `MASTER_TARGET = 0.38`
- `FADE_IN = 2.4`
- `FADE_OUT = 1.8`

## Public Engine Flow

### `play(mix)`

Flow:

1. If already `playing`, return `true`.
2. Enter `_runTransition`.
3. Set engine state to `starting`.
4. Ensure an AudioContext exists.
5. Resume the context if suspended.
6. Build the graph if needed.
7. Apply the provided mix immediately.
8. Fade master gain to `MASTER_TARGET`.
9. Set engine state to `playing`.
10. Restart rain sublayer scheduling if applicable.

On failure, state returns to `idle` and the error is rethrown.

### `pause()`

Flow:

1. If not `playing` or there is no context, return `false`.
2. Enter `_runTransition`.
3. Set engine state to `pausing`.
4. Clear droplet and crackle timers.
5. Fade master gain to `0`.
6. Suspend the context if running.
7. Set engine state to `paused`.

### `resume()`

Flow:

1. If not `paused` or there is no context, return `false`.
2. Enter `_runTransition`.
3. Set engine state to `resuming`.
4. Resume the context if suspended.
5. Fade master gain to `MASTER_TARGET`.
6. Set engine state to `playing`.
7. Restart rain and crackle scheduling as needed.

### `dispose()`

Flow:

1. Set engine state to `disposing`.
2. Clear timers.
3. Stop and disconnect tracked LFO and source nodes.
4. Close the context if open.
5. Clear graph references and user values.
6. Set engine state to `idle`.

Current note: Session teardown currently awaits `pause()` for End and Discard rather than calling `dispose()` directly.

## Session UI State Machine

The Session component mirrors the same state names:

```js
const SESSION_STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  PLAYING: 'playing',
  PAUSING: 'pausing',
  PAUSED: 'paused',
  RESUMING: 'resuming',
  DISPOSING: 'disposing',
};
```

Transition states:

```js
const TRANSITION_STATES = new Set([
  SESSION_STATE.STARTING,
  SESSION_STATE.PAUSING,
  SESSION_STATE.RESUMING,
  SESSION_STATE.DISPOSING,
]);
```

The primary button is disabled while `sessionState` is in `TRANSITION_STATES`.

## UI Transition Lock

The Session component also uses a ref lock:

```js
const transitionLockRef = useRef(false);
```

`beginTransition()` returns false if:

- a transition is already locked by the ref
- the current React session state is a transition state

`finishTransition()` clears the ref lock in `finally` blocks.

This creates a dual-layer guard:

- UI layer: disables or ignores duplicate interaction
- engine layer: rejects overlapping audio transitions

Both are required. The UI lock prevents duplicate user intent. The engine mutex protects audio state even if UI timing changes or another caller invokes the engine.

## Session Control Flow

### Begin Session

1. `beginTransition()`
2. Set UI state to `starting`
3. Await `audioEngine.play(applyNudge(mix, intention))`
4. Start timer by setting `startedAt`
5. Set UI state to `playing`
6. `finishTransition()`

If audio fails, the session continues silently and shows an audio error message.

### Pause

1. `beginTransition()`
2. Calculate elapsed time
3. Stop timer by moving elapsed time into `accumulated`
4. Set UI state to `pausing`
5. Await `audioEngine.pause()`
6. Set UI state to `paused`
7. `finishTransition()`

### Resume

1. `beginTransition()`
2. Set UI state to `resuming`
3. Await `audioEngine.resume()`
4. Restart timer by setting `startedAt`
5. Set UI state to `playing`
6. `finishTransition()`

### End and Save

1. `beginTransition()`
2. Calculate final elapsed time
3. Set UI state to `disposing`
4. Save the session
5. Clear active draft
6. Await `audioEngine.pause()`
7. Navigate to `/history`
8. `finishTransition()`

### Discard

1. `beginTransition()`
2. Set UI state to `disposing`
3. Clear active draft
4. Await `audioEngine.pause()`
5. Navigate to `/`
6. `finishTransition()`

## R0.2 Root Cause

Before R0.2, rapid Begin, Pause, and Resume clicks could overlap fade operations. The UI could complete a state transition independently from the audio engine while the master gain or AudioContext ended in a silent/suspended state.

The fix adds:

- explicit transition states
- disabled primary control during transitions
- UI-level transition lock
- engine-level async transition mutex
- shared master fade helper that cancels scheduled master gain automation
- awaited teardown in End and Discard

## Sound Design Layers

Current layers:

- `drone`: ritual low foundation
- `pad`: wide harmonic atmosphere
- `rain`: density-based rain and droplets
- `analog`: subtle imperfection
- `pulse`: slow body throb
- `air`: high space and height

Layer values are curved before gain application:

```js
Math.pow(clamp(value, 0, 1), 1.65)
```

Each layer has a cap and smoothing time constant. A raw slider value of `0` is clamped and curved to `0`, so it must remain true silence for that layer.

## Known Technical Debt

- `Session.jsx` remains JSX even though project standards prefer strict TypeScript.
- Engine and UI state machines are parallel by convention rather than owned by a single hook.
- `handlePrimary` should eventually be extracted into a typed `useAudioSession` hook.
- Discard now waits for full fade-out before navigation; this is correct for audio safety but may need a product decision on perceived responsiveness.
- Browser automation can verify control flow, but audible output still needs human confirmation.
