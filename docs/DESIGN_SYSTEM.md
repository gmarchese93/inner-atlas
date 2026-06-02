# Inner Atlas Design System

## Design Direction

Inner Atlas should feel calm, reflective, intimate, and intentional. It should not look like a SaaS dashboard, crypto interface, enterprise tool, or generic wellness template.

Reference influences:

- Headspace
- Calm
- Apple Human Interface Guidelines
- Obsidian
- minimal Japanese design
- atmospheric creative portfolios

## Visual Language

The current interface uses:

- dark atmospheric backgrounds
- mode-specific accent colors
- soft glass surfaces
- low-opacity borders
- gentle entrance motion
- symbolic glyphs
- restrained typography

The app should keep a quiet emotional tone. Controls should feel touchable and deliberate, but not loud.

## Typography

Current font roles:

- Display: `Cormorant Garamond`, used for reflective headings and large timer text
- Body: system UI stack, used for controls, labels, and supporting text

Guidelines:

- Use light display typography for reflective copy.
- Use compact body text for controls and labels.
- Keep tracking subtle and consistent with existing uppercase labels.
- Do not use oversized marketing hero language inside the app flow.

## Color

Base surfaces are dark and low-contrast. Accent colors come from the selected mode.

Current modes:

- Deep Focus: purple accent `#7c6fcd`
- Night Reflection: blue accent `#4a90d9`
- Cognitive Unload: green accent `#2d9b6f`

Guidelines:

- Use accents sparingly for state, glow, and symbolic continuity.
- Keep text opacity intentionally tiered.
- Avoid saturated panels, heavy gradients, and bright call-to-action treatment.
- Avoid adding unrelated palettes unless tied to a new mode.

## Surfaces

The shared `glass-card` style is the current primitive for framed interactive surfaces.

Characteristics:

- very low white fill
- subtle white border
- slightly stronger top border
- inset highlight
- mild backdrop blur

Use cards for:

- mode choices
- mood choices
- mixer container
- confirmations
- history records

Avoid nested cards unless the interaction genuinely requires a framed sub-surface.

## Motion

Current motion is slow and ambient:

- card appear
- fade in
- glyph breathing
- sigil pulse
- gradient drift

Guidelines:

- Motion should support calm presence, not entertainment.
- Prefer opacity and transform transitions.
- Avoid abrupt layout shifts.
- Disable or simplify motion in future if reduced-motion support is added.

## Components And Interaction Patterns

### Primary Session Button

The primary button changes label by session state:

- `Begin Session`
- `Pause`
- `Resume`

During transition states it is disabled and uses `aria-busy`.

### Confirmation Actions

Destructive actions use subdued red and require confirmation where the current flow does so.

### Mixer

The mixer is collapsible. Sliders map directly to audio layer values from 0 to 1. A value of 0 must mean true silence for that layer.

### Room Mode

Room mode removes most controls and centers the timer, selected mode/mood, and symbolic mood glyph. It is a reduced attention state, not a separate feature area.

## Accessibility Baseline

Current baseline:

- native buttons
- disabled primary control during transitions
- `aria-busy` on primary control during transitions
- keyboard Escape exits room mode

Known future improvements:

- add accessible labels to icon-only history controls
- consider an `aria-live="polite"` session status announcement
- add reduced-motion handling for atmospheric animations

## Design Constraints

Preserve:

- current visual layout unless a milestone explicitly changes it
- calm/reflective tone
- mode and mood symbolic system
- local-first privacy messaging

Avoid:

- dashboard density
- decorative complexity that competes with journaling
- generic wellness stock imagery
- enterprise UI patterns
