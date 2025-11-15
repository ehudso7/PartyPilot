# DIR_STRUCTURE.md

Root
├─ apps/
│  ├─ api/                  # Express + TS backend
│  │  ├─ src/
│  │  │  ├─ index.ts        # App entry
│  │  │  ├─ server.ts       # Express + middleware wiring
│  │  │  ├─ config/         # env, logging config
│  │  │  ├─ db/             # Prisma client
│  │  │  ├─ modules/
│  │  │  │  ├─ trips/
│  │  │  │  ├─ events/
│  │  │  │  ├─ venues/
│  │  │  │  ├─ reservations/
│  │  │  │  ├─ notifications/
│  │  │  │  └─ planner/
│  │  │  ├─ routes/
│  │  │  ├─ middleware/
│  │  │  ├─ utils/
│  │  │  └─ tests/
│  │  ├─ prisma/
│  │  │  ├─ schema.prisma
│  │  │  └─ migrations/
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  │
│  └─ web/                  # React or React Native client (pick one later)
│     ├─ src/
│     ├─ package.json
│     └─ tsconfig.json
│
├─ docs/
│  ├─ CLAUDE.md
│  ├─ PRD.md
│  ├─ DB_SCHEMA.md
│  ├─ API_SPEC.md
│  ├─ ARCHITECTURE.md
│  ├─ TASKS.md
│  ├─ DIR_STRUCTURE.md
│  ├─ PLANNER_LOGIC.json
│  ├─ PROMPTS.md
│  └─ AGENT_REQUIREMENTS.md
│
├─ .env.example
├─ docker-compose.yml
├─ package.json             # root workspace config
└─ README.md