import { env } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogMethod = (message: string, meta?: Record<string, unknown>) => void;

const buildLoggerMethod = (level: LogLevel): LogMethod => {
  return (message, meta = {}) => {
    const payload = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${payload}`);
  };
};

const isDev = env.NODE_ENV !== 'production';

export const logger = {
  debug: isDev ? buildLoggerMethod('debug') : () => undefined,
  info: buildLoggerMethod('info'),
  warn: buildLoggerMethod('warn'),
  error: buildLoggerMethod('error')
};
