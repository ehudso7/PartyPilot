# PartyPilot

PartyPilot is an AI-assisted event planning stack that turns a single natural-language prompt into a multi-stop NYC itinerary, reservation prep, and shareable exports.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend:** React + Vite + Tailwind, React Query
- **Infrastructure:** pnpm workspaces, Prisma migrations, Docker Compose (for Postgres)

## Repository Layout

```
apps/
  api/   # Express + Prisma backend
  web/   # React web client
packages/
  ...   # shared packages (future)
```

Key specs live in `PRD.md`, `ARCHITECTURE.md`, `API_SPEC.md`, and `DB_SCHEMA.md`.

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Provide environment variables**
   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```
   Update `DATABASE_URL`, `FRONTEND_URL`, and API keys as needed.
3. **Start PostgreSQL**
   ```bash
   docker compose up -d db
   ```
4. **Run migrations & generate Prisma client**
   ```bash
   pnpm --filter @partypilot/api prisma:migrate
   pnpm --filter @partypilot/api prisma:generate
   ```
5. **Start backend & frontend**
   ```bash
   pnpm --filter @partypilot/api dev
   pnpm --filter @partypilot/web dev
   ```

Visit `http://localhost:5173` to access the planner UI.

## Available Scripts

- `pnpm dev` – run all app dev servers concurrently
- `pnpm build` – build all workspaces
- `pnpm lint` – lint backend and frontend
- `pnpm test` – reserved for test suites (to be expanded)

## Planner Flow (Phase 1)

1. **POST /api/users** – create or rehydrate a user by email.
2. **POST /api/trips/plan** – stub planner parses the prompt, selects curated NYC venues, persists trip + events, and returns the itinerary.
3. **GET /api/trips/:tripId** – fetch trip, events, venues, reservations, notifications (reservations/notifications empty until future phases).

Frontend form automatically creates a user, triggers the planner, and renders the itinerary timeline plus trip summary. Future phases will add reservation automation, exports, and notifications per the PRD.
