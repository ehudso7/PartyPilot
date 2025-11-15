import { config } from './config/env';
import { logger } from './config/logger';
import { createServer } from './server';

const PORT = config.port || 3000;

async function main() {
  try {
    const app = createServer();
    
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
