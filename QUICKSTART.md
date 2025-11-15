# PartyPilot - Quick Reference

## 🎯 What Is It?
Natural-language event planner. Type a party description, get a complete multi-venue itinerary.

## 🚀 Quick Start

```bash
# 1. Start database
docker compose up -d

# 2. Setup database
cd apps/api && npm run db:migrate && npm run db:seed

# 3. Start server
cd ../.. && npm run dev:api
```

## 📡 Key Endpoints

### Plan a Trip (Main Feature)
```bash
POST /api/trips/plan
{
  "prompt": "Bachelor party in NYC, Jan 17 2026, 15 people, Italian dinner, games bar, rooftop",
  "userId": "user_id"
}
```

### Get Trip
```bash
GET /api/trips/:tripId
```

### Create User
```bash
POST /api/users
{
  "email": "test@example.com",
  "name": "Test User"
}
```

## 🔑 Auth
All requests need header:
```
x-api-key: dev-api-key
```

## 📁 Structure
```
apps/api/src/
├── modules/
│   ├── users/      # User management
│   ├── venues/     # Venue database
│   ├── events/     # Event management
│   ├── trips/      # Trip management
│   └── planner/    # AI planning (stub)
├── routes/         # API endpoints
├── config/         # Environment
└── db/             # Prisma client
```

## 🗄️ Database Tables
- users
- trips
- venues (6 NYC samples included)
- events
- reservations (Phase 3)
- notifications (Phase 5)
- share_links (Phase 4)

## 📊 Current Status
✅ Phase 0: Setup  
✅ Phase 1: Core Backend  
⏳ Phase 2: LLM Integration (Next)

## 📖 Docs
- `SETUP.md` - Detailed setup guide
- `PHASE1_COMPLETE.md` - What's been built
- `docs/` - Full documentation

## 🧪 Test It

```bash
# 1. Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key" \
  -d '{"email":"john@example.com","name":"John"}'

# 2. Plan trip (use user ID from above)
curl -X POST http://localhost:3000/api/trips/plan \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key" \
  -d '{
    "prompt": "Bachelor party NYC, 15 people, Italian dinner, games, rooftop",
    "userId": "USER_ID"
  }'
```

## 💡 Features Working Now
- Natural language parsing (basic)
- Event generation from keywords
- Venue matching
- Multi-event itineraries
- Time scheduling
- Full CRUD for all resources

## 🔜 Coming in Phase 2
- Real LLM integration (OpenAI)
- Advanced venue matching
- Backup venue selection
- More venue data
- Better prompt understanding
