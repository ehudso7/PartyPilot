# PartyPilot

PartyPilot is a natural-language event planning and booking platform. This mono-repo currently contains the backend API service built with Node.js, Express, TypeScript, and Prisma.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Provide environment variables**
   ```bash
   cp apps/api/.env.example apps/api/.env
   # edit DATABASE_URL / PORT as needed
   ```
3. **Run Postgres locally (optional)**
   ```bash
   docker compose up -d postgres
   ```
4. **Generate Prisma client & run migrations**
   ```bash
   npm run prisma:generate -w @partypilot/api
   npm run prisma:migrate -w @partypilot/api
   ```
5. **Start the API**
   ```bash
   npm run dev:api
   ```

The API boots on `http://localhost:4000` by default and exposes REST endpoints under the `/api` prefix.

## Available Scripts

- `npm run dev:api` – start the API in watch mode.
- `npm run build:api` – type-check and emit JavaScript to `apps/api/dist`.
- `npm run start:api` – run the compiled production build.
- `npm run prisma:* -w @partypilot/api` – manage the Prisma schema (generate, migrate, studio).

## Phase 1 Deliverables

- Core modules implemented: users, trips, events, venues, planner.
- `POST /api/trips/plan` persists a stub itinerary via the planner workflow.
- `GET /api/trips/:tripId` returns trips with events, venues, reservations, and notifications.
- CRUD endpoints for foundational entities to unblock future phases.