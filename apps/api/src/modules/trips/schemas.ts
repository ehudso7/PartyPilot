import { z } from 'zod';

export const PlanTripSchema = z.object({
  prompt: z.string().min(10).max(2000),
});

export const UpdateTripSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  city: z.string().min(1).max(100).optional(),
  dateStart: z.string().datetime().optional(),
  dateEnd: z.string().datetime().optional(),
  groupSizeMin: z.number().int().min(1).max(1000).optional(),
  groupSizeMax: z.number().int().min(1).max(1000).optional(),
  occasion: z.enum(['bachelor', 'bachelorette', 'birthday', 'corporate', 'anniversary', 'other']).optional(),
  budgetLevel: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['draft', 'planned', 'confirmed', 'completed', 'cancelled']).optional(),
});

export const TripIdSchema = z.object({
  tripId: z.string().cuid(),
});
