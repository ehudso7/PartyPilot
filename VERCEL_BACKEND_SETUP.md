# Vercel Backend Deployment Guide

## Overview

This guide covers deploying the PartyPilot backend API to Vercel as serverless functions. The backend is an Express.js application that has been configured to run on Vercel's serverless platform.

---

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: You'll need a PostgreSQL database. Recommended options:
   - [Supabase](https://supabase.com/) - Free tier available
   - [Neon](https://neon.tech/) - Serverless PostgreSQL
   - [Railway](https://railway.app/) - PostgreSQL with free trial
3. **OpenAI API Key**: Get from [platform.openai.com](https://platform.openai.com/api-keys)

---

## Architecture

The backend has been configured for Vercel serverless deployment:

```
/api/index.ts          → Serverless function entry point
/apps/api/src/         → Express application code
/apps/api/prisma/      → Database schema and migrations
/vercel.json           → Vercel configuration
```

All API requests (`/api/*` and `/health`) are routed to the serverless function which runs the Express app.

---

## Step-by-Step Deployment

### 1. Set Up Database

#### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (URI format)
   - Should look like: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

#### Option B: Neon

1. Go to [neon.tech](https://neon.tech/)
2. Create a new project
3. Copy the connection string from the dashboard

### 2. Deploy to Vercel

#### Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `ehudso7/PartyPilot`
3. Configure project:
   - **Project Name**: `partypilot` (or your preferred name)
   - **Framework Preset**: Other (Vercel will auto-detect from vercel.json)
   - **Root Directory**: Leave as `.` (root)
4. Click **Deploy** (it will fail first time - that's okay!)

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? partypilot
# - Directory? ./ (just press Enter)
```

### 3. Configure Environment Variables

After initial deployment, add these environment variables in the Vercel dashboard:

**Go to:** Project → Settings → Environment Variables

#### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string from Supabase/Neon |
| `JWT_SECRET` | Generate with `openssl rand -base64 32` | Secret key for JWT authentication |
| `OPENAI_API_KEY` | `sk-...` | OpenAI API key from platform.openai.com |
| `NODE_ENV` | `production` | Environment mode |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` | Frontend URL (get after frontend deploys) |
| `APP_URL` | `https://your-frontend.vercel.app` | Same as CORS_ORIGIN |

#### Optional Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `SENTRY_DSN` | `https://...` | Error tracking (from sentry.io) |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warn, error) |

### 4. Run Database Migrations

After setting environment variables, you need to run Prisma migrations:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Pull environment variables
cd /path/to/PartyPilot
vercel env pull .env

# Run migrations
cd apps/api
npx prisma migrate deploy
npx prisma generate
npx prisma db seed  # Optional: seed with sample venues
```

Alternatively, you can run migrations from your deployment platform:

#### Using Vercel CLI
```bash
# Execute command in Vercel's environment
vercel env pull
cd apps/api && npx prisma migrate deploy
```

### 5. Redeploy

After adding environment variables and running migrations:

1. Go to **Vercel Dashboard** → **Deployments**
2. Click **Redeploy** on the latest deployment
3. Select **Use existing Build Cache**: No
4. Click **Redeploy**

---

## Testing Your Deployment

### 1. Test Health Endpoint

```bash
curl https://your-project.vercel.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-16T...",
  "version": "1.0.0",
  "environment": "production"
}
```

### 2. Test User Registration

```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }'
```

Expected response:
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 3. Test Trip Planning (requires auth token from step 2)

```bash
curl -X POST https://your-project.vercel.app/api/trips/plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "prompt": "Plan a bachelor party in NYC on Jan 17, 2026, 15 people, Italian dinner, rooftop bar"
  }'
```

---

## Connecting Frontend

After backend is deployed:

1. Note your backend URL: `https://your-project.vercel.app`
2. Deploy frontend (if separate project) or it deploys automatically
3. Add frontend environment variable:
   - Go to frontend Vercel project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend.vercel.app`
4. Update backend CORS:
   - Go to backend Vercel project → Settings → Environment Variables
   - Update: `CORS_ORIGIN` = `https://your-frontend.vercel.app`
   - Update: `APP_URL` = `https://your-frontend.vercel.app`
5. Redeploy both projects

---

## Troubleshooting

### 1. Build Fails

**Error: "Cannot find module '@prisma/client'"**

Solution: Ensure the build runs `prisma generate`. Check that `apps/api/package.json` has:
```json
{
  "scripts": {
    "build": "tsc && prisma generate"
  }
}
```

### 2. Database Connection Error

**Error: "Can't reach database server"**

Solutions:
- Verify `DATABASE_URL` is correctly set in Vercel environment variables
- Check if database requires IP allowlisting (Supabase usually doesn't)
- Ensure connection string includes SSL: add `?sslmode=require` to end of URL

### 3. Prisma Client Not Generated

Solution: Add postinstall script to generate Prisma client:
```bash
cd apps/api
npm set-script postinstall "prisma generate"
```

### 4. CORS Errors

**Error: "Blocked by CORS policy"**

Solutions:
- Verify `CORS_ORIGIN` matches your frontend URL exactly (including https://)
- Ensure frontend URL doesn't have trailing slash
- Check both `CORS_ORIGIN` and `APP_URL` are set

### 5. 500 Internal Server Error

Check Vercel logs:
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Click **Functions** tab
4. Click on `api/index` function
5. View real-time logs

Common issues:
- Missing environment variables
- Database connection failure
- Prisma client not generated

### 6. Cold Starts / Timeout

Vercel serverless functions have a 10-second timeout on Hobby plan. If you're hitting limits:
- Consider upgrading to Pro plan (60-second timeout)
- Optimize database queries
- Use connection pooling (Prisma handles this automatically)

---

## Performance Optimization

### 1. Connection Pooling

Add to your `DATABASE_URL`:
```
postgresql://...?connection_limit=1&pool_timeout=10
```

For Prisma connection pooling with Supabase:
```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # Direct connection (for migrations)
```

Then update `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 2. Region Configuration

Deploy database and Vercel functions in same region for lower latency:
- Vercel default: `iad1` (Washington, D.C.)
- Supabase: Choose East US (North Virginia)

---

## Monitoring & Logging

### 1. View Logs

```bash
# Install Vercel CLI
npm i -g vercel

# View logs in real-time
vercel logs your-project.vercel.app --follow
```

### 2. Error Tracking with Sentry

1. Create account at [sentry.io](https://sentry.io)
2. Create new project (Node.js/Express)
3. Copy DSN
4. Add to Vercel environment variables:
   - `SENTRY_DSN` = `https://...@sentry.io/...`
5. Redeploy

### 3. Analytics

Vercel provides analytics automatically:
- Go to Dashboard → Analytics
- View request counts, errors, performance

---

## Security Checklist

✅ **Completed in Code:**
- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation (Zod)
- CORS configuration
- Security headers (Helmet)
- SQL injection protection (Prisma)

⚠️ **Recommended:**
- [ ] Set up Sentry error tracking
- [ ] Enable Vercel Authentication (for admin routes)
- [ ] Set up database backups
- [ ] Configure custom domain with SSL
- [ ] Set up monitoring alerts

---

## Cost Estimates

### Vercel Hobby Plan (Free)
- 100GB bandwidth/month
- 100 hours serverless function execution
- Automatic HTTPS
- **Good for**: Development, small projects, demos

### Vercel Pro Plan ($20/month)
- 1TB bandwidth
- 1000 hours function execution
- 60-second function timeout (vs 10s on Hobby)
- Team collaboration
- **Good for**: Production apps with moderate traffic

### Database Costs
- **Supabase Free**: 500MB, 2GB bandwidth
- **Supabase Pro**: $25/month, 8GB database
- **Neon Free**: 3GB storage
- **Neon Pro**: $19/month, 10GB storage

### Estimated Total Cost
- **Free tier**: $0 (sufficient for development/small projects)
- **Small production**: $20-45/month (Vercel Pro + database)
- **Medium production**: $50-100/month (with Sentry, higher limits)

---

## Next Steps

After successful deployment:

1. **Test thoroughly**:
   - User registration/login
   - Trip planning
   - PDF export
   - Share links

2. **Add custom domain** (optional):
   - Go to Vercel Dashboard → Settings → Domains
   - Add your domain
   - Update DNS records

3. **Set up monitoring**:
   - Configure Sentry
   - Set up uptime monitoring
   - Configure alerts

4. **Seed database**:
   ```bash
   cd apps/api
   npx prisma db seed
   ```

5. **Deploy frontend**:
   - Follow frontend deployment guide
   - Connect to backend API

---

## Support

**Issues?**
- Check Vercel logs: `vercel logs --follow`
- Check database connectivity
- Review environment variables
- See [DEPLOYMENT_COMPLETE_GUIDE.md](./DEPLOYMENT_COMPLETE_GUIDE.md)

**Documentation:**
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## Quick Reference Commands

```bash
# Generate JWT secret
openssl rand -base64 32

# Pull environment variables
vercel env pull

# Run migrations
cd apps/api && npx prisma migrate deploy

# Generate Prisma client
cd apps/api && npx prisma generate

# Seed database
cd apps/api && npx prisma db seed

# View logs
vercel logs --follow

# Redeploy
vercel --prod
```

---

## ✅ Deployment Checklist

- [ ] Database created (Supabase/Neon)
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Prisma client generated
- [ ] Health endpoint returns 200
- [ ] User registration works
- [ ] Trip planning works
- [ ] Frontend connected
- [ ] CORS configured
- [ ] Error tracking set up (Sentry)
- [ ] Custom domain configured (optional)

---

🎉 **You're all set!** Your PartyPilot backend is now running on Vercel!
