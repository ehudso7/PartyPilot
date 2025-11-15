# TASKS – PartyPilot Build Plan

## Phase 0 – Setup

1. Initialize monorepo (pnpm or npm workspaces).
2. Create `apps/api` with TS, Express, ts-node-dev or similar.
3. Add Prisma + PostgreSQL connection.
4. Implement DB schema from DB_SCHEMA.md into schema.prisma.
5. Run migrations, confirm DB is live.

## Phase 1 – Core Backend

1. Implement modules:
   - users (basic CRUD)
   - trips
   - events
   - venues
2. Implement `POST /api/trips/plan` with a stub planner that:
   - Accepts prompt
   - Returns hard-coded simple trip (for now)
   - Writes to DB
3. Implement `GET /api/trips/:tripId`.

## Phase 2 – Planner Integration

1. Implement planner service using LLM:
   - Read PLANNER_LOGIC.json.
   - Validate JSON output.
2. Enhance `POST /api/trips/plan` to:
   - Call planner
   - Create trip + events
   - Call venue service to match requirements to venues.
3. Add seat data for NYC test venues (Bohemian, Da Andrea, Upstairs @ 66, 230 Fifth, etc.) in DB seed.

## Phase 3 – Reservations

1. Implement `reservations` module:
   - DB repository
   - Service logic for method branching (`api`, `deeplink`, `webview_form`, `manual`).
2. Implement `/api/reservations/prepare`.
3. Implement stub `/api/reservations/book` for `api` method that simulates success.

## Phase 4 – Exports

1. Implement ICS generator:
   - Pure TS function → string.
   - Exposed via `/api/trips/:tripId/export/ics`.
2. Implement PDF generator:
   - Use a minimal PDF lib or HTML+pdf service.
   - Expose via `/api/trips/:tripId/export/pdf`.
3. Implement group chat text generator (LLM or pure template).

## Phase 5 – Notifications

1. Implement `notifications` module and `/api/trips/:tripId/notifications/bootstrap`.
2. Implement a simple scheduler worker that:
   - Checks due notifications
   - Logs them or sends via stub (extend later).

## Phase 6 – Frontend MVP

1. Implement simple web UI:
   - Prompt input → calls `/api/trips/plan`.
   - Show timeline of events.
   - Buttons for:
     - "Prepare reservations"
     - "Download ICS"
     - "Download PDF"
     - "Copy group message"

## Phase 7 – Polish

1. Error handling & input validation.
2. Logging & basic observability.
3. Security hardening (rate-limits, API keys).