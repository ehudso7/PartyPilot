import request from 'supertest';
import app from '../../server';
import prisma from '../../db/prismaClient';

describe('GDPR Compliance API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'gdpr@example.com',
        password: 'Password123',
        name: 'GDPR Test User',
      });

    authToken = response.body.token;
    userId = response.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/v1/users/export', () => {
    it('should export all user data', async () => {
      const response = await request(app)
        .get('/api/v1/users/export')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe('gdpr@example.com');
      expect(response.body).toHaveProperty('trips');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject export without authentication', async () => {
      const response = await request(app).get('/api/v1/users/export');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/users/account', () => {
    it('should soft delete user account', async () => {
      const response = await request(app)
        .delete('/api/v1/users/account')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted');

      // Verify user is soft deleted
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      expect(user?.deletedAt).not.toBeNull();
      expect(user?.email).toContain('deleted_');
      expect(user?.name).toBe('Deleted User');
    });

    it('should not allow login after account deletion', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'gdpr@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(400);
    });
  });
});
