# Inner Atlas Product Spec

## Product Intent

Inner Atlas is a reflective introspection app. It is not a productivity tool, dashboard, habit tracker, or analytics product.

The product combines:

- guided session entry through mode and mood selection
- mindfulness-oriented soundscapes
- short-form journaling
- symbolic visual atmosphere
- private local session history

The intended feeling is calm, intentional, reflective, and slightly ritualized. The user should feel that they are entering a space, not operating software.

## Current Product Surface

### Home

The home screen asks the user to choose a state. Each mode changes the visual and audio context for the session.

Current modes:

- Deep Focus
- Night Reflection
- Cognitive Unload

The home screen also links to local session history.

### Mood Selection

After choosing a mode, the user chooses how they are arriving emotionally.

Current moods:

- Quiet
- Saturated
- Restless
- Heavy
- Lucid

The selected mood defines the initial sound mix through mood presets.

### Session

The session screen is the core experience. It includes:

- a timer
- Begin, Pause, Resume primary control
- optional intention selection
- adjustable soundscape mixer
- journal textarea
- room mode for reduced UI focus
- End and Save
- Discard Session

Sessions can continue silently if Web Audio is unavailable. The app should show that condition without blocking journaling or timing.

### History

Saved sessions are stored on the device and shown in history. History includes:

- mode
- mood
- duration
- optional intention
- saved journal text
- export JSON
- delete one or all sessions

## Persistence

Inner Atlas currently uses localStorage-based persistence.

Saved sessions are persistent history records. Active drafts preserve in-progress session state, including journal text, intention, mix, duration, and created date.

Compatibility requirement:

- preserve old audio mix keys where possible, including mapping the old `tape` key to `analog`
- do not break existing saved sessions or active drafts without an explicit migration

## R0.2 Session Control Contract

The R0.2 control contract is:

- Begin Session starts the timer, starts or resumes audio, fades in, and ends in `playing`
- Pause pauses the timer, fades audio out, suspends audio, and ends in `paused`
- Resume resumes audio, fades in, restarts the timer, and ends in `playing`
- End and Save stores the final session, clears the active draft, fades audio out, then navigates to history
- Discard clears the active draft, fades audio out, then returns home

During audio/session transitions, duplicate primary clicks must be ignored or disabled. The UI must not show an active session while audio is stuck silent because of overlapping fade operations.

## Non-Goals For Current Release

Do not add these without a specific milestone:

- cloud sync
- accounts or authentication
- analytics
- social sharing
- productivity metrics
- complex dashboards
- AI interpretation of journal entries
- broad redesign of the current session UI

## Product Principles

- Preserve the user's sense of privacy.
- Prefer quiet, sparse UI over dense controls.
- Make controls predictable under rapid interaction.
- Let sound and atmosphere support reflection without dominating it.
- Treat session teardown as part of the experience, not as an abrupt technical cleanup.
