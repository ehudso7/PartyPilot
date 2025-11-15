# PartyPilot

Natural-language event planning and booking system for social outings (bachelor parties, birthdays, bar crawls, etc.).

## Project Structure

```
partypilot/
├── apps/
│   └── api/              # Express + TypeScript backend
│       ├── src/
│       │   ├── modules/   # Feature modules (users, trips, events, venues, etc.)
│       │   ├── config/   # Configuration (env, logger)
│       │   ├── db/       # Prisma client
│       │   └── routes/   # Route definitions
│       └── prisma/       # Database schema and migrations
└── docs/                 # Documentation (PRD, API spec, etc.)
```

## Setup

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cd apps/api
cp .env.example .env
# Edit .env with your DATABASE_URL
```

3. Set up the database:
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate
```

4. Start the development server:
```bash
pnpm dev:api
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Users
- `POST /api/users` - Create user
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Trips
- `POST /api/trips` - Create trip
- `POST /api/trips/plan` - Plan trip from prompt (Phase 1 stub)
- `GET /api/trips/:tripId` - Get trip with relations
- `PUT /api/trips/:tripId` - Update trip

### Events
- `POST /api/events` - Create event
- `GET /api/events/trip/:tripId` - Get events for a trip
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Venues
- `POST /api/venues` - Create venue
- `GET /api/venues` - List venues (optional ?city= query)
- `GET /api/venues/:id` - Get venue by ID
- `PUT /api/venues/:id` - Update venue
- `DELETE /api/venues/:id` - Delete venue

## Phase 1 Status

✅ Phase 0: Monorepo setup, Prisma schema, Express server
✅ Phase 1: Core backend modules (users, trips, events, venues)
✅ Phase 1: POST /api/trips/plan with stub planner
✅ Phase 1: GET /api/trips/:tripId

## Development

- TypeScript strict mode enabled
- Prisma for database access
- Express for API server
- Modular architecture with separation of concerns

## Next Steps (Phase 2+)

- LLM integration for trip planning
- Venue matching service
- Reservation preparation and booking
- ICS and PDF export
- Notification system
- Frontend implementation
