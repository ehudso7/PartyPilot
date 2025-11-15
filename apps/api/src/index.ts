import http from 'node:http';

import { env } from './config/env';
import { gracefullyShutdownPrisma } from './db/client';
import { createServer } from './server';

async function bootstrap() {
  const app = createServer();
  const server = http.createServer(app);

  server.listen(env.API_PORT, () => {
    console.log(`PartyPilot API listening on port ${env.API_PORT}`);
  });

  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    server.close();
    await gracefullyShutdownPrisma();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

void bootstrap();
