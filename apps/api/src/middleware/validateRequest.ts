import type { RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject): RequestHandler => {
  return (req, _res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};
