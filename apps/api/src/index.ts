import app from './server';
import { config, validateConfig } from './config/env';
import { logger } from './config/logger';
import { startNotificationScheduler } from './jobs/notifications';
import prisma from './db/prismaClient';

validateConfig();

// Start notification scheduler
const scheduler = startNotificationScheduler();

// Start server
const server = app.listen(config.port, () => {
  logger.info(`PartyPilot API running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  
  // Stop accepting new requests
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  // Close database connections
  try {
    await prisma.$disconnect();
    logger.info('Database connections closed');
  } catch (error) {
    logger.error('Error closing database connections:', error);
  }
  
  // Note: Notification scheduler cleanup would go here if we had a stop method
  // For now, node-cron will stop automatically when process exits
  
  process.exit(0);
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});
