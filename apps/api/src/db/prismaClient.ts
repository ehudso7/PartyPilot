import { PrismaClient } from '@prisma/client';
import { env } from '@config/env';
import { logger } from '@config/logger';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL
      }
    },
    log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error']
  });

if (env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
