import request from 'supertest';
import app from '../../server';
import prisma from '../../db/prismaClient';

describe('Trips API', () => {
  let authToken: string;
  let userId: string;
  let tripId: string;

  beforeAll(async () => {
    // Create test user
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'triptest@example.com',
        password: 'Password123',
        name: 'Trip Test User',
      });

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    // Clean up
    await prisma.trip.deleteMany({
      where: { userId },
    });
    await prisma.user.delete({
      where: { id: userId },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/trips/plan', () => {
    it('should create a trip from a prompt', async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt:
            'Plan my bachelor party in NYC on December 15, 2025, 12 people, mid-budget, dinner and bar',
        });

      expect(response.status).toBe(201);
      expect(response.body.trip).toHaveProperty('id');
      expect(response.body.trip.city).toBeDefined();
      expect(response.body.events).toBeInstanceOf(Array);

      tripId = response.body.trip.id;
    });

    it('should reject trip creation without authentication', async () => {
      const response = await request(app).post('/api/v1/trips/plan').send({
        prompt: 'Plan a party',
      });

      expect(response.status).toBe(401);
    });

    it('should reject trip creation with empty prompt', async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: '',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/trips/:tripId', () => {
    it('should retrieve trip details', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(tripId);
      expect(response.body).toHaveProperty('events');
      expect(response.body).toHaveProperty('reservations');
    });

    it('should reject unauthorized access to trip', async () => {
      // Create another user
      const otherUser = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'other@example.com',
          password: 'Password123',
          name: 'Other User',
        });

      const response = await request(app)
        .get(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${otherUser.body.token}`);

      expect(response.status).toBe(404);

      // Clean up
      await prisma.user.delete({
        where: { id: otherUser.body.user.id },
      });
    });

    it('should return 404 for non-existent trip', async () => {
      const response = await request(app)
        .get('/api/v1/trips/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/trips/:tripId', () => {
    it('should update trip details', async () => {
      const response = await request(app)
        .put(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Bachelor Party',
          status: 'confirmed',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Bachelor Party');
      expect(response.body.status).toBe('confirmed');
    });
  });

  describe('GET /api/v1/trips/:tripId/events', () => {
    it('should retrieve trip events', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}/events`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/trips/:tripId/export/ics', () => {
    it('should export trip as ICS calendar', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}/export/ics`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/calendar');
      expect(response.text).toContain('BEGIN:VCALENDAR');
      expect(response.text).toContain('END:VCALENDAR');
    });
  });

  describe('GET /api/v1/trips/:tripId/export/pdf', () => {
    it('should export trip as PDF', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}/export/pdf`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');
    });
  });

  describe('GET /api/v1/trips/:tripId/share-link', () => {
    it('should generate or retrieve share link', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}/share-link`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.url).toBeDefined();
      expect(response.body.url).toContain('/t/');
    });
  });

  describe('POST /api/v1/trips/:tripId/notifications/bootstrap', () => {
    it('should bootstrap notifications for trip', async () => {
      const response = await request(app)
        .post(`/api/v1/trips/${tripId}/notifications/bootstrap`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body.notifications).toBeInstanceOf(Array);
      expect(response.body.notifications.length).toBeGreaterThan(0);
    });
  });
});
