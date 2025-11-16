# 🚀 Deploy PartyPilot NOW - Quick Start

**Time to Production:** 15 minutes | **Difficulty:** Easy

This guide gets your PartyPilot app live in production as fast as possible.

---

## ⚡ Fastest Path to Deployment

### Step 1: Deploy Backend (5 minutes)

**Option A: Railway (Recommended - Easiest)**

1. **Click:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

2. **Select:** "Deploy from GitHub repo"

3. **Choose:** `ehudso7/PartyPilot`

4. **Add Database:**
   - Click "+ New"
   - Select "Database"
   - Choose "Add PostgreSQL"
   - Railway auto-connects it ✅

5. **Set Environment Variables:**
   ```bash
   # Copy from .env.railway file
   JWT_SECRET=aJ+bkIS1tl16Lelm4pSSr0E9vF07FTcla4DDJrAIrRE=
   OPENAI_API_KEY=sk-your-key-here
   NODE_ENV=production
   PORT=3001
   LOG_LEVEL=info
   # Leave these blank for now, update after step 2:
   CORS_ORIGIN=
   APP_URL=
   ```

6. **Get your API URL:**
   - Railway provides: `https://your-project.railway.app`
   - Copy this URL - you'll need it for Step 2

**Option B: Render (Also Easy)**

1. **Click:** [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ehudso7/PartyPilot)

2. **Render auto-configures everything from `render.yaml`** ✅

3. **Set these variables:**
   ```bash
   OPENAI_API_KEY=sk-your-key-here
   # Leave blank for now, update after step 2:
   CORS_ORIGIN=
   APP_URL=
   ```

4. **Get your API URL:**
   - Render provides: `https://partypilot-api.onrender.com`
   - Copy this URL

---

### Step 2: Deploy Frontend (5 minutes)

1. **Go to:** [https://vercel.com/new](https://vercel.com/new)

2. **Import Git Repository:**
   - Search for: `ehudso7/PartyPilot`
   - Click "Import"

3. **IMPORTANT - Set Root Directory:**
   - Framework Preset: Next.js
   - **Root Directory:** `apps/web` ⚠️
   - Build Command: (auto-detected)
   - Output Directory: (auto-detected)

4. **Add Environment Variable:**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-railway-or-render-url
   ```
   (Use the URL from Step 1)

5. **Click "Deploy"**

6. **Get your Frontend URL:**
   - Vercel provides: `https://your-app.vercel.app`
   - Copy this URL

---

### Step 3: Connect Frontend & Backend (2 minutes)

Now that both are deployed, connect them:

1. **Go back to Railway/Render Dashboard**

2. **Update environment variables:**
   ```bash
   CORS_ORIGIN=https://your-app.vercel.app
   APP_URL=https://your-app.vercel.app
   ```
   (Use your Vercel URL from Step 2)

3. **Redeploy** (Railway/Render auto-redeploys on variable change)

---

### Step 4: Test Everything (3 minutes)

**Test 1: API Health**
```bash
curl https://your-api-url/health
```

Expected:
```json
{"status":"ok","timestamp":"...","version":"1.0.0","environment":"production"}
```

**Test 2: Frontend**
Visit: `https://your-app.vercel.app`

You should see the PartyPilot homepage! ✅

**Test 3: Create Account**
1. Click "Sign Up" on your frontend
2. Create a test account
3. Try creating a trip

---

## 🔑 Where to Get API Keys

### OpenAI API Key (Required)
1. Go to: https://platform.openai.com/api-keys
2. Sign in/create account
3. Click "Create new secret key"
4. Copy key (starts with `sk-`)
5. **Cost:** ~$0.002 per trip plan (very cheap!)

### Sentry DSN (Optional - Error Tracking)
1. Go to: https://sentry.io/
2. Create free account
3. Create new project → Node.js
4. Copy DSN
5. **Free tier:** 5,000 errors/month

---

## ⚡ Quick Commands Reference

### Using the Deployment Script

We've included an automated deployment script:

```bash
# Make it executable (already done)
chmod +x deploy.sh

# Run it
./deploy.sh
```

Options:
1. Deploy Backend to Railway (interactive)
2. Deploy Backend to Render (instructions)
3. Deploy Frontend to Vercel (interactive)
4. Full deployment (both)
5. Manual deployment instructions

---

## 🎯 Environment Variables Cheat Sheet

All environment files are pre-created:
- `.env.railway` - Copy values to Railway dashboard
- `.env.render` - Copy values to Render dashboard
- `.env.vercel` - Copy values to Vercel dashboard

**Pre-generated JWT Secret:** `aJ+bkIS1tl16Lelm4pSSr0E9vF07FTcla4DDJrAIrRE=`

(Or generate new: `openssl rand -base64 32`)

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Railway/Render
- [ ] PostgreSQL database created and connected
- [ ] Environment variables set on backend
- [ ] Frontend deployed to Vercel
- [ ] Root directory set to `apps/web` in Vercel
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] `CORS_ORIGIN` and `APP_URL` updated on backend
- [ ] API health check passes
- [ ] Frontend loads successfully
- [ ] Test user registration works
- [ ] Test trip creation works

---

## 🚨 Troubleshooting

### Vercel shows 404
**Fix:** Vercel Settings → General → Root Directory → `apps/web`

### API returns CORS errors
**Fix:** Update `CORS_ORIGIN` and `APP_URL` with exact Vercel URL (no trailing slash)

### Frontend can't connect to API
**Fix:** Check `NEXT_PUBLIC_API_URL` in Vercel env vars matches your API URL

### Database connection error
**Fix:** Railway/Render auto-connects database. Check logs in dashboard.

### OpenAI errors
**Fix:** Verify API key is valid and account has credits. App works without OpenAI (fallback planner).

---

## 📊 What You'll Have After Deployment

✅ **Production-Ready Application:**
- Frontend: Next.js on Vercel
- Backend: Node.js API on Railway/Render
- Database: PostgreSQL (managed)
- Authentication: JWT-based
- AI Planning: OpenAI GPT-4
- PDF Export: Professional itineraries
- Security: 85/100 score
- GDPR Compliant: Data export/deletion

✅ **Auto-Scaling Infrastructure:**
- Vercel Edge Network (CDN)
- Railway/Render auto-scaling
- Managed database backups
- HTTPS everywhere
- Health monitoring

✅ **Zero Downtime Updates:**
- Railway/Render: Auto-deploy on git push
- Vercel: Auto-deploy on git push to main
- Atomic deployments
- Instant rollbacks

---

## 🎉 You're Live!

**Your URLs:**
- **Frontend:** `https://your-app.vercel.app`
- **API:** `https://your-api.railway.app` or `.onrender.com`
- **API Health:** `https://your-api.railway.app/health`
- **Database:** Managed by Railway/Render

**Next Steps:**
1. Share with beta users
2. Monitor logs in dashboards
3. Set up custom domain (optional)
4. Add more venue data
5. Scale as needed

---

## 💡 Pro Tips

1. **Custom Domain:**
   - Vercel: Settings → Domains → Add
   - Railway: Settings → Networking → Custom Domain

2. **Monitor Costs:**
   - Railway: $5-20/month typical
   - Vercel: Free tier sufficient for most
   - OpenAI: Pay-per-use (~$0.002 per trip)

3. **Backups:**
   - Railway: Automatic daily backups
   - Render: Automatic daily backups
   - Download manually: Dashboard → Database → Backups

4. **Logs:**
   - Railway: Dashboard → Deployments → Logs
   - Render: Dashboard → Logs tab
   - Vercel: Dashboard → Deployments → Function Logs

---

## 📞 Need Help?

- **Deployment Issues:** See [DEPLOYMENT_COMPLETE_GUIDE.md](DEPLOYMENT_COMPLETE_GUIDE.md)
- **Environment Setup:** See [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)
- **Security Audit:** See [PRODUCTION_READINESS_AUDIT.md](PRODUCTION_READINESS_AUDIT.md)
- **GitHub Issues:** https://github.com/ehudso7/PartyPilot/issues

---

**🚀 Ready? Let's deploy! Start with Step 1 above. ⬆️**
