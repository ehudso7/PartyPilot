import request from 'supertest';
import app from '../../server';
import prisma from '../../db/prismaClient';

describe('Trips API Integration Tests', () => {
  let authToken: string;
  let userId: string;

  // Create a test user before all tests
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `test-trips-${Date.now()}@example.com`,
        password: 'SecurePassword123!',
        name: 'Trip Test User',
      });

    authToken = response.body.token;
    userId = response.body.user.id;
  });

  // Clean up after all tests
  afterAll(async () => {
    await prisma.user.delete({
      where: { id: userId },
    });
  });

  describe('POST /api/v1/trips/plan', () => {
    it('should create a trip from a natural language prompt', async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Plan a bachelor party in NYC on January 17, 2026 for 15 people, Italian dinner and games bar',
        })
        .expect(201);

      expect(response.body).toHaveProperty('trip');
      expect(response.body).toHaveProperty('events');
      expect(response.body.trip.userId).toBe(userId);
      expect(response.body.trip.city).toBeDefined();
      expect(response.body.events).toBeInstanceOf(Array);
    });

    it('should reject trip planning without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .send({
          prompt: 'Plan a party',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject trip planning with short prompt', async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Party',
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should respect rate limiting (10 plans per hour)', async () => {
      // Skip in CI/CD as it's time-consuming
      if (process.env.CI) {
        return;
      }

      const responses = [];
      for (let i = 0; i < 11; i++) {
        const response = await request(app)
          .post('/api/v1/trips/plan')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            prompt: `Plan party ${i} with unique details`,
          });

        responses.push(response.status);
      }

      // Last request should be rate limited
      expect(responses[10]).toBe(429);
    }, 30000);
  });

  describe('GET /api/v1/trips/:tripId', () => {
    let tripId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Plan a simple birthday party in NYC for 10 people',
        });

      tripId = response.body.trip.id;
    });

    it('should retrieve trip details', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(tripId);
      expect(response.body.userId).toBe(userId);
      expect(response.body).toHaveProperty('events');
    });

    it('should reject access without authentication', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject access to non-existent trip', async () => {
      const response = await request(app)
        .get('/api/v1/trips/clwxyz1234567890')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject access to other users trips', async () => {
      // Create another user
      const otherUserResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `other-user-${Date.now()}@example.com`,
          password: 'Password123!',
          name: 'Other User',
        });

      const otherToken = otherUserResponse.body.token;
      const otherUserId = otherUserResponse.body.user.id;

      // Try to access first user's trip
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.error).toContain('Unauthorized');

      // Clean up
      await prisma.user.delete({ where: { id: otherUserId } });
    });
  });

  describe('GET /api/v1/trips/:tripId/export/ics', () => {
    let tripId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Plan a corporate event in NYC for 20 people with dinner and networking',
        });

      tripId = response.body.trip.id;
    });

    it('should export ICS calendar file', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}/export/ics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/calendar');
      expect(response.text).toContain('BEGIN:VCALENDAR');
      expect(response.text).toContain('VERSION:2.0');
      expect(response.text).toContain('BEGIN:VEVENT');
      expect(response.text).toContain('END:VCALENDAR');
    });
  });

  describe('GET /api/v1/trips/:tripId/export/pdf', () => {
    let tripId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Plan an anniversary celebration in NYC for 6 people',
        });

      tripId = response.body.trip.id;
    });

    it('should export PDF itinerary', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}/export/pdf`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toBe('application/pdf');
      expect(response.body).toBeInstanceOf(Buffer);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/trips/:tripId/share-link', () => {
    let tripId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Plan a group outing in NYC',
        });

      tripId = response.body.trip.id;
    });

    it('should generate a public share link', async () => {
      const response = await request(app)
        .get(`/api/v1/trips/${tripId}/share-link`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('url');
      expect(response.body.url).toContain('/t/');
    });

    it('should return same share link on subsequent calls', async () => {
      const response1 = await request(app)
        .get(`/api/v1/trips/${tripId}/share-link`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response2 = await request(app)
        .get(`/api/v1/trips/${tripId}/share-link`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response1.body.url).toBe(response2.body.url);
    });
  });

  describe('POST /api/v1/trips/:tripId/notifications/bootstrap', () => {
    let tripId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Plan a weekend celebration in NYC for 12 people',
        });

      tripId = response.body.trip.id;
    });

    it('should create notification schedule', async () => {
      const response = await request(app)
        .post(`/api/v1/trips/${tripId}/notifications/bootstrap`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body.notifications).toBeInstanceOf(Array);
      expect(response.body.notifications.length).toBeGreaterThanOrEqual(3);

      const types = response.body.notifications.map((n: any) => n.type);
      expect(types).toContain('weather_check');
      expect(types).toContain('headcount');
      expect(types).toContain('dress_code');
    });
  });
});
