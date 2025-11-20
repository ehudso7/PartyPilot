import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import { ZodError } from 'zod';
import { config } from './config/env';
import { logger } from './config/logger';

// Routes
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import tripsRoutes from './routes/trips';
import reservationsRoutes from './routes/reservations';
import shareRoutes from './routes/share';

const app = express();

// Initialize Sentry for error tracking
if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.nodeEnv,
    tracesSampleRate: config.nodeEnv === 'production' ? 0.1 : 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Security: HTTPS enforcement in production
app.use((req: Request, res: Response, next: NextFunction) => {
  if (config.nodeEnv === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
}));

// CORS configuration
const allowedOrigins = [
  config.corsOrigin,
  config.appUrl,
  config.nodeEnv === 'development' && 'http://localhost:3000',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('Blocked by CORS', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
    });
  });

  next();
});

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', globalLimiter);
app.use('/api/v1/', globalLimiter);

// Strict rate limiting for expensive operations
const planLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 trip plans per hour
  message: 'Trip planning limit reached, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/trips/plan', planLimiter);
app.use('/api/v1/trips/plan', planLimiter);

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// Health check (no auth required)
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv,
  });
});

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/trips', tripsRoutes);
app.use('/api/v1/reservations', reservationsRoutes);

// Public share endpoint (no auth)
app.use('/api/v1/share', shareRoutes);

// Legacy routes (redirect to v1)
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/share', shareRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn('404 Not Found', { path: req.path, method: req.method });
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Sentry error handler (must be before other error handlers)
if (config.sentryDsn) {
  app.use(Sentry.Handlers.errorHandler());
}

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Don't log validation errors as errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }
  
  if (err.message?.includes('Validation')) {
    return res.status(400).json({
      error: 'Validation failed',
      message: err.message,
    });
  }

  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't leak error details in production
  const message = config.nodeEnv === 'production'
    ? 'An unexpected error occurred'
    : err.message;

  res.status(500).json({
    error: 'Internal Server Error',
    message,
  });
});

export default app;
