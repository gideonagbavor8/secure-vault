import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';
import { apiLimiter } from './middleware/rateLimiter';
import rootRouter from './routes/index';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// Simple Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[logger]: ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Apply rate limiting globally to all API routes
app.use('/api', apiLimiter);

// Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Mount Root Router
app.use('/api', rootRouter);

// Start Server & Test Database Connection
async function startServer() {
  try {
    await prisma.$connect();
    console.log('[database]: Successfully connected to PostgreSQL via Prisma.');

    app.listen(PORT, () => {
      console.log(`[server]: Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[database]: Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}

startServer();
