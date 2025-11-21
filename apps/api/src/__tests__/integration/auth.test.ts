import request from 'supertest';
import app from '../../server';
import prisma from '../../db/prismaClient';

describe('Auth API Integration Tests', () => {
  // Clean up test data after each test
  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'SecurePassword123!',
          name: 'Test User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toContain('test-');
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with existing email', async () => {
      const email = `test-${Date.now()}@example.com`;

      // First registration
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'Password123!',
          name: 'First User',
        })
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'DifferentPassword123!',
          name: 'Second User',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
          password: 'Password123!',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should reject registration with short password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'short',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should respect rate limiting', async () => {
      const email = `test-${Date.now()}`;

      // Make 6 requests (limit is 5 per 15 minutes)
      for (let i = 0; i < 6; i++) {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `${email}-${i}@example.com`,
            password: 'Password123!',
            name: `User ${i}`,
          });

        if (i < 5) {
          expect(response.status).toBeLessThan(429);
        } else {
          expect(response.status).toBe(429);
        }
      }
    }, 15000); // Increase timeout for rate limit test
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `test-${Date.now()}@example.com`;
      const password = 'SecurePassword123!';

      // Register user first
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password,
          name: 'Test User',
        })
        .expect(201);

      // Login
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email,
          password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(email);
    });

    it('should reject login with incorrect password', async () => {
      const email = `test-${Date.now()}@example.com`;

      // Register user
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'CorrectPassword123!',
          name: 'Test User',
        })
        .expect(201);

      // Login with wrong password
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email,
          password: 'WrongPassword123!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user with valid token', async () => {
      const email = `test-${Date.now()}@example.com`;

      // Register and get token
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'Password123!',
          name: 'Test User',
        })
        .expect(201);

      const token = registerResponse.body.token;

      // Get current user
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.email).toBe(email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.error).toContain('authorization');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error).toContain('Invalid token');
    });
  });
});
