# PartyPilot API

Express + TypeScript + Prisma + PostgreSQL backend.

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start PostgreSQL (Docker):**
   ```bash
   docker-compose up -d
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Run Prisma migrations:**
   ```bash
   pnpm db:migrate
   ```

5. **Seed the database:**
   ```bash
   pnpm db:seed
   ```

6. **Start dev server:**
   ```bash
   pnpm dev
   ```

## Database Commands

- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:migrate` - Run migrations
- `pnpm db:seed` - Seed venues
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:push` - Push schema changes (dev only)

## Project Structure

```
src/
├── index.ts          # Entry point
├── server.ts         # Express app setup
├── config/           # Configuration
├── db/               # Prisma client
├── modules/          # Feature modules
│   ├── trips/
│   ├── events/
│   ├── venues/
│   ├── reservations/
│   ├── notifications/
│   └── planner/
├── routes/           # Route definitions
├── middleware/       # Express middleware
└── utils/            # Utilities
```
