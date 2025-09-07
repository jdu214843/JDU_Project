EcoSoil Monorepo

Structure

- `server/`: Node.js (Express) backend with PostgreSQL
- `client/`: React (Vite) frontend

Quick Start (Server)

- Create DB and copy `server/.env.example` to `server/.env`
- Install deps: `cd server && npm install`
- Run migrations: `npm run migrate`
- Start dev: `npm run dev` (serves at `http://localhost:4000`)

Quick Start (Client)

- `cd client && npm install`
- Optional: create `client/.env` and set `VITE_API_BASE=http://localhost:4000`
- `npm run dev` (opens at `http://localhost:5173`)

API Summary

- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Users: `GET /api/users/me`, `PUT /api/users/me`
- Analyses: `POST /api/analyses` (multipart), `GET /api/analyses`, `GET /api/analyses/:id`

Uploads

- Images saved under `server/uploads` and publicly served at `/uploads/*`.

Next Steps

- Scaffold `client/` with Vite, MUI, Zustand, Recharts, Axios and react-router.
- Connect auth + analysis flows to backend.
