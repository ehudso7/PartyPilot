import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getTripController, planTripController } from './trip.controller';

export const tripRouter = Router();

tripRouter.post('/plan', asyncHandler(planTripController));
tripRouter.get('/:tripId', asyncHandler(getTripController));
