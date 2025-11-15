import { z } from 'zod';

export const planTripRequestSchema = z.object({
  prompt: z.string().min(1),
  userId: z.string().cuid()
});

export type PlanTripInput = z.infer<typeof planTripRequestSchema>;
