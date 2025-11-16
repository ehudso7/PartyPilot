import type { ZodError, ZodTypeAny } from 'zod';

import { HttpError } from './httpError';

export const validate = <TOutput>(schema: ZodTypeAny, payload: unknown): TOutput => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new HttpError(400, formatZodError(result.error));
  }
  return result.data as TOutput;
};

const formatZodError = (error: ZodError) =>
  error.errors
    .map((issue) => `${issue.path.join('.') || 'request'}: ${issue.message}`)
    .join('; ');
