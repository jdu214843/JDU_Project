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
- `WEB_BASE_URL` (optional): Client app URL used for links in emails
- `SMTP_HOST` (optional): SMTP server host to enable email sending
- `SMTP_PORT` (optional): SMTP server port (465 for SSL, 587 for STARTTLS)
- `SMTP_USER` (optional): SMTP username
- `SMTP_PASS` (optional): SMTP password
- `SMTP_FROM` (optional): From header, e.g. `EcoSoil <no-reply@ecosoil.example>`

Endpoints (prefix `/api`)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/analyses` (multipart/form-data)
- `GET /api/analyses`
- `GET /api/analyses/:id`
- `POST /api/users/me/send-test-email` (auth) — send SMTP test email to current user
- `GET /api/analyses/:id/report.pdf` (auth) — generate and stream PDF report
- `GET /api/analyses/:id/progress` (SSE) — server-sent progress updates; accepts `Authorization: Bearer <token>` or `?token=<JWT>`
- `POST /api/analyses/:id/share` (auth, body: `{ enable: boolean }`) — enable/disable sharing, returns share URL
- `GET /api/analyses/:id/share` (auth) — get current sharing status and URL
- `GET /api/public/analyses/:id?token=...` — public, read-only shared analysis
- `GET /api/public/analyses/:id/report.pdf?token=...` — public, shared PDF report

Notes

- Image uploads are stored under `server/uploads` and served at `/uploads/*`.
- Migrations are executed from `migration.sql` via psql.
- AI analysis is simulated with a 45–60s delay and mocked results.
- If SMTP is configured, users receive an email report when an analysis completes. If not configured, the email content is logged to the server console and sending is skipped.
- PDF reports are generated on the fly; use the endpoints above to download or share.

SMTP Test

- Get a JWT by logging in (`POST /api/auth/login`).
- Call `POST /api/users/me/send-test-email` with header `Authorization: Bearer <token>`.
- If SMTP is configured, you should receive a test email at your account email. If not configured, the server logs a message and returns `sent: false`.
