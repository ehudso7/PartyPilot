import type { NextFunction, Request, Response } from 'express';
import { logger } from '@config/logger';

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: Error | HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;

  logger.error({ err }, 'Unhandled error');

  res.status(statusCode).json({
    message: err.message ?? 'Internal server error'
  });
};
