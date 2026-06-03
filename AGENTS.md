# Inner Atlas

## Skill Router

Before starting, inspect the available skills and select only the skills relevant to the task.

Core rules:

- Prefer Inner Atlas project-specific skills over generic skills when they overlap.
- Use the minimum useful skill set.
- Do not use unrelated skills.
- Do not add dependencies only because a skill exists.
- Do not use mobile, iOS, macOS, Expo, Twilio, Zoom, Stripe, Gmail, Outlook, SharePoint, Slack, Teams, HubSpot, life-science, Hugging Face, deployment, database, auth, payments, analytics, automation, or CI/CD skills unless the task explicitly requires them.

## Local Skill And Tool Discovery

Before selecting skills for substantial work, check both:

- the active visible skill list
- locally installed plugin/skill caches when a requested or relevant skill is not visible

Relevant local tools/skills may include:

- Superpowers
- AgentMemory
- Gitleaks
- OSV-Scanner
- uv
- gsd
- Matt Pocock TypeScript skills
- AI Engineering From Scratch
- ECC

Use these only when relevant to the task. Do not force them into every request.

If a requested tool or skill is not visible, search the local machine before declaring it unavailable. If it still cannot be found, report that clearly.

For security scans:

- use Gitleaks when secrets, tokens, pre-release risk, or public push risk is relevant
- use OSV-Scanner when dependencies change or before beta/release checks

For memory:

- use AgentMemory only for durable project context, handoff, recall, and milestone summaries
- do not store transient logs, command noise, secrets, or speculative thoughts

For TypeScript:

- use Matt Pocock / TypeScript-specific skills when doing non-trivial TypeScript typing, migrations, or type-level refactors

For workflow:

- use Superpowers skills for systematic debugging, TDD, code review handling, plan execution, and verification when relevant

## Task-Based Routing

For feature planning:

- use `inner-atlas-planner`
- use planning skills when relevant

For refactors:

- use `inner-atlas-refactor`
- preserve behavior and visuals unless explicitly changed

For reviews:

- use `inner-atlas-review`
- use review/verification skills
- prioritize bugs, regressions, accessibility, state risks, and missing tests

For review feedback:

- use `receiving-code-review`
- validate each finding independently
- distinguish valid issues from false positives
- do not blindly accept all feedback

For bugs:

- use `systematic-debugging` before proposing fixes

For React/TypeScript changes:

- use React/TypeScript best-practice skills when available
- use Matt Pocock / TypeScript-specific skills for non-trivial typing work

For browser behavior:

- use `webapp-testing`, frontend testing, or Playwright-style verification when available and relevant

For current library/API docs:

- use `context7-mcp`

For broad repo analysis:

- use `repomix-explorer`
- do not use it for small targeted file inspection

For large outputs/logs/test results:

- summarize clearly
- use context/log-management skills when available instead of dumping raw output

## Visual, Motion, And Immersive UI Routing

For any visual/UI/motion task, first check whether `inner-atlas-visual-refactor` is available.

Use `inner-atlas-visual-refactor` when the task involves:

- visual redesign
- UI polish
- atmosphere
- motion
- layout hierarchy
- symbolic UI
- ambient visuals
- typography
- glass/liquid styling
- interaction refinement
- mood-based scenes
- frontend aesthetic audits

Then select the minimum specialist skills.

Preferred stack:

- CSS/Tailwind for layout, gradients, glass, typography, spacing, and surfaces
- React for application and component structure
- SVG for crisp symbolic glyphs and icons
- Motion / Framer Motion for component transitions and presence
- GSAP for choreographed animation timelines or complex ritual motion
- p5.js for ambient generative canvas layers
- Three.js / React Three Fiber / Drei only for true 3D or spatial scenes

Use p5.js only when the task requires ambient generative visuals, symbolic particles, flow fields, procedural mood scenes, breathing glyphs, water/noise/fog/star motion, or audio-reactive canvas layers.

Do not use p5.js for ordinary UI layout, buttons, typography, journal formatting, routing, component state, storage, or audio engine logic.

If p5.js is selected, also use:

- `inner-atlas-p5-visual-layer`
- React/frontend verification skills when available
- browser verification when behavior or visual output changes

Use Motion / Framer Motion only when implementing page transitions, presence, component animation, or UI state motion.

Use GSAP only when implementing or debugging GSAP timelines, ScrollTrigger, advanced choreography, or performance-sensitive animation.

Use Three.js / React Three Fiber / Drei only if the feature genuinely benefits from 3D space, depth, camera movement, shaders, spatial objects, or immersive room rendering.

Do not add Motion, GSAP, p5.js, Three.js, React Three Fiber, or Drei dependencies speculatively.

ASCII art is not part of the Inner Atlas product UI. Use ASCII only for CLI banners, terminal output, README decoration, dev tooling, or intentional text-art experiments. If ASCII routing is relevant, use `inner-atlas-ascii-routing`.

## Before Editing

Before modifying code, state:

- selected skills
- rejected obvious skills, if any
- why each selected skill applies
- expected files likely touched
- implementation plan
- risks and tradeoffs

## After Implementation

After implementation, report:

- selected skills
- files changed
- summary of changes
- commands run
- verification evidence
- browser/manual QA evidence when UI or behavior changed
- remaining risks
- deferred refactors

Do not claim completion without verification evidence.

## Project Vision

Inner Atlas is not a productivity application.

The goal is creating a psychologically meaningful introspection platform combining:

- journaling
- symbolic reflection
- mindfulness
- emotional mapping
- aesthetic interaction

The experience should feel calm, intentional and reflective.

Avoid generic corporate SaaS patterns.

---

## Technical Stack

- React
- TypeScript
- Vite
- Tailwind

---

## Development Philosophy

Prioritize:

1. Architecture
2. Readability
3. User experience
4. Performance

Never optimize prematurely.

---

## Design Language

Influences:

- Headspace
- Apple Human Interface Guidelines
- Calm
- Obsidian
- Minimal Japanese design
- Atmospheric creative portfolios

Avoid:

- excessive gradients
- crypto aesthetics
- dashboard overload
- enterprise UI feeling

---

## Coding Standards

- Strict TypeScript
- No any unless justified
- Prefer reusable hooks
- Prefer reusable UI primitives
- Keep files under reasonable size
- Extract repeated logic

---

## Before Large Changes

Always:

- explain the architecture impact
- explain alternatives
- explain tradeoffs

---

## Release Process

For each feature:

- implement
- lint
- test
- summarize changes
- identify technical debt
