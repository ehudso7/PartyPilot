import { z } from 'zod';

export const planTripSchema = z.object({
  prompt: z.string().min(10),
  userId: z.string().cuid(),
  city: z.string().optional(),
  dateStart: z.string().datetime().optional(),
  dateEnd: z.string().datetime().optional(),
  groupSizeMin: z.number().int().min(2).max(100).optional(),
  groupSizeMax: z.number().int().min(2).max(120).optional(),
  occasion: z.string().optional(),
  budgetLevel: z.enum(['low', 'medium', 'high']).optional()
});

export type PlanTripInput = z.infer<typeof planTripSchema>;
