# PartyPilot

Natural-language event planning and booking system for social outings.

## Overview

PartyPilot creates and manages multi-stop social outings (bachelor parties, birthdays, bar crawls, group events) from a single natural-language prompt.

Features:
- AI-powered trip planning
- Venue selection + booking automation
- Calendar (.ics) + PDF generation
- Backup plan logic
- Weather + dress code + travel reminders
- Group-sharing + itinerary links

## Project Structure

```
partypilot/
├── apps/
│   └── api/              # Backend Express + TypeScript API
├── docs/                 # Project documentation
├── docker-compose.yml    # PostgreSQL container
└── package.json          # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

4. Start PostgreSQL:

```bash
docker-compose up -d
```

5. Run database migrations:

```bash
npm run db:migrate
```

6. Start the development server:

```bash
npm run dev:api
```

The API will be available at `http://localhost:3000`

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/trips/plan` - Plan a trip from natural language prompt
- `GET /api/trips/:id` - Get trip details
- `GET /api/trips/:id/events` - Get trip events
- Full API documentation available in `docs/API_SPEC.md`

### Example Request

```bash
curl -X POST http://localhost:3000/api/trips/plan \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key" \
  -d '{
    "prompt": "Set up my bachelor party in NYC on Jan 17, 2026, 15 people, Italian dinner, games bar, rooftop",
    "userId": "USER_ID"
  }'
```

## Development

### Database

- View database: `npm run db:studio`
- Create migration: `npm run db:migrate`

### Project Documentation

See `docs/` folder for:
- `PRD.md` - Product requirements
- `ARCHITECTURE.md` - System architecture
- `API_SPEC.md` - API specification
- `DB_SCHEMA.md` - Database schema
- `TASKS.md` - Development roadmap

## Current Phase

**Phase 1 Complete** - Core Backend
- ✅ Users, trips, events, venues modules
- ✅ Trip planning endpoint with stub planner
- ✅ Database schema + migrations
- ✅ Basic CRUD operations

**Next: Phase 2** - LLM Planner Integration
- Integrate OpenAI/LLM for trip planning
- Implement venue matching logic
- Add NYC test venues seed data

## License

MIT
