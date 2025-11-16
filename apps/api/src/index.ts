import { createServer } from './server';
import { env } from './config/env';
import { logger } from './config/logger';

const bootstrap = async () => {
  try {
    const app = createServer();

    app.listen(env.PORT, () => {
      logger.info(`API listening on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

void bootstrap();
