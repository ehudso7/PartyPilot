import 'dotenv/config';
import { createServer } from './server';

const PORT = process.env.PORT || 3000;

async function main() {
  const app = createServer();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
