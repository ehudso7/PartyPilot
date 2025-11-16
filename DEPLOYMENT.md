# PartyPilot Deployment Guide

## Vercel Deployment (Frontend)

The PartyPilot frontend is ready to deploy on Vercel. Follow these steps:

### 1. Push to GitHub

First, commit and push your code:

```bash
git add .
git commit -m "Add PartyPilot application"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel CLI**

```bash
npm install -g vercel
vercel
```

**Option B: Via Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

### 3. Environment Variables

After deployment, add environment variables in Vercel dashboard:

- `NEXT_PUBLIC_API_URL`: Your backend API URL (add this later when API is deployed)

### Current Status

✅ Frontend application is complete and ready to deploy
✅ Vercel configuration is set up
⚠️ Backend API needs to be deployed separately (see Backend Deployment below)

## Backend Deployment (API)

The backend API needs a PostgreSQL database and Node.js hosting. Options:

### Option 1: Railway

1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub (apps/api folder)
5. Set environment variables:
   - `DATABASE_URL` (auto-filled by Railway)
   - `PORT` (Railway sets automatically)
   - `NODE_ENV=production`
   - `CORS_ORIGIN` (your Vercel URL)

### Option 2: Render

1. Create account at [render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service from GitHub
4. Set build command: `cd apps/api && npm install && npm run build`
5. Set start command: `cd apps/api && npm start`
6. Add environment variables (same as Railway)

### Option 3: Heroku

```bash
heroku create partypilot-api
heroku addons:create heroku-postgresql:mini
git subtree push --prefix apps/api heroku main
```

## After Deployment

1. Get your API URL from your backend host
2. Update Vercel environment variable `NEXT_PUBLIC_API_URL`
3. Redeploy frontend on Vercel
4. Test the application

## Troubleshooting

### 404 Error

If you're seeing a 404 error, it means:
- The deployment hasn't been done yet, OR
- The wrong directory is being deployed

**Solution**: Make sure Vercel is deploying from the correct directory:
- Build Command: `npm run vercel-build`
- Output Directory: `apps/web/.next`
- Install Command: `npm install`

### Database Connection Issues

If the API can't connect to the database:
1. Check `DATABASE_URL` environment variable
2. Run migrations: `npx prisma migrate deploy`
3. Generate Prisma client: `npx prisma generate`

## Local Development

To test the full application locally:

1. Set up PostgreSQL database
2. Copy `.env.example` to `.env` and configure
3. Run migrations:
   ```bash
   cd apps/api
   npm run prisma:migrate
   ```
4. Start API:
   ```bash
   npm run dev:api
   ```
5. Start frontend (in another terminal):
   ```bash
   npm run dev:web
   ```
6. Open http://localhost:3000

## What's Next

After fixing the 404 error:
- ✅ Deploy frontend to Vercel
- ⏳ Deploy backend API
- ⏳ Connect frontend to backend
- ⏳ Add seed data for venues
- ⏳ Integrate OpenAI for trip planning
- ⏳ Add PDF generation
- ⏳ Set up notifications
