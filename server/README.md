EcoSoil Server (Express + PostgreSQL)

Setup

- Requirements: Node 18+, PostgreSQL 14+, npm
- Copy `.env.example` to `.env` and adjust values
- Create database `ecosoil` (or update `DATABASE_URL`)
- Install deps: `npm install` (in `server/`)
- Run migrations (psql): `npm run migrate`
- Start dev: `npm run dev`

Requirements

- `psql` CLI available on your PATH (used by the migrate script)

Environment Variables

- `PORT`: Server port (default 4000)
- `DATABASE_URL`: Postgres connection string
- `JWT_SECRET`: Secret for signing JWTs
- `UPLOADS_DIR`: Local uploads directory (relative to `server/`)

Endpoints (prefix `/api`)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/analyses` (multipart/form-data)
- `GET /api/analyses`
- `GET /api/analyses/:id`

Notes

- Image uploads are stored under `server/uploads` and served at `/uploads/*`.
- Migrations are executed from `migration.sql` via psql.
- AI analysis is simulated with a 45–60s delay and mocked results.
