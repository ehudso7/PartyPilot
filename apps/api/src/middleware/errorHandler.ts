import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { AppError } from '../utils/appError';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.issues;
  }

  logger.error(message, {
    statusCode,
    path: req.path,
    method: req.method,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined
  });

  return res.status(statusCode).json({
    message,
    details,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
