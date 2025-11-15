import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

export const createServer = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan('combined'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(routes);
  app.use(errorHandler);

  return app;
};
