import path from 'node:path';
import { config } from 'dotenv';
import { z } from 'zod';

config();
config({ path: path.resolve(__dirname, '../../.env'), override: true });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required')
});

export const env = envSchema.parse(process.env);
export type Env = typeof env;
