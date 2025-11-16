# PartyPilot

🎉 **AI-powered event planning and booking system**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/partypilot)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ehudso7/PartyPilot)

**Production Status:** ✅ **READY** | **Security Score:** 85/100 | **All Critical Blockers:** Resolved

---

## 🚀 Quick Deploy (5 Minutes)

### Option 1: Railway (Recommended)
1. Click the "Deploy on Railway" button above
2. Connect your GitHub account
3. Add PostgreSQL database
4. Set environment variables (see [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md))
5. Done! ✅

### Option 2: Render
1. Click "Deploy to Render" button above
2. Everything auto-configures from `render.yaml`
3. Set OpenAI API key
4. Done! ✅

**Frontend auto-deploys to Vercel** when you push to main branch.

📖 **Full Guide:** [DEPLOYMENT_COMPLETE_GUIDE.md](DEPLOYMENT_COMPLETE_GUIDE.md)

---

## Overview

PartyPilot is a production-ready event planning app that creates and manages social outings (bachelor parties, birthdays, bar crawls, group events) from a single natural language prompt.

## ✨ Features

### Core Features
- **🤖 AI-Powered Planning**: OpenAI GPT-4 trip planning with natural language
- **🏢 Venue Selection**: 8 NYC venues seeded, automatic matching
- **📅 Calendar Export**: Multi-event .ics file generation
- **📄 PDF Generation**: Professional trip itineraries
- **🔔 Smart Notifications**: Weather, headcount, dress code reminders
- **🔗 Public Sharing**: Shareable links with cryptographic security

### Production Features (NEW!)
- **🔐 JWT Authentication**: Secure user registration and login
- **✅ Input Validation**: Zod schemas on all endpoints
- **🛡️ Security Headers**: Helmet with CSP, HSTS, frame guards
- **⏱️ Rate Limiting**: Multi-tier DoS protection
- **📊 Structured Logging**: Winston JSON logs
- **🐛 Error Tracking**: Sentry integration
- **🌍 GDPR Compliant**: Data export and deletion endpoints
- **📜 Legal**: Privacy Policy and Terms of Service
- **🚀 Auto-Deploy**: Railway, Render, and Vercel configs included

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

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - JWT login
- `GET /api/v1/auth/me` - Get current user

### Trips (Requires Auth)
- `POST /api/v1/trips/plan` - Create trip from natural language
- `GET /api/v1/trips/:tripId` - Get trip details
- `PUT /api/v1/trips/:tripId` - Update trip
- `GET /api/v1/trips/:tripId/events` - Get trip events
- `GET /api/v1/trips/:tripId/export/ics` - Download calendar
- `GET /api/v1/trips/:tripId/export/pdf` - Download PDF
- `GET /api/v1/trips/:tripId/share-link` - Generate share link

### GDPR (Requires Auth)
- `GET /api/v1/users/export` - Export all user data
- `DELETE /api/v1/users/account` - Delete account

### Public
- `GET /api/v1/share/:slug` - Public itinerary view
- `GET /health` - Health check

See [API_SPEC.md](API_SPEC.md) for complete documentation.

---

## 🚀 Deployment

### Automated Deployment (Recommended)

**Backend API:**
- **Railway:** Click the button above, add PostgreSQL, set env vars → Done!
- **Render:** Click button, auto-configures with `render.yaml` → Done!
- **Vercel:** Serverless API option (needs external database)

**Frontend:**
- **Vercel:** Auto-deploys on push to main branch ✅
- Fix 404: Set Root Directory to `apps/web` in Vercel settings

### Environment Variables

**Required for API:**
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=<run: openssl rand -base64 32>
OPENAI_API_KEY=sk-...
CORS_ORIGIN=https://your-frontend.vercel.app
APP_URL=https://your-frontend.vercel.app
```

**Required for Frontend:**
```bash
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

📖 **Complete setup:** [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)

## 📚 Documentation

### Production
- **[DEPLOYMENT_COMPLETE_GUIDE.md](DEPLOYMENT_COMPLETE_GUIDE.md)** - Complete deployment guide (Railway, Render, Vercel)
- **[VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)** - Environment variables setup
- **[PRODUCTION_READINESS_AUDIT.md](PRODUCTION_READINESS_AUDIT.md)** - Security audit report
- **[PRIVACY_POLICY.md](PRIVACY_POLICY.md)** - GDPR-compliant privacy policy
- **[TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md)** - Terms of service

### Development
- [PRD.md](PRD.md) - Product requirements
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [API_SPEC.md](API_SPEC.md) - API documentation
- [DB_SCHEMA.md](DB_SCHEMA.md) - Database schema
- [TASKS.md](TASKS.md) - Development tasks

---

## 🔒 Security

**Status:** Production-ready with enterprise-grade security

- ✅ JWT authentication with 7-day expiration
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Rate limiting (global, auth, expensive operations)
- ✅ Helmet security headers (CSP, HSTS, X-Frame-Options)
- ✅ Input validation with Zod on all endpoints
- ✅ HTTPS enforcement in production
- ✅ CORS properly configured
- ✅ SQL injection protection via Prisma
- ✅ Ownership validation on all protected resources

**Security Score:** 85/100 (Production Ready)

See [PRODUCTION_READINESS_AUDIT.md](PRODUCTION_READINESS_AUDIT.md) for full audit.

---

## 📊 Tech Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript

**Backend:**
- Node.js 18+
- Express
- TypeScript
- Prisma ORM
- PostgreSQL

**Production:**
- JWT authentication
- Winston logging
- Sentry error tracking
- OpenAI GPT-4
- PDFKit
- Node-cron

---

## 🎯 Production Checklist

- [x] Authentication & authorization
- [x] Input validation
- [x] Rate limiting
- [x] Security headers
- [x] Database migrations
- [x] HTTPS enforcement
- [x] Error tracking setup
- [x] Structured logging
- [x] GDPR compliance
- [x] Legal documents
- [x] Deployment configs
- [x] Health check endpoints
- [ ] Comprehensive tests (70%+ coverage)
- [ ] Load testing
- [ ] Performance optimization

---

## 💡 Quick Links

- **Live Demo:** [Coming Soon]
- **API Health:** `https://your-api.railway.app/health`
- **Deploy Guide:** [DEPLOYMENT_COMPLETE_GUIDE.md](DEPLOYMENT_COMPLETE_GUIDE.md)
- **Environment Setup:** [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)
- **Security Audit:** [PRODUCTION_READINESS_AUDIT.md](PRODUCTION_READINESS_AUDIT.md)

---

## 🤝 Contributing

This is a production-ready application. Before contributing:
1. Read the [PRD.md](PRD.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
2. Follow the TypeScript strict mode guidelines
3. Add tests for new features
4. Ensure all security checks pass

---

## 📝 License

MIT

---

**Built with ❤️ for production deployment**
