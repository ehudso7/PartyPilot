import { env } from '@config/env';
import { logger } from '@config/logger';
import { prisma } from '@db/prismaClient';
import { createServer } from './server';

const start = async () => {
  try {
    await prisma.$connect();
    const app = createServer();

    app.listen(env.PORT, () => {
      logger.info(`🚀 PartyPilot API running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

start();
