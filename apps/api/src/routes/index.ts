import { Router } from 'express';
import { healthRouter } from '../modules/health/health.routes';
import { tripRouter } from '../modules/trips/trip.routes';

export const createAppRouter = () => {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/trips', tripRouter);

  return router;
};
