import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  
  // Booking providers
  openTableApiKey: process.env.OPENTABLE_API_KEY || '',
  resyApiKey: process.env.RESY_API_KEY || '',
  sevenRoomsApiKey: process.env.SEVENROOMS_API_KEY || '',
  
  // Notification services
  sendGridApiKey: process.env.SENDGRID_API_KEY || '',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
} as const;

export function validateConfig(): void {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
}
