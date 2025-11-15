import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { AppError } from './errorHandler';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== config.apiKey) {
    throw new AppError(401, 'Invalid or missing API key');
  }

  next();
};
