import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { createAppRouter } from './routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export const createServer = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',') ?? '*'
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(requestLogger);

  app.use('/api', createAppRouter());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
