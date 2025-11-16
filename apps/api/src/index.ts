import app from './server';
import { config, validateConfig } from './config/env';
import { logger } from './config/logger';

validateConfig();

app.listen(config.port, () => {
  logger.info(`PartyPilot API running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});
