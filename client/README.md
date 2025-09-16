EcoSoil Client (Vite + React + MUI)

Setup

- Requirements: Node 18+, npm
- Env: create `client/.env` (optional) and set `VITE_API_BASE=http://localhost:4000`
- Install deps: `cd client && npm install`
- Start dev: `npm run dev` (open http://localhost:5173)

Features

- Auth: Login/Register, JWT stored via Zustand (persist)
- Protected routes: New Analysis, Processing, Results, Detailed Report, Dashboard
- Analysis wizard: 3 steps, up to 5 images, previews
- Processing page: countdown + polling
- Results + Detailed pages: metrics, charts (Recharts), recommendations, tabs
- Share & PDF:
  - Detailed Report page: toggle sharing, copy share link
  - Download polished PDF report
  - Public share page: `/share/:id?token=...` (read-only)
- i18n: UZ/RU/EN til switcher (Navbar)
- PWA: offline caching (vite-plugin-pwa), auto SW update
- Dashboard: Profile edit, Analysis history, Settings toggles
- Static pages: Home, Technologies, Help Center (FAQ)

Structure

- `src/pages/` views
- `src/components/` reusable components
- `src/store/` Zustand stores
- `src/services/` Axios API client
- `src/layouts/` Main layout
# Frontend deployment trigger
