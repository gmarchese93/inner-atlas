# Inner Atlas

A focused, atmospheric mindfulness app for choosing mental states and ambient audio sessions. All data stays on-device.

## Run & Operate

- Start the `artifacts/inner-atlas: web` workflow to run the app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (JSX), Tailwind CSS v3, react-router-dom
- Fonts: Cormorant Garamond (display) via Google Fonts
- Audio: Web Audio API (custom engine in `src/lib/audioEngine.js`)
- Data: localStorage only (no backend DB needed)

## Where things live

- `artifacts/inner-atlas/` — the React frontend app
- `artifacts/inner-atlas/src/pages/` — Home, MoodSelector, Session, History
- `artifacts/inner-atlas/src/components/` — AudioMixer, GradientBackground, MoodGlyph, Timer, JournalArea
- `artifacts/inner-atlas/src/lib/` — audioEngine, sessionStorage, constants, activeSession
- `artifacts/inner-atlas/tailwind.config.js` — theme (fonts, colors, animations)
- `artifacts/inner-atlas/src/index.css` — CSS custom properties + animation keyframes

## Architecture decisions

- No backend — all session data is persisted in `localStorage` via `src/lib/sessionStorage.js`
- AuthContext is a no-op wrapper (original app had no auth requirements despite Base44 SDK usage)
- Tailwind v3 with PostCSS (not Tailwind v4 / `@tailwindcss/vite`) — copy script preserved the original config
- react-router-dom (not wouter) — the original app used BrowserRouter with 4 routes

## Product

Users choose a mental state (Deep Focus, Night Reflection, Cognitive Unload), pick a mood, then enter an ambient audio session with customizable sound layers. Session history is stored locally and can be exported.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- AuthContext.js must use `.jsx` extension because it contains JSX
- The Vite config uses `css.postcss.plugins` (not `@tailwindcss/vite`) because Tailwind v3 was preserved from the original
- Don't run `pnpm dev` at the workspace root — use workflows instead

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
