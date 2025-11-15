# PartyPilot

Natural-language event planning and booking system for social outings (bachelor parties, birthdays, bar crawls, etc.).

## Project Structure

```
/workspace
├── apps/
│   └── api/              # Express + TypeScript backend
│       ├── src/
│       │   ├── modules/   # Feature modules (trips, events, venues, etc.)
│       │   ├── config/    # Configuration (env, logger)
│       │   └── db/        # Prisma client
│       └── prisma/        # Database schema and migrations
├── docs/                  # Documentation files
└── package.json           # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- pnpm (or npm)

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

3. Set up database:
```bash
cd apps/api
pnpm db:generate
pnpm db:migrate
```

4. Start development server:
```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Users
- `POST /api/users` - Create user
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Trips
- `POST /api/trips/plan` - Plan a trip from natural language prompt
- `POST /api/trips` - Create trip manually
- `GET /api/trips/:tripId` - Get trip with events, venues, reservations
- `PUT /api/trips/:tripId` - Update trip
- `DELETE /api/trips/:tripId` - Delete trip

### Events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/trip/:tripId` - Get events for a trip
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Venues
- `POST /api/venues` - Create venue
- `GET /api/venues` - List all venues
- `GET /api/venues/search` - Search venues
- `GET /api/venues/:id` - Get venue by ID
- `PUT /api/venues/:id` - Update venue
- `DELETE /api/venues/:id` - Delete venue

## Development Phases

- **Phase 0**: ✅ Setup (monorepo, Prisma, DB)
- **Phase 1**: ✅ Core Backend (modules, stub planner, endpoints)
- **Phase 2**: Planner Integration (LLM-based planning)
- **Phase 3**: Reservations
- **Phase 4**: Exports (ICS, PDF, group chat)
- **Phase 5**: Notifications
- **Phase 6**: Frontend MVP
- **Phase 7**: Polish

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma + PostgreSQL
- pnpm workspaces
