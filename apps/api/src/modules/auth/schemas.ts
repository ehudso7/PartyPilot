import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  ),
  name: z.string().min(1).max(200),
  phone: z.string().max(50).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
