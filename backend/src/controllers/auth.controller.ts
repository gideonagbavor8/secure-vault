import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { logEvent } from '../utils/auditLogger';

// Helper to manually parse cookies from headers without requiring external cookie-parser
function getCookie(cookieString: string | undefined, name: string): string | null {
  if (!cookieString) return null;
  const match = cookieString.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// In-memory failed login attempts tracking store
interface LoginAttempt {
  attempts: number;
  lockUntil?: Date;
}
const loginAttemptsStore = new Map<string, LoginAttempt>();

/**
 * Handle user registration.
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase().trim();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    // Hash the master password
    const passwordHash = await hashPassword(password);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email: emailLower,
        passwordHash,
        isVerified: false,
      },
    });

    // Log registration audit event
    await logEvent({
      userId: newUser.id,
      action: 'USER_REGISTERED',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle user login with lockout tracking.
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase().trim();

    // Check if account has been locked
    const attemptInfo = loginAttemptsStore.get(emailLower);
    if (attemptInfo && attemptInfo.lockUntil && attemptInfo.lockUntil > new Date()) {
      res.status(423).json({ error: "Account temporarily locked. Try again later." });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    // If user not found, perform timing attack dummy compare and track attempt
    if (!user) {
      await comparePassword(password, '$2b$12$DummyHashForTimingAttackPreventionDoNotUseInProd');
      
      const attempts = (attemptInfo?.attempts || 0) + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : undefined;
      loginAttemptsStore.set(emailLower, { attempts, lockUntil });

      if (lockUntil) {
        res.status(423).json({ error: "Account temporarily locked. Try again later." });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
      return;
    }

    // Compare passwords using bcrypt compare
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      const attempts = (attemptInfo?.attempts || 0) + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : undefined;
      loginAttemptsStore.set(emailLower, { attempts, lockUntil });

      if (lockUntil) {
        res.status(423).json({ error: "Account temporarily locked. Try again later." });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
      return;
    }

    // Reset failed login attempt tracker on successful verification
    loginAttemptsStore.delete(emailLower);

    // Generate credentials
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Hash refresh token using SHA-256 before storing
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Set refresh token in HTTP-only, Secure, SameSite=Strict cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Log successful login audit event
    await logEvent({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle user logout.
 */
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawCookies = req.headers.cookie;
    const refreshToken = getCookie(rawCookies, 'refreshToken');

    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      
      // Mark matching RefreshToken records as revoked
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revoked: true },
      });
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    // Log logout audit event
    if (req.user) {
      await logEvent({
        userId: req.user.userId,
        action: 'LOGOUT',
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'],
      });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}
