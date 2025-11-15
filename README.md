# PartyPilot

Natural-language event planning and booking system that creates and manages social outings from a single user prompt.

## Stack

- **Backend**: Node.js + TypeScript + Express + Prisma + PostgreSQL
- **Monorepo**: pnpm workspaces

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (for local PostgreSQL)

### Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your DATABASE_URL and OPENAI_API_KEY
   ```

4. **Run database migrations:**
   ```bash
   pnpm db:migrate
   ```

5. **Seed the database:**
   ```bash
   pnpm db:seed
   ```

6. **Start the development server:**
   ```bash
   pnpm dev:api
   ```

The API will be available at `http://localhost:3000`

## Project Structure

```
/
├── apps/
│   ├── api/          # Express + TypeScript backend
│   └── web/          # Frontend (to be implemented)
├── docs/             # Project specifications
└── package.json      # Root workspace config
```

## Available Scripts

- `pnpm dev:api` - Start API development server
- `pnpm build:api` - Build API for production
- `pnpm db:migrate` - Run Prisma migrations
- `pnpm db:seed` - Seed database with initial data
- `pnpm db:studio` - Open Prisma Studio

## Database

The database schema is defined in `apps/api/prisma/schema.prisma`. After making changes to the schema:

1. Create a migration: `pnpm db:migrate`
2. Generate Prisma Client: `pnpm --filter api db:generate`

## Development

See `docs/TASKS.md` for the build plan and `docs/ARCHITECTURE.md` for architectural details.
