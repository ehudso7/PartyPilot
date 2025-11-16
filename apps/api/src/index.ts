import { env } from './config/env';
import { logger } from './config/logger';
import { createServer } from './server';

const app = createServer();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'API server listening');
});
