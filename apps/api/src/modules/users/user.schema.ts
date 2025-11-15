import { z } from 'zod';

export const userIdParamSchema = z.object({
  userId: z.string().cuid()
});

const phoneSchema = z.union([z.string().min(7).max(20), z.null()]).optional();

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: phoneSchema
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
