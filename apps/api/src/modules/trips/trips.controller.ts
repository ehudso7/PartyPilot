import { asyncHandler } from '../../lib/asyncHandler';
import { HttpError } from '../../lib/httpError';
import { validate } from '../../lib/validate';
import type { PlanTripInput } from './trips.schema';
import { planTripSchema } from './trips.schema';
import { tripsService } from './trips.service';

export const planTripHandler = asyncHandler(async (req, res) => {
  const payload = validate<PlanTripInput>(planTripSchema, req.body);
  const result = await tripsService.planTrip(payload);
  res.status(201).json(result);
});

export const getTripHandler = asyncHandler<{ tripId: string }>(async (req, res) => {
  const { tripId } = req.params;
  const trip = await tripsService.getTripWithDetails(tripId);
  if (!trip) {
    throw new HttpError(404, 'Trip not found');
  }
  res.json({ trip });
});
