#!/bin/bash

# PartyPilot Phase 1 Verification Script
# This script verifies that all Phase 0 and Phase 1 components are in place

echo "🎯 PartyPilot Phase 1 Verification"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASS=0
FAIL=0

check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAIL++))
    fi
}

# Check workspace structure
echo "📁 Workspace Structure:"
[ -f "package.json" ] && check "Root package.json exists" || check "Root package.json exists"
[ -f "docker-compose.yml" ] && check "docker-compose.yml exists" || check "docker-compose.yml exists"
[ -f ".env.example" ] && check ".env.example exists" || check ".env.example exists"
[ -d "docs" ] && check "docs/ directory exists" || check "docs/ directory exists"
[ -d "apps/api" ] && check "apps/api/ directory exists" || check "apps/api/ directory exists"
echo ""

# Check API structure
echo "🏗️  API Structure:"
[ -f "apps/api/package.json" ] && check "API package.json exists" || check "API package.json exists"
[ -f "apps/api/tsconfig.json" ] && check "API tsconfig.json exists" || check "API tsconfig.json exists"
[ -f "apps/api/prisma/schema.prisma" ] && check "Prisma schema exists" || check "Prisma schema exists"
[ -f "apps/api/prisma/seed.ts" ] && check "Seed script exists" || check "Seed script exists"
echo ""

# Check source files
echo "📝 Source Files:"
[ -f "apps/api/src/index.ts" ] && check "Entry point exists" || check "Entry point exists"
[ -f "apps/api/src/server.ts" ] && check "Server setup exists" || check "Server setup exists"
[ -f "apps/api/src/config/env.ts" ] && check "Config exists" || check "Config exists"
[ -f "apps/api/src/db/prismaClient.ts" ] && check "Prisma client exists" || check "Prisma client exists"
echo ""

# Check modules
echo "🧩 Modules:"
[ -f "apps/api/src/modules/users/service.ts" ] && check "Users module exists" || check "Users module exists"
[ -f "apps/api/src/modules/venues/service.ts" ] && check "Venues module exists" || check "Venues module exists"
[ -f "apps/api/src/modules/events/service.ts" ] && check "Events module exists" || check "Events module exists"
[ -f "apps/api/src/modules/trips/service.ts" ] && check "Trips module exists" || check "Trips module exists"
[ -f "apps/api/src/modules/planner/service.ts" ] && check "Planner module exists" || check "Planner module exists"
echo ""

# Check routes
echo "🛣️  Routes:"
[ -f "apps/api/src/routes/index.ts" ] && check "Main router exists" || check "Main router exists"
[ -f "apps/api/src/routes/users.ts" ] && check "Users routes exist" || check "Users routes exist"
[ -f "apps/api/src/routes/venues.ts" ] && check "Venues routes exist" || check "Venues routes exist"
[ -f "apps/api/src/routes/events.ts" ] && check "Events routes exist" || check "Events routes exist"
[ -f "apps/api/src/routes/trips.ts" ] && check "Trips routes exist" || check "Trips routes exist"
echo ""

# Check middleware
echo "🔧 Middleware:"
[ -f "apps/api/src/middleware/auth.ts" ] && check "Auth middleware exists" || check "Auth middleware exists"
[ -f "apps/api/src/middleware/errorHandler.ts" ] && check "Error handler exists" || check "Error handler exists"
echo ""

# Check documentation
echo "📚 Documentation:"
[ -f "docs/PRD.md" ] && check "PRD exists" || check "PRD exists"
[ -f "docs/ARCHITECTURE.md" ] && check "Architecture doc exists" || check "Architecture doc exists"
[ -f "docs/API_SPEC.md" ] && check "API spec exists" || check "API spec exists"
[ -f "docs/DB_SCHEMA.md" ] && check "DB schema doc exists" || check "DB schema doc exists"
[ -f "docs/TASKS.md" ] && check "Tasks doc exists" || check "Tasks doc exists"
[ -f "docs/PLANNER_LOGIC.json" ] && check "Planner logic exists" || check "Planner logic exists"
echo ""

# Check setup guides
echo "📖 Setup Guides:"
[ -f "README.md" ] && check "README exists" || check "README exists"
[ -f "SETUP.md" ] && check "Setup guide exists" || check "Setup guide exists"
[ -f "QUICKSTART.md" ] && check "Quick start exists" || check "Quick start exists"
[ -f "PHASE1_COMPLETE.md" ] && check "Phase 1 doc exists" || check "Phase 1 doc exists"
echo ""

# Check TypeScript compilation
echo "⚙️  TypeScript:"
cd apps/api
if npx tsc --noEmit 2>/dev/null; then
    echo -e "${GREEN}✓${NC} TypeScript compiles without errors"
    ((PASS++))
else
    echo -e "${RED}✗${NC} TypeScript has compilation errors"
    ((FAIL++))
fi
cd ../..
echo ""

# Check Prisma
echo "🗄️  Prisma:"
if [ -d "node_modules/@prisma/client" ]; then
    echo -e "${GREEN}✓${NC} Prisma Client is generated"
    ((PASS++))
else
    echo -e "${YELLOW}!${NC} Prisma Client not generated (run: npm run db:generate)"
    ((FAIL++))
fi
echo ""

# Summary
echo "=================================="
echo "📊 Results:"
echo -e "  ${GREEN}Passed:${NC} $PASS"
echo -e "  ${RED}Failed:${NC} $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✨ Phase 1 Complete! All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start PostgreSQL: docker compose up -d"
    echo "2. Run migrations: cd apps/api && npm run db:migrate"
    echo "3. Seed data: npm run db:seed"
    echo "4. Start server: cd ../.. && npm run dev:api"
    echo ""
    echo "🚀 Ready for Phase 2!"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please review.${NC}"
    exit 1
fi
