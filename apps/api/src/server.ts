import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from '@middleware/errorHandler';
import { apiRouter } from '@routes/index';

export const createServer = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: '*'
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.get('/', (_req, res) => {
    res.json({ name: 'PartyPilot API', status: 'ok' });
  });

  app.use('/api', apiRouter);

  app.use(errorHandler);

  return app;
};
