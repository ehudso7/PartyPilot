# PartyPilot

Natural language event planning and booking system that creates and manages social outings from a single user prompt.

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Or with pnpm
pnpm install
```

### Development

```bash
# Start the development server
npm run dev

# Or
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

## Project Structure

```
/workspace/
├── apps/
│   ├── api/          # Express + TypeScript backend (to be implemented)
│   └── web/          # Next.js frontend
├── docs/             # Documentation files
└── package.json      # Root workspace config
```

## Documentation

- [PRD.md](./PRD.md) - Product Requirements Document
- [API_SPEC.md](./API_SPEC.md) - API Specification
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture Guide
- [DB_SCHEMA.md](./DB_SCHEMA.md) - Database Schema
- [TASKS.md](./TASKS.md) - Build Plan

## Deployment

This project is configured for Vercel deployment. The `vercel.json` file handles routing and build configuration.
