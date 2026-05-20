import { Router } from 'express';
import { register, login, logout, refreshToken, setup2FA, verify2FA, disable2FA, twoFactorAuthenticate } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authLimiter, strictAuthLimiter, sensitiveOpLimiter } from '../middleware/rateLimiter';
import { registerSchema, loginSchema, verify2FASchema } from '../validators';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', strictAuthLimiter, validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.post('/refresh', authLimiter, refreshToken);

// Two-Factor Authentication (2FA) Routes
router.post('/2fa/setup', authenticate, sensitiveOpLimiter, setup2FA);
router.post('/2fa/verify', authenticate, sensitiveOpLimiter, verify2FA);
router.post('/2fa/disable', authenticate, sensitiveOpLimiter, disable2FA);
router.post('/2fa/authenticate', strictAuthLimiter, validate(verify2FASchema), twoFactorAuthenticate);

export default router;
