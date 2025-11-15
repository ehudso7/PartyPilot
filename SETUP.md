# Setup Instructions

## Phase 0 & 1 Complete! ✅

The PartyPilot backend has been successfully set up with:
- ✅ Monorepo workspace structure
- ✅ TypeScript + Express API
- ✅ Prisma ORM with PostgreSQL schema
- ✅ Core modules: users, trips, events, venues
- ✅ Trip planning endpoint with stub planner
- ✅ Database migrations ready
- ✅ Docker Compose configuration
- ✅ Seed data for NYC venues

## Quick Start

### 1. Database Setup

You have two options:

#### Option A: Local PostgreSQL with Docker (Recommended)

If you have Docker installed:

```bash
# Start PostgreSQL container
docker compose up -d

# Wait a few seconds for PostgreSQL to start, then run migrations
cd apps/api
npm run db:migrate

# Seed sample data
npm run db:seed
```

#### Option B: Use a Hosted Database (Supabase, Neon, etc.)

1. Create a PostgreSQL database on your preferred provider
2. Update the `DATABASE_URL` in `.env` with your connection string
3. Run migrations:

```bash
cd apps/api
npm run db:migrate
npm run db:seed
```

### 2. Start the API Server

```bash
# From the root directory
npm run dev:api
```

The server will start on `http://localhost:3000`

### 3. Test the API

#### Health Check
```bash
curl http://localhost:3000/api/health
```

#### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1234567890"
  }'
```

#### Plan a Trip
```bash
curl -X POST http://localhost:3000/api/trips/plan \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key" \
  -d '{
    "prompt": "Set up my bachelor party in NYC on Jan 17, 2026, 15 people, Italian dinner, games bar, rooftop",
    "userId": "USER_ID_FROM_PREVIOUS_STEP"
  }'
```

#### Get Trip Details
```bash
curl http://localhost:3000/api/trips/TRIP_ID \
  -H "x-api-key: dev-api-key"
```

## What's Been Built

### Phase 0 - Setup ✅
- Monorepo with npm workspaces
- TypeScript + Express backend
- Prisma + PostgreSQL
- Docker Compose configuration

### Phase 1 - Core Backend ✅
- **Users Module**: Full CRUD operations
- **Venues Module**: Search, filter, and manage venues
- **Events Module**: Create and manage trip events
- **Trips Module**: Create and manage trips
- **Planner Service**: Stub implementation that parses prompts and generates trip plans
- **API Endpoints**:
  - `POST /api/trips/plan` - Main trip planning endpoint
  - `GET /api/trips/:id` - Get trip with events and venues
  - `GET /api/trips/:id/events` - Get all events for a trip
  - Full CRUD for users, venues, events

### Database Schema
All tables from `DB_SCHEMA.md` have been implemented:
- users
- trips
- venues
- events
- reservations (structure ready for Phase 3)
- notifications (structure ready for Phase 5)
- share_links (structure ready for Phase 4)

### Sample Data
The seed script includes 6 real NYC venues:
- Da Andrea (Italian, Resy integration)
- 230 Fifth Rooftop Bar (Rooftop, manual booking)
- Upstairs @ 66 (OpenTable deeplink)
- Bohemian (Upscale, manual)
- Taco Mix (Budget-friendly)
- Bowlmor Lanes (Games bar, webview form)

## Next Steps - Phase 2

The next phase will integrate a real LLM for trip planning:

1. **LLM Integration**
   - Connect to OpenAI or other LLM provider
   - Implement structured output based on `PLANNER_LOGIC.json`
   - Parse natural language prompts into trip plans

2. **Enhanced Venue Matching**
   - Implement smart venue selection based on requirements
   - Add backup venue logic
   - Consider distance, ratings, and preferences

3. **Venue Database Expansion**
   - Add more NYC venues
   - Implement venue search/discovery
   - Add venue tags and categories

## Project Structure

```
/workspace/
├── apps/
│   └── api/
│       ├── src/
│       │   ├── config/          # Environment and logging
│       │   ├── db/              # Prisma client
│       │   ├── middleware/      # Auth and error handling
│       │   ├── modules/
│       │   │   ├── users/       # User management
│       │   │   ├── trips/       # Trip management
│       │   │   ├── events/      # Event management
│       │   │   ├── venues/      # Venue management
│       │   │   └── planner/     # Trip planning logic (stub)
│       │   ├── routes/          # API route definitions
│       │   ├── server.ts        # Express app setup
│       │   └── index.ts         # Entry point
│       ├── prisma/
│       │   ├── schema.prisma    # Database schema
│       │   └── seed.ts          # Seed data
│       └── package.json
├── docs/                        # All documentation
├── docker-compose.yml           # PostgreSQL container
├── .env                         # Environment variables
└── package.json                 # Root workspace config
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker compose ps`
- Check DATABASE_URL in `.env`
- Verify PostgreSQL logs: `docker compose logs postgres`

### Port Already in Use
- Change PORT in `.env` to a different port
- Or stop the service using port 3000

### Migration Issues
- Reset database: `cd apps/api && npx prisma migrate reset`
- This will drop all data and recreate tables

## Documentation

All project documentation is in the `docs/` folder:
- `PRD.md` - Product Requirements Document
- `ARCHITECTURE.md` - System architecture overview
- `API_SPEC.md` - Complete API specification
- `DB_SCHEMA.md` - Database schema details
- `TASKS.md` - Development roadmap and phases
- `PLANNER_LOGIC.json` - Trip planning schema

## Development Commands

```bash
# Start API in dev mode (with auto-reload)
npm run dev:api

# Build API for production
npm run build:api

# Database commands
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio (GUI)
npm run db:generate   # Generate Prisma Client

# Seed database
cd apps/api && npm run db:seed
```

## API Authentication

For development, the API uses a simple API key:
- Header: `x-api-key: dev-api-key`
- Change this in `.env` for production

## Status: Phase 1 Complete ✅

The backend is fully functional and ready for Phase 2 LLM integration!
