# Inner Atlas Product Roadmap

## From Alpha Scaffold to Premium Reflective Ambient Instrument

## Product Premise

Inner Atlas is a private, local-first ambient focus and reflection app. It combines mood-based soundscapes, journaling, symbolic self-observation, immersive visual design, and eventually optional archetypal/esoteric modules.

The product should not become a generic meditation app, a generic journal, or a generic AI wellness wrapper. Its identity is closer to:

> a symbolic ambient instrument for focus, decompression, dream/reflection journaling, and inner-state mapping.

The core promise is:

> Open the app, choose the kind of inner space you need, and enter an adaptive room that helps you focus, decompress, reflect, or observe yourself over time.

---

# Phase 1 - Foundation and Stabilization

## R0.1 - Migration Stabilization

### Status

Completed.

### Goal

Move from Base44-generated alpha to a proper repo-controlled development workflow.

### Scope

- VSCode, GitHub, and Replit migration.
- GitHub becomes source of truth.
- Replit becomes preview/deployment sandbox.
- Project docs created:
  - `AGENTS.md`
  - `PRODUCT_SPEC.md`
  - `AUDIO_ARCHITECTURE.md`
  - `DESIGN_SYSTEM.md`
  - `ROADMAP.md`
- Basic migration QA completed.

### Acceptance Criteria

- App builds.
- App runs locally/Replit.
- Routes work.
- LocalStorage works.
- Session history works.
- Active session persistence works.
- Audio starts and pauses.
- No major migration regression.

---

## R0.2 - Audio State Machine Stabilization

### Status

Completed.

### Goal

Fix the core Begin/Pause/Resume race condition.

### Problem

If the user clicked Begin, Pause, and Resume too quickly, the UI could report an active session while audio remained silent.

### Core Fix

Introduce a proper audio/session transition state machine.

Expected states:

```ts
idle
starting
playing
pausing
paused
resuming
disposing
```

### Scope

- Prevent overlapping fade operations.
- Guard rapid double-clicks.
- Keep UI state synchronized with audio state.
- Preserve fade-in/fade-out.
- Preserve active session persistence.
- Preserve current sound design.
- Preserve slider zero = true silence.

### Acceptance Criteria

- Rapid Begin/Pause/Resume clicking cannot break audio.
- Timer and audio state stay aligned.
- Audio never gets stuck silent unless intentionally paused.
- Build passes.

---

# Phase 2 - Audio Architecture and Core Experience

## R0.3 - Audio Engine Refactor

### Recommended AI

Claude Code.

### Goal

Refactor the current audio engine into maintainable modules without changing audible behavior.

### Why

The current audio engine likely contains too much in one place:

- state machine
- layer creation
- gain smoothing
- rain logic
- reverb
- panning
- scheduling
- presets
- public API

Before adding advanced features, the engine needs clean internal architecture.

### Proposed Structure

```text
src/audio/
  audioEngine.js
  audioStateMachine.js
  gain.js
  layers/
    drone.js
    pad.js
    rain.js
    analog.js
    air.js
    pulse.js
  effects/
    darkReverb.js
    stereoMotion.js
```

### Rules

- No new features.
- No visual changes.
- No sound redesign.
- Preserve public API.
- Preserve localStorage compatibility.
- Preserve R0.2 state machine behavior.
- Preserve slider zero = true silence.

### Acceptance Criteria

- App sounds the same.
- Engine is easier to extend.
- Build passes.
- Manual audio QA passes.

---

## R0.4 - Pulse Replacement / Resonance Layer

### Recommended AI

Claude Code.

### Goal

Remove or hide the weak Pulse layer and replace it with Resonance.

### Reason

Pulse currently overlaps with Drone and tends to create low-end conflict. It does not provide enough unique value.

### Product Decision

Pulse should not remain a core continuous layer.

Replace with:

```text
Resonance = ritual accent / tuning event / bowl-like strike
```

### Resonance Behavior

Resonance should not loop constantly.

It can trigger:

- at session start
- at session end
- manually through a subtle Strike or Resonance action
- rarely during long sessions, if enabled later

### Sound Character

- Tibetan bowl / tuning fork inspired
- soft attack
- long decay
- dark reverb
- low gain
- no harsh transient
- no pseudoscientific frequency claims

### Important

Do not market this as healing frequency technology. Treat it as a symbolic and sensory design element.

### Acceptance Criteria

- Pulse removed from main exposed mixer.
- Old sessions containing `pulse` do not break.
- Resonance can be triggered safely.
- No low-end pumping.
- Build passes.

---

## R0.5 - Scene Architecture

### Recommended AI

Claude Code.

### Goal

Move from:

```text
Mode -> Mood -> Layer Mix
```

to:

```text
Mode -> Mood -> Scene -> Layer Mix
```

### Why

The app cannot rely forever on the same Pad/Drone/Rain mix. Users need variety without the product becoming a playlist app.

### Conceptual Model

```text
Mode = why the user is here
Mood = how the user arrives
Scene = the specific ambient room
Layer = sound material
```

### Example

```text
Mode: Night Reflection
Mood: Heavy
Scene: Deep Water
Layers:
- Drone low
- Pad warm
- Rain minimal
- Analog medium
- Air low
- Resonance occasional
```

### Initial Scene Set

#### Quiet

- Still Room
- Soft Rain
- Warm Drift

#### Saturated

- Rain Shelter
- Low Fog
- Static Clearing

#### Restless

- Grounded Body
- Distant Weather
- Slow Breathing

#### Heavy

- Night Window
- Warm Analog
- Deep Water

#### Lucid

- Open Air
- Blue Focus
- Minimal Signal

### Data Model

```ts
{
  id: "soft_rain",
  moodId: "quiet",
  label: "Soft Rain",
  description: "A sheltered, low-density rain space.",
  mix: {
    drone: 0.20,
    pad: 0.48,
    rain: 0.28,
    analog: 0.06,
    air: 0.12,
    resonance: 0.05
  },
  visual: {
    palette: "indigo-rain",
    motion: "slow"
  },
  prompt: "Let the room quiet around one thought."
}
```

### Acceptance Criteria

- User can enter a session with mode, mood, and scene.
- Default scene is auto-selected if user skips scene selection.
- Scene is saved in session history.
- Older sessions without scene data still work.
- No AI yet.
- No backend.
- Build passes.

---

## R0.6 - Visual System and Immersion Foundation

### Recommended Pipeline

Figma Make for direction.
Claude Code for implementation.
Codex for bugfix/build issues.

### Goal

Make the app stop looking like a generated dark UI and start feeling like a designed symbolic ambient space.

### Design Direction

- dark liquid glass
- astronomical / lunar / alchemical sigils
- cinematic void
- editorial typography
- slow ritual motion
- subtle grain
- deep indigo / violet / teal palette
- glass panels with gradient borders
- immersive Enter Room mode

### Technology

- Tailwind for base design system
- Framer Motion / Motion for page transitions and presence
- GSAP later for more complex animation timelines
- SVG animation for sigils
- CSS gradients and grain for background atmosphere

### Scope

- Better typography.
- Stronger contrast.
- Real glass/liquid surfaces.
- More refined symbolic sigils.
- Better hover and selected states.
- Enter Room transition.
- Less dashboard feel.
- More spatial/ritual feeling.

### Acceptance Criteria

- Home, Mood, Session, and Enter Room feel coherent.
- Symbols feel custom, not emoji-derived.
- Enter Room feels immersive, not empty.
- Text readability improves.
- Desktop/tablet/mobile remain stable.
- Build passes.

---

# Phase 3 - Product Definition, Market Positioning, and Advanced Experience

## R0.7 - Competitive Research and Product Definition

### Goal

Stop building in isolation. Analyze the market and define what Inner Atlas is and is not.

### Research Targets

Study apps across several categories:

#### Meditation / Wellness

- Headspace
- Calm
- Balance
- Waking Up
- Insight Timer

#### Altered-state / Consciousness / Breath / Sound

- Expand
- Altered / Alterd-style apps
- Brainwave / binaural apps
- Sound healing apps
- breathwork apps

#### Journaling / Reflection

- Day One
- Reflectly
- Stoic
- Rosebud
- How We Feel
- mood trackers

#### Focus / Ambient / Productivity

- Endel
- Brain.fm
- Portal
- Noisli
- lofi/focus timer apps

#### Esoteric / Symbolic / Astrology

- Co-Star
- The Pattern
- TimePassages
- Moonly
- Stardust
- cycle/moon apps

### Competitive Analysis Matrix

For each competitor:

```text
Product name
Category
Core promise
Main user flow
Audio quality
Visual identity
Journaling depth
Personalization depth
Symbolic/esoteric depth
AI usage
Privacy model
Monetization
What they do well
What feels generic
What is missing
What Inner Atlas can learn
What Inner Atlas should avoid
```

### Key Questions

- Are we competing with meditation apps?
- Are we competing with journaling apps?
- Are we competing with ambient audio apps?
- Are we creating a hybrid category?
- What is the user's switching reason?
- Why open Inner Atlas instead of Spotify + Notes + Headspace?
- What is the minimum unique value?

### Name Assessment

Evaluate whether Inner Atlas fits.

Criteria:

- memorable
- emotionally accurate
- not too generic
- not too mystical
- not too clinical
- scalable into product ecosystem
- compatible with symbolic mapping
- compatible with app store search
- visually brandable

### Possible Positioning Statements

Option A:

> Inner Atlas is a private ambient journal for mapping your inner states.

Option B:

> Inner Atlas turns focus, reflection, and emotional decompression into adaptive ambient rooms.

Option C:

> Inner Atlas is a symbolic soundscape journal for focus, dreams, and inner-state tracking.

### R0.7 Deliverables

- Competitor matrix.
- Feature gap report.
- Product positioning statement.
- What Inner Atlas is / is not document.
- Name evaluation.
- v1 feature boundary proposal.

### Acceptance Criteria

R0.7 is complete when we can answer:

```text
Who is this for?
Why would they choose it?
What are we refusing to build?
What is unique?
What must be in v1?
What must wait?
```

---

## R0.8 - UX Architecture: Simple Experience vs Explorer Mode

### Goal

Resolve the tension between two user types:

```text
User A wants a simple calming experience.
User B wants deep customization and self-exploration.
```

Inner Atlas should support both without overwhelming either.

### Core UX Decision

Introduce experience depth levels.

## Experience Modes

### 1. Simple Mode

For users who just want the app to work.

Flow:

```text
Open app
choose mode
choose mood
default scene
Begin Session
```

Characteristics:

- no visible mixer
- no technical language
- no complex symbolic modules
- few choices
- fast entry
- premium atmosphere

### 2. Explorer Mode

For users who want more reflection.

Adds:

- scene selection
- intention
- journal prompts
- history
- local insights
- symbolic tags
- dream/reflection patterns

### 3. Architect Mode

For geek/nerd/power users.

Adds:

- layer mixer
- scene customization
- audio controls
- spatial settings
- symbolic module preferences
- advanced journaling metadata
- export/import settings

### UX Principle

Do not show everyone everything.

Use progressive disclosure:

```text
simple first
deep only when invited
```

### R0.8 Scope

- Onboarding preference:
  - Keep it simple
  - Let me explore
  - Give me full control
- Settings panel for experience depth.
- Mixer hidden by default except in Architect Mode.
