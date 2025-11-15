import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { logger } from './config/logger';
import { tripRoutes } from './modules/trips/routes';
import { userRoutes } from './modules/users/routes';
import { venueRoutes } from './modules/venues/routes';
import { eventRoutes } from './modules/events/routes';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // API routes
  app.use('/api/users', userRoutes);
  app.use('/api/trips', tripRoutes);
  app.use('/api/venues', venueRoutes);
  app.use('/api/events', eventRoutes);

  // Error handling middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Unhandled error', err);
    res.status(500).json({
      error: 'Internal server error',
      message: env.nodeEnv === 'development' ? err.message : undefined,
    });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}

export function startServer(app: Express): void {
  const port = env.port;
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}
