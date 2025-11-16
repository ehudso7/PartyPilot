import { PrismaClient } from '@prisma/client';

import { env } from '../config/env';
import { logger } from '../config/logger';

const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  }
});

process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma };
