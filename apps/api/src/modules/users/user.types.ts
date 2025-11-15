import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    phone: z.string().min(8).optional()
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    phone: z.string().min(8).nullable().optional()
  }),
  params: z.object({
    userId: z.string().cuid()
  })
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().cuid()
  })
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
