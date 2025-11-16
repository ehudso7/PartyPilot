# PartyPilot

🎉 AI-powered event planning and booking system

## Overview

PartyPilot is a natural-language event planning app that creates and manages social outings (bachelor parties, birthdays, bar crawls, group events) from a single prompt.

## Features

- **AI-Powered Planning**: Describe your event in natural language and get a complete itinerary
- **Venue Selection**: Automatic venue matching based on your preferences
- **Booking Automation**: Deep-link and API-based reservation support
- **Calendar Export**: Download multi-event .ics files
- **PDF Generation**: Get a shareable one-page itinerary
- **Smart Notifications**: Weather checks, headcount reminders, and leave-now alerts
- **Public Sharing**: Generate shareable links for your group

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd partypilot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database connection and API keys
```

4. Initialize the database:
```bash
cd apps/api
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development servers:

Terminal 1 - API:
```bash
npm run dev:api
```

Terminal 2 - Web:
```bash
npm run dev:web
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
partypilot/
├── apps/
│   ├── api/          # Express + TypeScript backend
│   │   ├── src/
│   │   │   ├── modules/    # Feature modules
│   │   │   ├── config/     # Configuration
│   │   │   ├── db/         # Database client
│   │   │   └── routes/     # API routes
│   │   └── prisma/         # Database schema
│   └── web/          # Next.js frontend
│       └── src/
│           └── app/        # App router pages
├── docs/             # Documentation
└── package.json      # Workspace configuration
```

## API Endpoints

- `POST /api/trips/plan` - Create trip from natural language
- `GET /api/trips/:tripId` - Get trip details
- `POST /api/reservations/prepare` - Prepare venue reservations
- `GET /api/trips/:tripId/export/ics` - Download calendar file
- `GET /api/share/:slug` - Public itinerary view

See [API_SPEC.md](API_SPEC.md) for complete documentation.

## Deployment

### Vercel (Frontend)

The Next.js frontend is configured for Vercel deployment:

```bash
npm run build
vercel deploy
```

### Backend Deployment

The API can be deployed to:
- Railway
- Render
- Heroku
- Any Node.js hosting platform

Set the `NEXT_PUBLIC_API_URL` environment variable in Vercel to your API endpoint.

## Documentation

- [PRD.md](PRD.md) - Product Requirements
- [ARCHITECTURE.md](ARCHITECTURE.md) - System Architecture
- [API_SPEC.md](API_SPEC.md) - API Documentation
- [DB_SCHEMA.md](DB_SCHEMA.md) - Database Schema
- [TASKS.md](TASKS.md) - Development Tasks

## License

MIT
