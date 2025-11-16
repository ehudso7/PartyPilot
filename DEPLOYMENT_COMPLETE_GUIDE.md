# Complete Auto-Deployment Guide

This guide will get PartyPilot fully deployed and running in production in under 15 minutes.

---

## 🚀 Quick Start (Choose One Path)

### **Option A: Railway (Recommended - Easiest)**
- ✅ One-click deployment
- ✅ Free PostgreSQL included
- ✅ Auto-generates JWT_SECRET
- ✅ Zero configuration needed

### **Option B: Render**
- ✅ `render.yaml` included
- ✅ Free PostgreSQL included
- ✅ Git-based deployment

### **Option C: Vercel (API) + Vercel (Frontend)**
- ✅ Serverless API
- ✅ Edge network
- ⚠️ Requires external database (Supabase/Neon)

---

## 📦 What You're Deploying

**Frontend (Next.js):**
- Location: `apps/web/`
- Platform: Vercel (auto-deploys from main branch)
- No backend needed for frontend

**Backend (Node.js API):**
- Location: `apps/api/`
- Platform: Railway/Render/Vercel
- Requires: PostgreSQL database

---

## 🎯 Option A: Railway Deployment (FASTEST)

### Step 1: Deploy API to Railway

1. **Go to:** https://railway.app/new

2. **Click:** "Deploy from GitHub repo"

3. **Select:** `ehudso7/PartyPilot`

4. **Railway will auto-detect the `railway.json` config** ✅

5. **Add PostgreSQL:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway auto-connects it (sets `DATABASE_URL`)

6. **Set Environment Variables:**
   ```bash
   # Railway Dashboard → Variables

   JWT_SECRET=aJ+bkIS1tl16Lelm4pSSr0E9vF07FTcla4DDJrAIrRE=
   OPENAI_API_KEY=sk-your-openai-key-here
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   APP_URL=https://your-vercel-app.vercel.app
   LOG_LEVEL=info
   ```

7. **Deploy!**
   - Railway auto-deploys on every push to main
   - Get your API URL: `https://partypilot-api.railway.app`

### Step 2: Deploy Frontend to Vercel

1. **Already done!** Your frontend is on Vercel.

2. **Fix the 404 by setting Root Directory:**
   - Vercel Dashboard → Settings → General
   - **Root Directory:** `apps/web`
   - Save

3. **Add Environment Variable:**
   - Vercel Dashboard → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-railway-api-url.railway.app`

4. **Redeploy:**
   - Deployments → Latest → Redeploy

5. **Update CORS:**
   - Go back to Railway
   - Update `CORS_ORIGIN` and `APP_URL` to your Vercel URL
   - Railway auto-redeploys

### ✅ Done! Your app is live!

---

## 🎯 Option B: Render Deployment

### Step 1: Deploy with render.yaml

1. **Go to:** https://render.com/

2. **Click:** "New" → "Blueprint"

3. **Connect GitHub:** `ehudso7/PartyPilot`

4. **Render auto-detects `render.yaml`** ✅
   - Creates API service
   - Creates PostgreSQL database
   - Auto-connects them

5. **Set Missing Environment Variables:**
   ```bash
   # Render Dashboard → Environment

   OPENAI_API_KEY=sk-your-key
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   APP_URL=https://your-vercel-app.vercel.app
   SENTRY_DSN=https://your-sentry-dsn (optional)
   ```

6. **Deploy!**
   - Get API URL: `https://partypilot-api.onrender.com`

### Step 2: Deploy Frontend to Vercel (Same as Railway)

Follow Railway Step 2 above.

---

## 🎯 Option C: Vercel (Full Stack)

### Step 1: Set Up External Database

**Option C1: Supabase (Free PostgreSQL)**
1. Go to https://supabase.com/
2. Create new project
3. Get connection string: Settings → Database → Connection String
4. Copy the URI (starts with `postgresql://`)

**Option C2: Neon (Serverless PostgreSQL)**
1. Go to https://neon.tech/
2. Create project
3. Copy connection string

### Step 2: Deploy API to Vercel

1. **Create new Vercel project:**
   - Import `ehudso7/PartyPilot` again (separate project)
   - Name it `partypilot-api`

2. **Set Root Directory:**
   - `apps/api`

3. **Set Environment Variables:**
   ```bash
   DATABASE_URL=postgresql://... (from Supabase/Neon)
   JWT_SECRET=aJ+bkIS1tl16Lelm4pSSr0E9vF07FTcla4DDJrAIrRE=
   OPENAI_API_KEY=sk-...
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend.vercel.app
   APP_URL=https://your-frontend.vercel.app
   ```

4. **Deploy!**

### Step 3: Deploy Frontend (Same as above)

---

## 🔑 Environment Variables Reference

### Backend (API) - REQUIRED

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | Railway/Render auto-sets, or Supabase |
| `JWT_SECRET` | `aJ+bkIS1tl16Lelm4pSSr0E9vF07FTcla4DDJrAIrRE=` | Generated above (or run `openssl rand -base64 32`) |
| `OPENAI_API_KEY` | `sk-...` | https://platform.openai.com/api-keys |
| `NODE_ENV` | `production` | Manual |
| `PORT` | `3001` | Manual (Railway/Render auto-set) |
| `CORS_ORIGIN` | `https://your-frontend-url.vercel.app` | Your Vercel frontend URL |
| `APP_URL` | `https://your-frontend-url.vercel.app` | Same as CORS_ORIGIN |

### Backend (API) - OPTIONAL

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `SENTRY_DSN` | `https://...` | https://sentry.io/ (error tracking) |
| `LOG_LEVEL` | `info` | Manual (`debug`, `info`, `warn`, `error`) |

### Frontend (Web) - REQUIRED

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://your-api-url.railway.app` | Your deployed API URL |

---

## 🗄️ Database Setup

After deployment, run migrations:

### Railway/Render (Automatic)
✅ Already done! The `deploy` script runs migrations automatically.

### Vercel (Manual - One Time)
```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env

# Run migrations
cd apps/api
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

---

## 🧪 Testing Your Deployment

### 1. Test API Health
```bash
curl https://your-api-url/health
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
curl -X POST https://your-api-url/api/auth/register \
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
  "user": { "id": "...", "email": "test@example.com", ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 3. Test Frontend
Visit: `https://your-frontend.vercel.app`

Should see: PartyPilot homepage with event planning form

---

## 🔧 Troubleshooting

### Frontend shows 404
**Fix:** Set Root Directory to `apps/web` in Vercel settings

### API returns 500 error
**Check:**
1. Environment variables are set
2. Database is connected (`DATABASE_URL`)
3. Migrations ran successfully

**View logs:**
- Railway: Dashboard → Deployments → Logs
- Render: Dashboard → Logs
- Vercel: Dashboard → Deployments → Build Logs

### Database connection error
**Fix:**
1. Check `DATABASE_URL` format: `postgresql://user:pass@host:5432/dbname`
2. Ensure database is running
3. Check if IP allowlist needed (Supabase/Neon)

### CORS errors in browser
**Fix:**
1. Set `CORS_ORIGIN` to exact frontend URL (with https://)
2. Set `APP_URL` to same value
3. Redeploy API

### OpenAI API errors
**Fix:**
1. Verify `OPENAI_API_KEY` is valid
2. Check OpenAI account has credits
3. App works without OpenAI (uses fallback planner)

---

## 📊 Post-Deployment Checklist

### Immediate (Day 1)
- [ ] Test user registration
- [ ] Test trip creation
- [ ] Test PDF export
- [ ] Verify email notifications (if configured)
- [ ] Check error logs in Sentry
- [ ] Monitor API response times

### Week 1
- [ ] Add more venue seed data (currently 8 NYC venues)
- [ ] Set up monitoring alerts
- [ ] Configure backup strategy
- [ ] Add custom domain (optional)

### Month 1
- [ ] Review usage metrics
- [ ] Optimize database queries
- [ ] Add more cities beyond NYC
- [ ] Scale database if needed

---

## 🔐 Security Checklist

✅ **Completed:**
- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- HTTPS enforcement
- Security headers (Helmet)
- Input validation (Zod)
- SQL injection protection
- CORS configuration

⚠️ **Recommended:**
- [ ] Set up Sentry error tracking
- [ ] Enable database backups
- [ ] Configure SSL certificates
- [ ] Add API monitoring
- [ ] Set up log retention

---

## 💰 Cost Estimates

### Free Tier (Getting Started)
- **Railway:** Free trial ($5 credit) → ~$5-10/month after
- **Render:** Free tier (services sleep after inactivity)
- **Vercel:** Free tier (100GB bandwidth)
- **Supabase:** Free tier (500MB database)
- **Total:** $0-5/month

### Production Scale (~1000 users)
- **Railway:** ~$20/month (API + database)
- **Vercel:** Free tier (sufficient)
- **Sentry:** Free tier (5K errors/month)
- **OpenAI:** ~$50/month (pay-per-use)
- **Total:** ~$70-75/month

---

## 🚀 Quick Command Reference

### Generate new JWT secret
```bash
openssl rand -base64 32
```

### Run migrations locally
```bash
cd apps/api
npx prisma migrate dev
```

### Run migrations in production
```bash
cd apps/api
npx prisma migrate deploy
```

### Seed database
```bash
cd apps/api
npx prisma db seed
```

### View database
```bash
cd apps/api
npx prisma studio
```

### Build API
```bash
cd apps/api
npm run build
```

### Test API locally
```bash
cd apps/api
npm run dev
```

---

## 📞 Support

**Issues?** Check logs first:
- Railway: Dashboard → Logs
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Deployments → Function Logs

**Need help?**
- GitHub Issues: https://github.com/ehudso7/PartyPilot/issues
- Docs: See PRODUCTION_READINESS_AUDIT.md

---

## ✨ You're Done!

Your PartyPilot application is now:
- ✅ Fully deployed
- ✅ Production-ready
- ✅ Auto-scaling
- ✅ Secure
- ✅ Monitored

**Frontend:** https://your-app.vercel.app
**API:** https://your-api.railway.app (or .onrender.com)

**Next steps:**
1. Share with beta users
2. Monitor error logs
3. Add more features
4. Scale as needed

🎉 **Congratulations!** You've successfully deployed a production-grade application!
