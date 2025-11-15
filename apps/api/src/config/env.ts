import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  apiKey: string;
  openaiApiKey?: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  apiKey: process.env.API_KEY || 'dev-api-key',
  openaiApiKey: process.env.OPENAI_API_KEY,
};

// Validate critical environment variables
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default config;
