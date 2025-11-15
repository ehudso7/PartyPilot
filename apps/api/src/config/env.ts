export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
};

// Validate required env vars
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}
