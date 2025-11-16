# PartyPilot

PartyPilot is an AI-assisted nightlife planner that turns a single natural language brief into a multi-stop itinerary, venue bookings, exports, and notifications.

## Prerequisites

- Node.js 18.18+
- npm 10+
- PostgreSQL 16 (can be installed via `sudo apt-get install postgresql` or any managed instance)

## Getting Started

```bash
cp .env.example .env            # edit API + web settings as needed
npm install                     # install root + workspace deps
sudo service postgresql start   # ensure PostgreSQL is running locally
```

Create the database user the API expects:

```bash
sudo -u postgres psql -c "CREATE USER partypilot WITH PASSWORD 'partypilot' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE partypilot OWNER partypilot;"
```

Run Prisma migrations + generate the client:

```bash
npx prisma migrate dev --schema apps/api/prisma/schema.prisma
```

## Development Commands

```bash
npm run dev:api   # start Express API on http://localhost:4000
npm run dev:web   # start Next.js client on http://localhost:3000
```

Use the combined watcher:

```bash
npm run dev       # runs API + web concurrently
```

## Quality Checks

```bash
npm run lint -w apps/api   # TypeScript type checking for the API
npm run lint -w apps/web   # Next.js ESLint suite for the web client
```

## API Smoke Tests

```bash
curl http://localhost:4000/api/health
curl -X POST http://localhost:4000/api/trips/plan \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Plan a 15-person NYC bachelor party","user":{"email":"you@example.com"}}'
```