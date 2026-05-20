import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to restrict route access to ADMIN users only.
 * Must be mounted after the authenticate middleware.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden — admin access required' });
    return;
  }
  next();
}
