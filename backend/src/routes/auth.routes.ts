import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authLimiter, strictAuthLimiter } from '../middleware/rateLimiter';
import { registerSchema, loginSchema } from '../validators';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', strictAuthLimiter, validate(loginSchema), login);
router.post('/logout', authenticate, logout);

export default router;
