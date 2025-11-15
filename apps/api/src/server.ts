import express, { Express, Request, Response } from 'express';
import cors from 'cors';

export function createServer(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes placeholder
  app.get('/api', (_req: Request, res: Response) => {
    res.json({ message: 'PartyPilot API v0.1.0' });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
