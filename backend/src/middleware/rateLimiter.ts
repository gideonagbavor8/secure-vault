import rateLimit from 'express-rate-limit';

/**
 * Limiters for SecureVault backend routes to protect against brute-force attacks.
 */

// 1. authLimiter — for general registration and base authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

// 2. strictAuthLimiter — for the login endpoint specifically (applied on top of authLimiter)
export const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: "Too many login attempts. Account may be locked. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. apiLimiter — general limiter for all API routes
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: { error: "Rate limit exceeded. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. sensitiveOpLimiter — for sensitive actions like 2FA setup and password reset
export const sensitiveOpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: "Too many requests for this operation. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
