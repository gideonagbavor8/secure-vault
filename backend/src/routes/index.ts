import { Router, Request, Response } from 'express';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply authLimiter to the /auth prefix
router.use('/auth', authLimiter);

// Future route modules will be mounted here
// router.use('/auth', authRouter);
// router.use('/vaults', vaultsRouter);
// router.use('/credentials', credentialsRouter);
// router.use('/audit-logs', auditLogsRouter);

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'SecureVault API Root Router' });
});

export default router;
