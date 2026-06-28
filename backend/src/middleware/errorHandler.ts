import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors';

const isProduction = process.env.NODE_ENV === 'production';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Conflict' });
      return;
    }

    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Not Found' });
      return;
    }
  }

  const fallbackMessage = 'Internal server error';
  const errorMessage = error instanceof Error ? error.message : fallbackMessage;
  const stack = error instanceof Error ? error.stack : undefined;

  res.status(500).json(
    isProduction
      ? { error: fallbackMessage }
      : {
          error: errorMessage,
          stack,
        }
  );
}
