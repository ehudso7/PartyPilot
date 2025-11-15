# ARCHITECTURE – PartyPilot

## Stack

- Node.js + TypeScript
- Express
- Prisma + PostgreSQL
- Optional: Docker for local dev
- LLM provider configured via env (e.g., OPENAI_API_KEY)

---

## Backend Layers

### 1. Entry

- `apps/api/src/index.ts` – start script
- `apps/api/src/server.ts` – Express app config

### 2. Config

- `config/env.ts` – read and validate env vars.
- `config/logger.ts` – basic logger.

### 3. DB

- `db/prismaClient.ts` – Prisma singleton.

### 4. Modules

Each module has:
- `controller.ts`
- `service.ts`
- `repository.ts`
- `types.ts`
- `routes.ts` (or central routes folder)

Modules:
- `trips`
- `events`
- `venues`
- `reservations`
- `notifications`
- `planner` (LLM logic, no HTTP)

### 5. Planner Module

- Input: `prompt`, `userId`.
- Steps:
  1. Call LLM with instructions + PLANNER_LOGIC.json schema.
  2. Parse JSON into typed TS structures.
  3. Persist trip + events.
  4. For each event, call venue service to find real `venues` matching requirements.
  5. Attach primary venues.

- Output: created `trip`, `events`, `venues`.

### 6. Reservation Module

- `bookingType` & `bookingProvider` drive behavior.

- `api`:
  - Call `providers/opentable.ts` or similar stub.
- `deeplink`:
  - `providers/deeplinkBuilder.ts` uses known URL templates, e.g:
    - `https://www.opentable.com/restaurant/profile/{id}?covers={partySize}&datetime={iso}`
- `webview_form`:
  - Return `{ bookingUrl, suggestedFields }`.
- `manual`:
  - Uses LLM to craft email/call/DM templates.

### 7. Notifications

- Job/scheduler (could be:
  - Hosted cron, or
  - Simple script triggered via `node-cron` in MVP).
- Looks for upcoming `notifications` rows with `status = scheduled` and `scheduledFor <= now`.
- Sends via chosen channel (stubbed in v1).

---

## Frontend Skeleton

(You can choose React web first, then mobile.)

Must support:
- Trip creation via text prompt.
- Itinerary timeline.
- Reservation cards (with action buttons).
- Export / share buttons.
- Day-of “Now/Next” view.