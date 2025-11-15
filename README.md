# PartyPilot

Natural-language event planner that turns prompts into full itineraries with venues, bookings, exports, and reminders.

## Stack

- **Backend**: Node.js + TypeScript + Express + Prisma + PostgreSQL
- **Database**: PostgreSQL (via Docker)
- **Architecture**: Modular monorepo with workspaces

## Project Structure

```
partypilot/
├── apps/
│   ├── api/           # Express + TypeScript backend
│   └── web/           # Frontend (future)
├── docs/              # Specification documents
├── docker-compose.yml # PostgreSQL container
└── package.json       # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose

### 1. Clone and Install

```bash
# Install dependencies
npm install

# Install API dependencies
cd apps/api && npm install && cd ../..
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

### 3. Setup Database

```bash
# Generate Prisma client
cd apps/api && npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with NYC venues
npm run db:seed

cd ../..
```

### 4. Start Development Server

```bash
npm run dev:api
```

The API will be available at `http://localhost:3001`

## Available Commands

From the root directory:

```bash
npm run dev:api        # Start API dev server
npm run build:api      # Build API for production
npm run db:migrate     # Run Prisma migrations
npm run db:seed        # Seed database with venues
npm run db:studio      # Open Prisma Studio
```

## API Endpoints

- `GET /health` - Health check
- `GET /api` - API info
- More endpoints coming in Phase 1

## Documentation

See the `docs/` directory for complete specifications:

- `PRD.md` - Product requirements
- `ARCHITECTURE.md` - System architecture
- `API_SPEC.md` - API endpoints specification
- `DB_SCHEMA.md` - Database schema
- `TASKS.md` - Build plan and phases

## Development Phases

- **Phase 0**: Setup (Current) ✅
- **Phase 1**: Core Backend
- **Phase 2**: Planner Integration
- **Phase 3**: Reservations
- **Phase 4**: Exports
- **Phase 5**: Notifications
- **Phase 6**: Frontend MVP
- **Phase 7**: Polish

## License

Proprietary
