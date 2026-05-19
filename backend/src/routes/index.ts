import { Router, Request, Response } from 'express';

const router = Router();

// Future route modules will be mounted here
// router.use('/auth', authRouter);
// router.use('/vaults', vaultsRouter);
// router.use('/credentials', credentialsRouter);
// router.use('/audit-logs', auditLogsRouter);

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'SecureVault API Root Router' });
});

export default router;
