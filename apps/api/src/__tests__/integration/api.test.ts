import request from 'supertest';
import app from '../../server';
import prisma from '../../db/prismaClient';
import bcrypt from 'bcryptjs';

// Mock database
jest.mock('../../db/prismaClient', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    trip: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $queryRaw: jest.fn(),
  },
}));

describe('API Integration Tests', () => {
  let authToken: string;
  let userId: string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);

      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.database).toBe('connected');
    });

    it('should return error if database is down', async () => {
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error('Connection failed'));

      const response = await request(app).get('/health');

      expect(response.status).toBe(503);
      expect(response.body.database).toBe('disconnected');
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it('should reject registration with existing email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          name: 'Test User',
        });

      expect(response.status).toBe(409);
    });
  });

  describe('Trips', () => {
    beforeEach(async () => {
      // Setup authenticated user
      userId = 'user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        });

      authToken = loginResponse.body.token;
    });

    it('should require authentication for trip planning', async () => {
      const response = await request(app)
        .post('/api/v1/trips/plan')
        .send({ prompt: 'Test trip' });

      expect(response.status).toBe(401);
    });

    it('should create trip with valid authentication', async () => {
      const mockTrip = {
        id: 'trip-123',
        userId,
        title: 'Test Trip',
        city: 'NYC',
        dateStart: new Date(),
        dateEnd: new Date(),
        groupSizeMin: 10,
        groupSizeMax: 15,
        occasion: 'bachelor',
        budgetLevel: 'medium',
        status: 'draft',
      };

      // Mock planner and repository
      jest.spyOn(require('../../modules/planner/service'), 'parsePlannerPrompt').mockResolvedValue({
        title: 'Test Trip',
        city: 'NYC',
        dateStart: new Date().toISOString(),
        dateEnd: new Date().toISOString(),
        groupSizeMin: 10,
        groupSizeMax: 15,
        occasion: 'bachelor',
        budgetLevel: 'medium',
        events: [],
      });

      jest.spyOn(require('../../modules/trips/repository'), 'createTrip').mockResolvedValue(mockTrip);

      const response = await request(app)
        .post('/api/v1/trips/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ prompt: 'Test trip' });

      expect(response.status).toBe(201);
      expect(response.body.trip).toBeDefined();
    });
  });
});
