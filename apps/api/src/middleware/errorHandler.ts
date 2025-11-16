import { Request, Response } from 'express';

import { logger } from '../config/logger';

export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response
) => {
  logger.error({ err }, 'Unhandled error');
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error'
  });
};
