import { execSync } from 'child_process';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { prisma } from '../lib/prisma';

// Ensure we are using the test database
beforeAll(async () => {
  if (process.env.TEST_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  }

  // Run Prisma migrations against the test database
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
  });
  await prisma.$connect();
}, 30000);

// Clean up database between tests in correct dependency order
afterEach(async () => {
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.backupCode.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Authentication Integration Tests', () => {
  const registerPayload = {
    email: 'test@example.com',
    password: 'SecurePassword123!',
  };

  describe('Registration - POST /api/auth/register', () => {
    it('should register a user with valid data (201)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(registerPayload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Registration successful. Please verify your email.');

      const user = await prisma.user.findUnique({
        where: { email: registerPayload.email },
      });
      expect(user).toBeTruthy();
      expect(user?.isVerified).toBe(false);
      expect(user?.passwordHash).not.toBe(registerPayload.password);
    });

    it('should not register a duplicate email (409)', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(registerPayload);

      // Duplicate registration
      const res = await request(app)
        .post('/api/auth/register')
        .send(registerPayload);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error', 'Email already registered');
    });

    it('should reject a weak password (400)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'weak',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject an invalid email format (400)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePassword123!',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Login - POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send(registerPayload);
    });

    it('should login with valid credentials (200), return accessToken, and set cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(registerPayload);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toHaveProperty('email', registerPayload.email);

      const cookies = res.headers['set-cookie'] as any;
      expect(cookies).toBeDefined();
      const hasRefreshToken = cookies.some((cookie: string) => cookie.includes('refreshToken='));
      expect(hasRefreshToken).toBe(true);
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: registerPayload.email,
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 for unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'SecurePassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('Refresh Token - POST /api/auth/refresh', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send(registerPayload);
    });

    it('should refresh access token with a valid cookie (200)', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send(registerPayload);

      const cookies = loginRes.headers['set-cookie'] as any;

      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('should return 401 with no cookie', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send();

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'No refresh token provided');
    });

    it('should return 401 after logout (revoked token)', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send(registerPayload);

      const accessToken = loginRes.body.accessToken;
      const cookies = loginRes.headers['set-cookie'] as any;

      // Logout to revoke the refresh token
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', cookies);

      // Attempt to refresh
      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid refresh token');
    });
  });

  describe('Protected Routes', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send(registerPayload);
    });

    it('should allow access to health check with a valid auth header (200)', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send(registerPayload);

      const accessToken = loginRes.body.accessToken;

      const res = await request(app)
        .get('/api/health')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });

    it('should return 401 for a protected route with no token', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send();

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthorised');
    });

    it('should return 401 for a protected route with an expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: 'test-uuid', email: registerPayload.email, role: 'STANDARD' },
        process.env.JWT_SECRET || 'your_jwt_secret_here_change_in_production',
        { expiresIn: '-1s' }
      );

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send();

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthorised');
    });
  });
});
