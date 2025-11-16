import { Request, Response } from 'express';

export const getHealth = (_req: Request, res: Response) => {
  res.json({
    ok: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};
