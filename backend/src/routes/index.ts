import { Router, Request, Response } from 'express';
import authRouter from './auth.routes';
import vaultRouter from './vault.routes';

const router = Router();

// Mount Auth routes
router.use('/auth', authRouter);
router.use('/vaults', vaultRouter);

// Future route modules will be mounted here
// router.use('/credentials', credentialsRouter);
// router.use('/audit-logs', auditLogsRouter);

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'SecureVault API Root Router' });
});

export default router;
