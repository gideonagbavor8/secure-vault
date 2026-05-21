import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/rateLimiter';
import rootRouter from './routes/index';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// Simple Request Logger (disabled in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[logger]: ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// Apply rate limiting globally to all API routes (except under test environment to prevent rate-limit errors in integration tests)
if (process.env.NODE_ENV !== 'test') {
  app.use('/api', apiLimiter);
}

// Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Mount Root Router
app.use('/api', rootRouter);

export default app;
