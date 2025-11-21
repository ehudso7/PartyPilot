# Deployment Runbook - PartyPilot

**Version:** 1.0  
**Last Updated:** November 21, 2025  
**Maintainer:** DevOps Team  
**Review Frequency:** Monthly

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Variables](#2-environment-variables)
3. [Database Setup](#3-database-setup)
4. [Deployment Steps](#4-deployment-steps)
5. [Post-Deployment Verification](#5-post-deployment-verification)
6. [Rollback Procedures](#6-rollback-procedures)
7. [Troubleshooting](#7-troubleshooting)
8. [Maintenance Tasks](#8-maintenance-tasks)

---

## 1. Prerequisites

### 1.1 Required Tools

```bash
# Node.js & npm
node --version  # v20.x or higher
npm --version   # v10.x or higher

# Prisma CLI
npm install -g prisma

# Railway CLI (if using Railway)
npm install -g @railway/cli

# Vercel CLI (if using Vercel)
npm install -g vercel

# AWS CLI (for backups)
aws --version  # v2.x or higher

# Git
git --version  # v2.x or higher
```

### 1.2 Required Accounts & Access

- **GitHub:** Read access to partypilot/partypilot repository
- **Railway/Render:** Admin access to production project
- **Vercel:** Admin access for frontend deployment
- **OpenAI:** API key with GPT-4 access
- **Sentry:** Admin access for error tracking
- **AWS S3:** Write access for backups (optional)

### 1.3 Development Environment Setup

```bash
# Clone repository
git clone https://github.com/partypilot/partypilot.git
cd partypilot

# Install dependencies
cd apps/api
npm install
cd ../web
npm install
cd ../..

# Copy environment template
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Generate Prisma client
cd apps/api
npx prisma generate
```

---

## 2. Environment Variables

### 2.1 Backend (API) Environment Variables

Create `apps/api/.env` with the following:

#### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/partypilot?sslmode=require"
# Example Railway: postgresql://postgres:pass@containers-us-west-12.railway.app:5432/railway

# Authentication
JWT_SECRET="your-256-bit-secret-key-minimum-32-chars"
# Generate with: openssl rand -base64 32

# Application
NODE_ENV="production"  # or "development", "staging"
PORT="3001"
APP_URL="https://partypilot.app"
CORS_ORIGIN="https://partypilot.app,https://www.partypilot.app"

# AI Service
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxx"
# Get from: https://platform.openai.com/api-keys
```

#### Optional but Recommended

```bash
# Error Tracking
SENTRY_DSN="https://xxxxx@oxxxxx.ingest.sentry.io/xxxxx"
# Get from: https://sentry.io/settings/projects/partypilot/keys/

# Email Service (for notifications)
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxxxxxxxx"
# Get from: https://app.sendgrid.com/settings/api_keys
SENDGRID_FROM_EMAIL="notifications@partypilot.app"

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_PHONE_NUMBER="+1234567890"

# Push Notifications (Expo)
EXPO_ACCESS_TOKEN="xxxxxxxxxxxxxxxxxxxx"
# Get from: https://expo.dev/accounts/[account]/settings/access-tokens

# AWS (for backups)
AWS_ACCESS_KEY_ID="AKIAxxxxxxxxxxxxxxxxxx"
AWS_SECRET_ACCESS_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxx"
AWS_S3_BACKUP_BUCKET="partypilot-backups"
AWS_REGION="us-east-1"

# Booking Integrations
OPENTABLE_API_KEY="xxxxxxxxxxxxxxxxxxxx"  # If available
RESY_API_KEY="xxxxxxxxxxxxxxxxxxxx"      # If available
```

#### Development/Testing Only

```bash
# Logging
LOG_LEVEL="debug"  # "error", "warn", "info", "debug"

# Test Database (separate from production!)
TEST_DATABASE_URL="postgresql://user:password@localhost:5432/partypilot_test"
```

### 2.2 Frontend (Web) Environment Variables

Create `apps/web/.env.local`:

```bash
# API Endpoint
NEXT_PUBLIC_API_URL="https://api.partypilot.app"
# For development: http://localhost:3001

# Application
NEXT_PUBLIC_APP_URL="https://partypilot.app"

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID="G-XXXXXXXXXX"  # Google Analytics
```

### 2.3 Environment-Specific Configurations

#### Production

```bash
NODE_ENV=production
LOG_LEVEL=warn
DATABASE_URL=<railway-production-url>
SENTRY_DSN=<production-sentry-dsn>
```

#### Staging

```bash
NODE_ENV=staging
LOG_LEVEL=info
DATABASE_URL=<railway-staging-url>
SENTRY_DSN=<staging-sentry-dsn>
```

#### Development

```bash
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgresql://localhost:5432/partypilot_dev
```

---

## 3. Database Setup

### 3.1 Initial Database Setup (First Deployment)

```bash
cd apps/api

# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Seed database with venues
npx ts-node prisma/seed-venues.ts
```

### 3.2 Production Database Deployment

```bash
# Apply pending migrations (PRODUCTION - READ CAREFULLY)
cd apps/api
npx prisma migrate deploy

# Verify migration
npx prisma migrate status

# Generate Prisma client (if not done in build step)
npx prisma generate
```

### 3.3 Database Migration Best Practices

**Before Migrating:**
1. ✅ **Backup database** (automatic daily, but create manual backup)
   ```bash
   pg_dump $DATABASE_URL | gzip > backup-pre-migration-$(date +%Y%m%d).sql.gz
   ```

2. ✅ **Test migration on staging** first

3. ✅ **Review migration SQL**
   ```bash
   npx prisma migrate diff \
     --from-schema-datasource prisma/schema.prisma \
     --to-schema-datamodel prisma/schema.prisma \
     --script
   ```

4. ✅ **Check for breaking changes** (renamed columns, deleted tables)

5. ✅ **Plan downtime** if schema changes are incompatible

**During Migration:**
- Monitor application logs
- Have rollback script ready
- Keep backup restoration command handy

**After Migration:**
- Run smoke tests
- Check Sentry for errors
- Monitor database performance (query times)

---

## 4. Deployment Steps

### 4.1 Railway Deployment (Recommended)

#### Initial Setup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Configure services
railway service create api
railway service create web
railway service create postgres
```

#### Deploy Backend

```bash
cd apps/api

# Set environment variables
railway variables set DATABASE_URL=<postgres-url>
railway variables set JWT_SECRET=<secret>
railway variables set OPENAI_API_KEY=<key>
# ... set all required variables

# Deploy
railway up --service api

# Run migrations
railway run --service api npx prisma migrate deploy

# Check logs
railway logs --service api
```

#### Deploy Frontend

```bash
cd apps/web

# Set environment variables
railway variables set NEXT_PUBLIC_API_URL=https://api.partypilot.app --service web

# Deploy
railway up --service web
```

#### Configure Domains

```bash
# API domain
railway domain add api.partypilot.app --service api

# Web domain
railway domain add partypilot.app --service web
railway domain add www.partypilot.app --service web
```

### 4.2 Vercel Deployment (Alternative - Frontend Only)

```bash
cd apps/web

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://api.partypilot.app

# Configure domain
vercel domains add partypilot.app
```

### 4.3 Manual Deployment (VPS/EC2)

```bash
# SSH into server
ssh ubuntu@your-server-ip

# Clone repository
git clone https://github.com/partypilot/partypilot.git
cd partypilot

# Install dependencies
cd apps/api && npm ci
cd ../web && npm ci

# Build
cd apps/api && npm run build
cd ../web && npm run build

# Set up environment variables
nano apps/api/.env  # Paste production env vars

# Run migrations
cd apps/api
npx prisma migrate deploy

# Start with PM2
pm2 start apps/api/dist/index.js --name partypilot-api
pm2 start apps/web --name partypilot-web -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4.4 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd apps/api
          npm ci

      - name: Run tests
        run: |
          cd apps/api
          npm test

      - name: Build
        run: |
          cd apps/api
          npm run build

      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --service api

      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          cd apps/api
          npx prisma migrate deploy

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npm install -g vercel
          cd apps/web
          vercel --prod --token $VERCEL_TOKEN
```

---

## 5. Post-Deployment Verification

### 5.1 Smoke Tests

Run these tests immediately after deployment:

```bash
# Health check
curl https://api.partypilot.app/health
# Expected: {"status":"ok","timestamp":"2025-11-21T10:30:00.000Z"}

# API authentication
curl -X POST https://api.partypilot.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
# Expected: {"user":{...},"token":"eyJhbGc..."}

# Trip planning (with valid token)
curl -X POST https://api.partypilot.app/api/v1/trips/plan \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Plan a bachelor party in NYC for 15 people"}'
# Expected: {"trip":{...},"events":[...],"venues":[...]}

# Frontend loads
curl -I https://partypilot.app
# Expected: HTTP/2 200
```

### 5.2 Integration Tests

```bash
cd apps/api
npm run test:integration
```

### 5.3 Monitoring Checks

**Sentry:**
- Visit https://sentry.io/organizations/partypilot/issues/
- Verify no new errors in last 5 minutes

**Logs:**
```bash
railway logs --service api --tail
```

**Database:**
```bash
# Check connection pool
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'partypilot';"

# Check recent trips
psql $DATABASE_URL -c "SELECT COUNT(*) FROM trips WHERE \"createdAt\" > NOW() - INTERVAL '1 day';"
```

---

## 6. Rollback Procedures

### 6.1 Rollback Railway Deployment

```bash
# List recent deployments
railway deployments list --service api

# Rollback to previous deployment
railway deployment rollback <deployment-id>

# Or redeploy specific commit
git reset --hard <previous-commit-hash>
railway up --service api
```

### 6.2 Rollback Database Migration

**If migration is incompatible:**

```bash
# Restore from backup
gunzip -c backup-pre-migration-20251121.sql.gz | psql $DATABASE_URL

# Or use point-in-time recovery (if supported)
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier partypilot-prod \
  --target-db-instance-identifier partypilot-rollback \
  --restore-time 2025-11-21T09:00:00Z

# Update DATABASE_URL to rollback instance
railway variables set DATABASE_URL=<rollback-db-url>
```

### 6.3 Emergency Rollback (Full System)

```bash
# 1. Put site in maintenance mode
railway variables set MAINTENANCE_MODE=true

# 2. Rollback API
railway deployment rollback <previous-api-deployment-id>

# 3. Rollback Frontend
vercel rollback <previous-web-deployment-url>

# 4. Rollback database (if needed)
gunzip -c backup-pre-deployment.sql.gz | psql $DATABASE_URL

# 5. Verify rollback
curl https://api.partypilot.app/health

# 6. Disable maintenance mode
railway variables set MAINTENANCE_MODE=false
```

---

## 7. Troubleshooting

### 7.1 Common Issues

#### Issue: "Prisma Client Not Generated"

**Symptoms:**
```
Error: Cannot find module '@prisma/client'
```

**Solution:**
```bash
cd apps/api
npx prisma generate
npm run build
railway up
```

#### Issue: "Database Connection Failed"

**Symptoms:**
```
Error: P1001: Can't reach database server at 'localhost:5432'
```

**Solution:**
1. Check `DATABASE_URL` environment variable
   ```bash
   railway variables get DATABASE_URL
   ```
2. Verify database is running
   ```bash
   railway status --service postgres
   ```
3. Check firewall rules (allow Railway IP ranges)

#### Issue: "JWT Secret Not Set"

**Symptoms:**
```
Error: JWT_SECRET not configured
```

**Solution:**
```bash
# Generate new secret
openssl rand -base64 32

# Set in Railway
railway variables set JWT_SECRET=<generated-secret>
```

#### Issue: "OpenAI API Rate Limit"

**Symptoms:**
```
Error: Rate limit exceeded (429)
```

**Solution:**
1. Upgrade OpenAI plan (https://platform.openai.com/account/billing)
2. Implement request queuing
3. Add caching for common prompts

### 7.2 Performance Issues

#### High API Response Times

**Diagnosis:**
```bash
# Check database query performance
psql $DATABASE_URL -c "
  SELECT query, mean_exec_time, calls
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;
"

# Check API logs for slow endpoints
railway logs --service api | grep "duration"
```

**Solutions:**
- Add database indexes
- Enable query caching
- Scale up database instance

#### High Memory Usage

**Diagnosis:**
```bash
# Check Node.js memory usage
railway metrics --service api
```

**Solutions:**
```bash
# Increase Node.js memory limit
railway variables set NODE_OPTIONS="--max-old-space-size=2048"
```

---

## 8. Maintenance Tasks

### 8.1 Weekly Tasks

- ✅ Review error logs in Sentry
- ✅ Check database backup success
- ✅ Monitor API response times (< 500ms p95)
- ✅ Review security alerts

### 8.2 Monthly Tasks

- ✅ Update npm dependencies
  ```bash
  npm outdated
  npm update
  npm audit fix
  ```
- ✅ Review and optimize database queries
- ✅ Test disaster recovery procedure
- ✅ Review CloudWatch/monitoring costs

### 8.3 Quarterly Tasks

- ✅ Security audit
- ✅ Load testing
- ✅ Dependency major version updates
- ✅ Database vacuum and analyze
  ```sql
  VACUUM ANALYZE;
  ```
- ✅ Review and update this runbook

---

## 9. Emergency Contacts

```
Incident Hotline: +1 (XXX) XXX-XXXX
Slack: #devops-emergency
PagerDuty: https://partypilot.pagerduty.com

Primary On-Call: devops@partypilot.app
Secondary On-Call: backend-team@partypilot.app
Escalation: cto@partypilot.app

Railway Support: https://railway.app/help
Vercel Support: https://vercel.com/support
```

---

## 10. Quick Reference Commands

### Deployment

```bash
# Deploy API
railway up --service api

# Deploy Frontend
vercel --prod

# Run migrations
railway run --service api npx prisma migrate deploy
```

### Monitoring

```bash
# View logs
railway logs --service api --tail

# Check health
curl https://api.partypilot.app/health

# Database status
psql $DATABASE_URL -c "SELECT version();"
```

### Rollback

```bash
# Rollback API
railway deployment rollback <id>

# Rollback database
gunzip -c backup.sql.gz | psql $DATABASE_URL
```

---

**Document Version:** 1.0  
**Last Updated:** November 21, 2025  
**Next Review:** December 21, 2025  
**Maintained By:** DevOps Team (devops@partypilot.app)

