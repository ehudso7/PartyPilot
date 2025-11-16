import { Request, Response } from 'express';
import { z } from 'zod';
import { tripService } from './trip.service';

const planTripSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  user: z.object({
    email: z.string().email(),
    name: z.string().min(1).optional(),
    phone: z.string().optional()
  })
});

const tripIdParamsSchema = z.object({
  tripId: z.string().cuid()
});

export const planTripController = async (req: Request, res: Response) => {
  const parsed = planTripSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: parsed.error.flatten()
    });
  }

  const trip = await tripService.planTrip(parsed.data);

  res.status(201).json({
    ok: true,
    data: trip
  });
};

export const getTripController = async (req: Request, res: Response) => {
  const parsedParams = tripIdParamsSchema.safeParse(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      ok: false,
      error: parsedParams.error.flatten()
    });
  }

  const trip = await tripService.getTripById(parsedParams.data.tripId);

  if (!trip) {
    return res.status(404).json({
      ok: false,
      error: 'Trip not found'
    });
  }

  res.json({
    ok: true,
    data: trip
  });
};
