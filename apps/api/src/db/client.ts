import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

declare global {
  // eslint-disable-next-line no-var
  var __PRISMA_CLIENT__: PrismaClient | undefined;
}

export const prisma =
  global.__PRISMA_CLIENT__ ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (env.NODE_ENV !== 'production') {
  global.__PRISMA_CLIENT__ = prisma;
}
