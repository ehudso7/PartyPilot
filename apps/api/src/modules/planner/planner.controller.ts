import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { planTripSchema } from './planner.types';
import { PlannerService } from './planner.service';

export class PlannerController {
  static planTrip = asyncHandler(async (req: Request, res: Response) => {
    const { body } = planTripSchema.parse({ body: req.body });
    const result = await PlannerService.planTrip(body);
    res.status(201).json(result);
  });
}
