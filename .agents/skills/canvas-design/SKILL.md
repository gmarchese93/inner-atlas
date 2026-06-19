---
name: canvas-design
description: Create static visual design artifacts such as posters, art boards, visual philosophies, PNGs, and PDFs. Use when the user asks for a poster, static art piece, design canvas, visual philosophy, brand/art board, or museum-quality one-page visual artifact. Do not use for product UI implementation, React components, routing, audio, storage, or app refactors.
metadata:
  author: adapted-from-anthropic-skills
  version: "1.0.0"
  argument-hint: <brief-or-artifact-name>
---

# Canvas Design

Create one static visual artifact, not an app feature. The expected outputs are:

1. a short `.md` visual philosophy
2. a single `.png` or `.pdf` canvas, unless the user explicitly asks for multiple pages

Use this skill for posters, art objects, brand boards, abstract visual artifacts, one-page design pieces, or static visual explorations. Do not use it for production UI implementation, component refactors, runtime animation, accessibility audits, app state, storage, audio, routing, or tests.

## Workflow

### 1. Deduce The Quiet Reference

Identify the subtle conceptual thread in the user's request. The reference should guide form, color, rhythm, and composition without becoming literal fan art, exposition, or a copy of an existing artist's work.

If the subject is from a movie, game, book, product, person, or brand, keep the artifact original. Evoke the idea through abstract structure and atmosphere rather than copyrighted characters, logos, or direct imitation.

### 2. Write The Visual Philosophy

Create a `.md` file that names a visual movement in one or two words and describes it in 4-6 concise paragraphs.

The philosophy should specify:

- space and form
- color and material
- scale and rhythm
- composition and balance
- visual hierarchy
- craft standard

Keep it visual, not explanatory. Text in the final artifact should be sparse and integrated as a design element. Emphasize expert craftsmanship: the final piece should feel meticulously crafted, refined through many passes, and made by someone at the top of the field.

### 3. Create The Canvas

Create a single-page `.png` or `.pdf` artifact. Prefer a strong, restrained composition over visual clutter.

Use:

- repeated marks, grids, shapes, traces, or systematic patterns when useful
- limited, intentional color palettes
- precise typography as visual material, not paragraphs
- generous margins and breathing room
- clear containment; no text or graphics should fall off the page
- professional spacing, alignment, and contrast

The work should feel like an art object or museum/magazine-quality print, not a slide with decoration.

### 4. Second-Pass Refinement

Assume the first version is not polished enough. Before finalizing, do a second pass that improves what is already present instead of adding more elements.

Ask:

- Can the spacing be more deliberate?
- Can the palette be tighter?
- Can the typography feel more intentional?
- Can the existing shapes become more cohesive?
- Does anything overlap, crowd, or feel accidental?

Do not add complexity to compensate for weak craft. Refine the existing composition until it feels crisp.

## Deliverables

- Output only the requested artifact files and a concise closeout.
- Default to one `.md` philosophy and one `.png` or `.pdf`.
- For multi-page requests, keep one philosophy and create distinct pages in the same visual system.
- Do not copy living artists, known brand systems, protected characters, logos, or copyrighted compositions.
- If using fonts, prefer local/project fonts or system fonts unless the user approves downloads.
- If a task needs executable rendering code, keep it local to the artifact workflow and do not introduce app runtime dependencies.

## Routing Notes

Use `emil-design-eng` or `review-animations` for interactive UI motion craft. Use `web-design-guidelines` for UI/accessibility audits. Use `canvas-design` only for static visual artifacts.
