import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../apps/api/src/server';
import { validateConfig } from '../apps/api/src/config/env';

// Validate configuration on cold start
try {
  validateConfig();
} catch (error) {
  console.error('Configuration validation failed:', error);
}

// Note: Notification scheduler is disabled in serverless environment
// Use Vercel Cron Jobs instead (see vercel.json)

// Export the Express app as a serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
  // Handle the request with Express
  return app(req, res);
};
