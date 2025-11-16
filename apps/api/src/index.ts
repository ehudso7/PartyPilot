import app from './server';
import { config, validateConfig } from './config/env';
import { logger } from './config/logger';
import { startNotificationScheduler } from './jobs/notifications';

validateConfig();

// Start notification scheduler
startNotificationScheduler();

app.listen(config.port, () => {
  logger.info(`PartyPilot API running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});
