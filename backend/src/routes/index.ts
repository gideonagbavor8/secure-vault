import { Router, Request, Response } from 'express';
import authRouter from './auth.routes';

const router = Router();

// Mount Auth routes
router.use('/auth', authRouter);

// Future route modules will be mounted here
// router.use('/vaults', vaultsRouter);
// router.use('/vaults', vaultsRouter);
// router.use('/credentials', credentialsRouter);
// router.use('/audit-logs', auditLogsRouter);

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'SecureVault API Root Router' });
});

export default router;
