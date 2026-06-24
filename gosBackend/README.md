# gosBackend

Backend API using TypeScript, Express, PostgreSQL and Prisma with JWT authentication.

Quick start

1. Copy `.env.example` to `.env` and set values.
2. Install deps: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Run migration: `npm run prisma:migrate`
5. Start dev server: `npm run dev`

API Endpoints

- `POST /api/auth/register` — register
- `POST /api/auth/login` — login (returns token + user)
- `POST /api/auth/logout` — logout
- `GET /api/admin/dashboard` — admin only
- `GET /api/manager/dashboard` — manager only
- `GET /api/employee/dashboard` — employee only
- `GET /api/user/dashboard` — user+ roles
