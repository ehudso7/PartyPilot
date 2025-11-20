import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  sentryDsn: process.env.SENTRY_DSN || '',
  cronSecret: process.env.CRON_SECRET || '',
};

export function validateConfig() {
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = requiredEnvVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('Running in development mode with missing env vars');
    }
  }

  // Warn about optional but recommended vars
  const recommended = ['OPENAI_API_KEY', 'SENTRY_DSN'];
  const missingRecommended = recommended.filter(key => !process.env[key]);
  if (missingRecommended.length > 0) {
    console.warn(`Warning: Missing recommended environment variables: ${missingRecommended.join(', ')}`);
  }
}
