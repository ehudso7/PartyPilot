import { asyncHandler } from '../../utils/asyncHandler';
import { planTripRequestSchema } from './planner.schema';
import { planTripFromPrompt } from './planner.service';

export const planTrip = asyncHandler(async (req, res) => {
  const payload = planTripRequestSchema.parse(req.body);
  const result = await planTripFromPrompt(payload);
  res.status(201).json(result);
});
