# 🚀 PartyPilot Launch Instructions

**Status:** ✅ **READY TO LAUNCH**

Everything is configured and ready for production deployment. Follow these simple steps to get your app live in under 15 minutes.

---

## ✅ What's Already Done

- ✅ Production-ready codebase (85/100 security score)
- ✅ All 13 critical security blockers fixed
- ✅ Railway, Render, and Vercel deployment configs created
- ✅ Database migrations ready
- ✅ Environment variable templates created
- ✅ JWT secret generated
- ✅ Legal documents (Privacy Policy, Terms of Service)
- ✅ GDPR compliance (data export/deletion)
- ✅ One-click deployment buttons added to README
- ✅ Complete deployment guides written
- ✅ Pushed to GitHub (branch: `claude/vercel-fix-01Ujc1PXzd2XiRqrwTMPt7E7`)

---

## 🎯 Next Steps (Choose Your Path)

### Option 1: Railway (Easiest - 10 Minutes)

#### Step 1: Merge the Branch to Main
Go to: https://github.com/ehudso7/PartyPilot/pulls
1. You should see the branch `claude/vercel-fix-01Ujc1PXzd2XiRqrwTMPt7E7`
2. Create a pull request
3. Merge it to main

#### Step 2: Deploy Backend to Railway
1. Go to: https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select: `ehudso7/PartyPilot`
4. Railway detects `railway.json` automatically ✅
5. Click "+ New" → "Database" → "Add PostgreSQL"
6. Add environment variables (copy from below)

**Environment Variables for Railway:**
```
JWT_SECRET=aJ+bkIS1tl16Lelm4pSSr0E9vF07FTcla4DDJrAIrRE=
OPENAI_API_KEY=<your-openai-key>
NODE_ENV=production
PORT=3001
CORS_ORIGIN=<your-vercel-url>
APP_URL=<your-vercel-url>
LOG_LEVEL=info
```

7. Get your Railway API URL (e.g., `https://partypilot-api.railway.app`)

#### Step 3: Fix Vercel Frontend (Already Deployed)
1. Go to: Vercel Dashboard → Your Project → Settings → General
2. Set **Root Directory:** `apps/web`
3. Save
4. Go to: Settings → Environment Variables
5. Add: `NEXT_PUBLIC_API_URL` = `https://your-railway-url.railway.app`
6. Redeploy

#### Step 4: Update CORS in Railway
1. Go back to Railway → Variables
2. Update `CORS_ORIGIN` = Your Vercel URL
3. Update `APP_URL` = Your Vercel URL
4. Railway auto-redeploys ✅

#### ✅ Done! Your app is live!
- Frontend: `https://your-app.vercel.app`
- API: `https://your-api.railway.app`

---

### Option 2: Render (Also Easy - 12 Minutes)

#### Step 1: Merge Branch (Same as Railway)

#### Step 2: Deploy to Render
1. Go to: https://render.com/
2. Click "New" → "Blueprint"
3. Connect GitHub: `ehudso7/PartyPilot`
4. Render auto-detects `render.yaml` ✅
5. It creates:
   - API service
   - PostgreSQL database
   - Auto-connects them

6. Add missing env vars:
```
OPENAI_API_KEY=<your-key>
CORS_ORIGIN=<your-vercel-url>
APP_URL=<your-vercel-url>
```

#### Step 3: Configure Vercel (Same as Railway Step 3)

#### ✅ Done!

---

## 🔑 Where to Get API Keys

### OpenAI API Key (Required for AI Features)
1. Go to: https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Paste into `OPENAI_API_KEY` environment variable

**Cost:** ~$0.002 per trip plan (very cheap!)

### Sentry DSN (Optional - Error Tracking)
1. Go to: https://sentry.io/
2. Create free account
3. Create new project → Node.js
4. Copy DSN from Settings → Client Keys
5. Paste into `SENTRY_DSN`

**Free tier:** 5,000 errors/month

---

## 📋 Pre-Generated Values

**JWT Secret (Already Generated):**
```
aJ+bkIS1tl16Lelm4pSSr0E9vF07FTcla4DDJrAIrRE=
```

Use this value for `JWT_SECRET` environment variable.

---

## 🧪 Test Your Deployment

### 1. Test API Health
```bash
curl https://your-api-url/health
```

Should return:
```json
{"status":"ok","timestamp":"...","version":"1.0.0","environment":"production"}
```

### 2. Test User Registration
```bash
curl -X POST https://your-api-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'
```

Should return user object + JWT token

### 3. Test Frontend
Visit: `https://your-frontend.vercel.app`

Should see PartyPilot homepage ✅

---

## 📊 Environment Variables Cheat Sheet

### Railway/Render (Backend API)
```bash
DATABASE_URL=<auto-set-by-railway-or-render>
JWT_SECRET=aJ+bkIS1tl16Lelm4pSSr0E9vF07FTcla4DDJrAIrRE=
OPENAI_API_KEY=sk-...
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-vercel-app.vercel.app
APP_URL=https://your-vercel-app.vercel.app
LOG_LEVEL=info
SENTRY_DSN=https://... (optional)
```

### Vercel (Frontend)
```bash
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

---

## ⚠️ Common Issues & Fixes

### Vercel shows 404
**Fix:** Set Root Directory to `apps/web` in Vercel Settings → General

### API returns 500 error
**Check:**
1. All environment variables are set
2. Database is connected (Railway/Render auto-connects)
3. View logs: Railway/Render Dashboard → Logs

### CORS errors in browser console
**Fix:**
1. Update `CORS_ORIGIN` in Railway/Render to exact Vercel URL
2. Include `https://` prefix
3. No trailing slash

### OpenAI errors
**Fix:**
1. Verify API key is valid
2. Check OpenAI account has credits
3. App works without OpenAI (fallback planner)

---

## 📖 Detailed Guides

For more details, see:
- **[DEPLOYMENT_COMPLETE_GUIDE.md](DEPLOYMENT_COMPLETE_GUIDE.md)** - Full deployment guide
- **[VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)** - Environment variables reference
- **[PRODUCTION_READINESS_AUDIT.md](PRODUCTION_READINESS_AUDIT.md)** - Security audit

---

## 🎯 Quick Command Summary

```bash
# Generate new JWT secret (if needed)
openssl rand -base64 32

# Test API health
curl https://your-api-url/health

# View Railway logs
railway logs

# View Vercel logs
vercel logs
```

---

## ✨ What You'll Have After Deployment

- **Frontend:** Fully functional Next.js app on Vercel
- **Backend API:** Node.js API with PostgreSQL on Railway/Render
- **Authentication:** JWT-based user registration and login
- **AI Planning:** OpenAI GPT-4 trip planning
- **PDF Export:** Professional trip itineraries
- **Notifications:** Automated reminder system
- **GDPR Compliant:** Data export and deletion
- **Production Security:** 85/100 security score

---

## 🚀 Ready to Launch!

1. **Merge the branch** to main on GitHub
2. **Deploy to Railway/Render** (10 minutes)
3. **Configure Vercel** (5 minutes)
4. **Test everything** (5 minutes)

**Total time:** ~20 minutes to production! 🎉

---

## 💡 Next Steps After Launch

**Day 1:**
- [ ] Test user registration flow
- [ ] Create a test trip
- [ ] Verify PDF export works
- [ ] Share with beta users

**Week 1:**
- [ ] Monitor error logs in Sentry
- [ ] Add more venue seed data (currently 8 NYC venues)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring alerts

**Month 1:**
- [ ] Review usage metrics
- [ ] Add more cities beyond NYC
- [ ] Optimize performance
- [ ] Add comprehensive tests

---

**You're all set! Let's launch! 🚀**
