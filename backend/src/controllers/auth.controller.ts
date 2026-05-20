import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, generate2FATempToken, verify2FATempToken } from '../utils/jwt';
import { logEvent } from '../utils/auditLogger';
import { generateSecret, generateURI, verify } from 'otplib';
import QRCode from 'qrcode';
import bcrypt from 'bcrypt';

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

    // If 2FA is enabled, return a short-lived temp token
    if (user.isTotpEnabled) {
      const tempToken = generate2FATempToken({ userId: user.id });
      res.status(200).json({
        requiresTwoFactor: true,
        tempToken,
      });
      return;
    }

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

/**
 * Handle refresh token rotation.
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawCookies = req.headers.cookie;
    const incomingToken = getCookie(rawCookies, 'refreshToken');

    if (!incomingToken) {
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }

    const tokenHash = crypto.createHash('sha256').update(incomingToken).digest('hex');

    // Look up matching token record
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    // Token theft detection: if a token has already been revoked, it means someone is attempting reuse!
    if (storedToken.revoked) {
      // Revoke all tokens for this user
      await prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId },
        data: { revoked: true },
      });
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    // Check expiration
    if (storedToken.expiresAt < new Date()) {
      res.status(401).json({ error: "Refresh token expired. Please log in again." });
      return;
    }

    const user = storedToken.user;

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    // Mark current token as revoked
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // Store new refresh token hash in database
    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt: newExpiresAt,
      },
    });

    // Set new refresh token in HTTP-only, Secure, SameSite=Strict cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Log token refreshed audit event
    await logEvent({
      userId: user.id,
      action: 'TOKEN_REFRESHED',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
}

/**
 * Helper to generate 8 random 10-character alphanumeric backup codes.
 */
function generateBackupCodes(): string[] {
  const codes: string[] = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 8; i++) {
    let code = '';
    for (let j = 0; j < 10; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(code);
  }
  return codes;
}

/**
 * Handle 2FA setup.
 */
export async function setup2FA(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const secret = generateSecret();

    // Store secret temporarily but keep isTotpEnabled false
    await prisma.user.update({
      where: { id: userId },
      data: {
        totpSecret: secret,
        isTotpEnabled: false,
      },
    });

    const uri = generateURI({
      issuer: 'SecureVault',
      label: user.email,
      secret,
    });
    const qrCode = await QRCode.toDataURL(uri);

    await logEvent({
      userId,
      action: '2FA_SETUP_INITIATED',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({ qrCode, secret });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle 2FA verification and enabling.
 */
export async function verify2FA(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.body;
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.totpSecret) {
      res.status(400).json({ error: "2FA setup has not been initiated" });
      return;
    }

    const { valid: isValid } = await verify({ token, secret: user.totpSecret });
    if (!isValid) {
      res.status(400).json({ error: "Invalid 2FA code" });
      return;
    }

    // Set isTotpEnabled true on user
    await prisma.user.update({
      where: { id: userId },
      data: { isTotpEnabled: true },
    });

    // Generate 8 one-time backup codes
    const plaintextCodes = generateBackupCodes();

    // Hash backup codes with cost 10 using bcrypt and save to BackupCode table
    const backupCodePromises = plaintextCodes.map(async (code) => {
      const codeHash = await bcrypt.hash(code, 10);
      return prisma.backupCode.create({
        data: {
          userId,
          codeHash,
          used: false,
        },
      });
    });
    await Promise.all(backupCodePromises);

    await logEvent({
      userId,
      action: '2FA_ENABLED',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      message: "2FA enabled",
      backupCodes: plaintextCodes,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle 2FA disable.
 */
export async function disable2FA(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { password } = req.body;
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        isTotpEnabled: false,
        totpSecret: null,
      },
    });

    // Delete backup codes for this user
    await prisma.backupCode.deleteMany({
      where: { userId },
    });

    await logEvent({
      userId,
      action: '2FA_DISABLED',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({ message: "2FA disabled successfully" });
  } catch (error) {
    next(error);
  }
}

/**
 * Verify tempToken and TOTP token during login.
 */
export async function twoFactorAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tempToken, token } = req.body;

    if (!tempToken) {
      res.status(400).json({ error: "Temporary token is missing" });
      return;
    }

    let decoded: { userId: string };
    try {
      decoded = verify2FATempToken(tempToken);
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired temporary token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.totpSecret || !user.isTotpEnabled) {
      res.status(400).json({ error: "2FA is not enabled for this account" });
      return;
    }

    const { valid: isValid } = await verify({ token, secret: user.totpSecret });
    if (!isValid) {
      res.status(400).json({ error: "Invalid 2FA code" });
      return;
    }

    // Success - generate full session tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshTokenVal = generateRefreshToken({ userId: user.id });

    // Hash refresh token using SHA-256 before storing
    const tokenHash = crypto.createHash('sha256').update(refreshTokenVal).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Set refresh token in HTTP-only, Secure, SameSite=Strict cookie
    res.cookie('refreshToken', refreshTokenVal, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Log 2FA login success
    await logEvent({
      userId: user.id,
      action: '2FA_LOGIN_SUCCESS',
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
