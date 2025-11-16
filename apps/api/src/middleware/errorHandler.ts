import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, 'Unhandled error');

  const status = typeof err === 'object' && err && 'status' in err ? Number((err as any).status) : 500;
  const message =
    typeof err === 'object' && err && 'message' in err
      ? String((err as any).message)
      : 'Something went wrong';

  res.status(Number.isNaN(status) ? 500 : status).json({
    ok: false,
    error: message
  });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: 'Route not found'
  });
};
