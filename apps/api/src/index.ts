import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './db/prismaClient';
import { createServer } from './server';

const app = createServer();

const server = app.listen(env.PORT, () => {
  logger.info(`PartyPilot API listening on port ${env.PORT}`);
});

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  server.close(async (closeErr) => {
    if (closeErr) {
      logger.error('Error shutting down HTTP server', { error: closeErr });
    }
    await prisma.$disconnect();
    process.exit(0);
  });
};

['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => void shutdown(sig));
});
