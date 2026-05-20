import jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

/**
 * Generates an Access Token (JWT) expiring in 15 minutes.
 */
export function generateAccessToken(payload: AccessTokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined.');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '15m',
    algorithm: 'HS256',
  });
}

/**
 * Generates a Refresh Token (JWT) expiring in 7 days.
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is not defined.');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
}

/**
 * Verifies an Access Token and returns the decoded payload, or throws an error.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined.');
  }

  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
  return decoded as AccessTokenPayload;
}

/**
 * Verifies a Refresh Token and returns the decoded payload, or throws an error.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is not defined.');
  }

  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
  return decoded as RefreshTokenPayload;
}
