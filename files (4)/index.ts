/**
 * index.ts
 * Application entry point.
 *
 * Boot order:
 *   1. Load & validate environment variables
 *   2. Connect to MongoDB
 *   3. Configure Express with security middleware
 *   4. Mount routes
 *   5. Attach centralized error handler
 *   6. Start server
 */
import 'dotenv/config';
import { validateEnv } from './envValidator';

// Validate env FIRST — fail fast before any imports that read process.env
const env = validateEnv();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { requestId } from './middleware/requestId';
import { apiLimiter } from './middleware/rateLimiters';
import { errorHandler } from './errorHandler';
import logger from './utils/logger';

// Routes
import authRoutes from './routes/auth';
import apiKeyRoutes from './routes/api-keys';
import billingRoutes from './routes/billing';
import sshRoutes from './routes/ssh-management';
import eventsRoutes from './routes/events';

/* ════════════════════════════════════════════════════
   Express App Configuration
════════════════════════════════════════════════════ */
const app = express();

/* ── Security Headers (Helmet) ───────────────────── */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

/* ── Request ID (must be first) ──────────────────── */
app.use(requestId);

/* ── CORS — allowlist only, NO wildcard ──────────── */
const allowedOrigins = env.ALLOWED_ORIGINS;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-request-id'],
    exposedHeaders: ['x-request-id'],
  }),
);

/* ── HTTP Logging ─────────────────────────────────── */
if (env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    }),
  );
}

/* ── Body Parsers ────────────────────────────────── */
// Note: /api/billing/webhook uses raw() — mounted BEFORE json() via route-level middleware
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/* ── Global Rate Limiter ─────────────────────────── */
app.use('/api/', apiLimiter);

/* ── Health Check (no auth, no rate limit) ───────── */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || '2.0.0',
  });
});

/* ════════════════════════════════════════════════════
   Route Mounting
════════════════════════════════════════════════════ */
app.use('/api/auth', authRoutes);
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/ssh', sshRoutes);
app.use('/api/events', eventsRoutes);

/* ── 404 Handler ─────────────────────────────────── */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'The requested endpoint does not exist',
    code: 'NOT_FOUND',
    timestamp: new Date().toISOString(),
  });
});

/* ── Central Error Handler (MUST be last) ─────────── */
app.use(errorHandler);

/* ════════════════════════════════════════════════════
   Database Connection + Server Start
════════════════════════════════════════════════════ */
async function bootstrap(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`[DB] Connected to MongoDB`);

    const server = app.listen(env.PORT, () => {
      logger.info(`[Server] ReclamTrack running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`[Server] CORS allowed origins: ${env.ALLOWED_ORIGINS.join(', ')}`);
    });

    /* ── Graceful Shutdown ──────────────────────────── */
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`[Server] ${signal} received — shutting down gracefully`);
      server.close(async () => {
        await mongoose.connection.close();
        logger.info('[Server] Closed all connections. Goodbye.');
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        logger.error('[Server] Forced shutdown after timeout');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    /* ── Unhandled Rejection Guard ──────────────────── */
    process.on('unhandledRejection', (reason) => {
      logger.error('[Process] Unhandled promise rejection', { reason });
    });

    process.on('uncaughtException', (err) => {
      logger.error('[Process] Uncaught exception — shutting down', { error: err.message, stack: err.stack });
      process.exit(1);
    });

  } catch (err) {
    logger.error('[Bootstrap] Startup failed', { error: err });
    process.exit(1);
  }
}

bootstrap();

export { app }; // For testing
