import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';

export function createServer(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging
  if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
  }

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes will be added here
  app.get('/api', (req: Request, res: Response) => {
    res.json({ 
      message: 'PartyPilot API', 
      version: '1.0.0',
      endpoints: {
        health: '/health',
        api: '/api',
      }
    });
  });

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
}
