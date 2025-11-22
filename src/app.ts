import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/config';
import { registerModules } from './modules';
import { errorHandler, notFoundHandler, requestLogger, rateLimit } from './modules/shared';

export const createApp = (): Application => {
  const app = express();

  // Trust proxy for rate limiting and IP detection
  app.set('trust proxy', 1);

  // Request logging (development only)
  if (config.nodeEnv === 'development') {
    app.use(requestLogger);
  }

  // Security middleware
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rate limiting (100 requests per minute)
  app.use('/api', rateLimit(100, 60000));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv
    });
  });

  // API routes - Register all modules
  app.use('/api', registerModules());

  // Error handlers (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
