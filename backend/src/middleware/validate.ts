import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';

/**
 * Express middleware factory to validate req.body against a Zod schema.
 */
export function validate(schema: ZodType<any>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.flatten().fieldErrors,
        });
        return;
      }
      next(error);
    }
  };
}
