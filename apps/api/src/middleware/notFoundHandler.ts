import type { RequestHandler } from 'express';
import { AppError } from '../utils/appError';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
