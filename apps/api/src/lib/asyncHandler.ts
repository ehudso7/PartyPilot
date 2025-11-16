import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler = <P, ResBody, ReqBody, ReqQuery>(
  handler: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) =>
    | Promise<void>
    | void
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((error: unknown) => { next(error); });
  };
};
