import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email address' })
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(12, { message: 'Password must be at least 12 characters long' })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((val) => /[a-z]/.test(val), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((val) => /[0-9]/.test(val), {
      message: 'Password must contain at least one number',
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: 'Password must contain at least one special character',
    }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(1, { message: 'Password cannot be empty' }),
});

export const refreshTokenSchema = z.object({});

export const verify2FASchema = z.object({
  token: z
    .string()
    .min(1, { message: '2FA token is required' })
    .length(6, { message: 'Token must be exactly 6 characters' })
    .regex(/^\d+$/, { message: 'Token must contain only digits' }),
});

export const setup2FAVerifySchema = z.object({
  token: z
    .string()
    .min(1, { message: '2FA verification token is required' })
    .length(6, { message: 'Token must be exactly 6 characters' })
    .regex(/^\d+$/, { message: 'Token must contain only digits' }),
});
