import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
