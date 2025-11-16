# Deployment Guide

## Vercel Deployment

This is a monorepo with the Next.js app in `apps/web`. To deploy on Vercel:

### Option 1: Set Root Directory (Recommended)

1. Go to your Vercel project settings
2. Under "General" → "Root Directory", set it to `apps/web`
3. Deploy

### Option 2: Use Root vercel.json

The root `vercel.json` is configured to build from `apps/web`. Make sure:
- Build Command: `cd apps/web && npm install && npm run build`
- Output Directory: `apps/web/.next`
- Framework: `nextjs`

## Local Development

```bash
# Install dependencies
pnpm install

# Run frontend (port 3000)
cd apps/web
pnpm dev

# Run API (port 3001, separate terminal)
cd apps/api
pnpm dev
```

## Troubleshooting 404 Errors

If you see a 404 error:
1. Check that Vercel root directory is set to `apps/web`
2. Verify the build completes successfully
3. Check Vercel build logs for errors
4. Ensure `package.json` exists in `apps/web` with Next.js dependencies
