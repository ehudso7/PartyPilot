import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { HttpError } from '../utils/httpError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      details: err.flatten()
    });
  }

  if (err instanceof HttpError) {
    logger.warn(err.message, { status: err.status, details: err.details });
    return res.status(err.status).json({
      error: err.name,
      message: err.message,
      details: err.details
    });
  }

  logger.error('Unexpected error', err as Record<string, unknown>);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong'
  });
};
