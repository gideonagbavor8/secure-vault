import { Router } from 'express';
import {
  createVault,
  deleteVault,
  getVault,
  getVaults,
  restoreVault,
  updateVault,
} from '../controllers/vault.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createVaultSchema, updateVaultSchema } from '../validators';

const router = Router();

router.use(authenticate);

router.post('/', validate(createVaultSchema), createVault);
router.get('/', getVaults);
router.get('/:id', getVault);
router.patch('/:id', validate(updateVaultSchema), updateVault);
router.delete('/:id', deleteVault);
router.patch('/:id/restore', restoreVault);

export default router;
