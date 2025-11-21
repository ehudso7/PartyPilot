import { planTrip, getTripById, updateTrip, generateIcs, generatePdf, getOrCreateShareLink, bootstrapNotifications } from '../service';
import prisma from '../../../db/prismaClient';
import * as plannerService from '../../planner/service';

// Mock dependencies
jest.mock('../../../db/prismaClient', () => ({
  __esModule: true,
  default: {
    trip: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    shareLink: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../planner/service');
jest.mock('../repository');
jest.mock('../../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Trip Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('planTrip', () => {
    it('should create a trip with events from planner output', async () => {
      const mockPlanData = {
        title: 'Bachelor Party NYC',
        city: 'NYC',
        dateStart: '2026-01-17T00:00:00.000Z',
        dateEnd: '2026-01-17T23:59:59.000Z',
        groupSizeMin: 13,
        groupSizeMax: 17,
        occasion: 'bachelor',
        budgetLevel: 'medium',
        events: [
          {
            type: 'meetup',
            title: 'Kickoff Drinks',
            description: 'Start the night',
            startTime: '2026-01-17T17:00:00.000Z',
            endTime: '2026-01-17T18:30:00.000Z',
          },
          {
            type: 'meal',
            title: 'Italian Dinner',
            description: 'Group dinner',
            startTime: '2026-01-17T19:00:00.000Z',
            endTime: '2026-01-17T21:00:00.000Z',
          },
        ],
      };

      const mockTrip = {
        id: 'trip-123',
        userId: 'user-123',
        ...mockPlanData,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockEvents = [
        { id: 'event-1', tripId: 'trip-123', orderIndex: 0, ...mockPlanData.events[0] },
        { id: 'event-2', tripId: 'trip-123', orderIndex: 1, ...mockPlanData.events[1] },
      ];

      (plannerService.parsePlannerPrompt as jest.Mock).mockResolvedValue(mockPlanData);
      (prisma.trip.create as jest.Mock).mockResolvedValue(mockTrip);
      (prisma.event.create as jest.Mock)
        .mockResolvedValueOnce(mockEvents[0])
        .mockResolvedValueOnce(mockEvents[1]);

      const result = await planTrip('Plan my bachelor party in NYC', 'user-123');

      expect(result.trip).toEqual(mockTrip);
      expect(result.events).toHaveLength(2);
      expect(prisma.event.create).toHaveBeenCalledTimes(2);
      expect(plannerService.parsePlannerPrompt).toHaveBeenCalledWith('Plan my bachelor party in NYC');
    });

    it('should handle empty events array', async () => {
      const mockPlanData = {
        title: 'Simple Event',
        city: 'NYC',
        dateStart: '2026-01-17T00:00:00.000Z',
        dateEnd: '2026-01-17T23:59:59.000Z',
        groupSizeMin: 5,
        groupSizeMax: 10,
        occasion: 'other',
        budgetLevel: 'low',
        events: [],
      };

      const mockTrip = {
        id: 'trip-123',
        userId: 'user-123',
        ...mockPlanData,
        status: 'draft',
      };

      (plannerService.parsePlannerPrompt as jest.Mock).mockResolvedValue(mockPlanData);
      (prisma.trip.create as jest.Mock).mockResolvedValue(mockTrip);

      const result = await planTrip('Simple event', 'user-123');

      expect(result.events).toHaveLength(0);
      expect(prisma.event.create).not.toHaveBeenCalled();
    });
  });

  describe('generateIcs', () => {
    it('should generate valid ICS calendar file', async () => {
      const mockTrip = {
        id: 'trip-123',
        title: 'Bachelor Party',
        city: 'NYC',
        events: [
          {
            id: 'event-1',
            title: 'Dinner',
            startTime: new Date('2026-01-17T19:00:00.000Z'),
            endTime: new Date('2026-01-17T21:00:00.000Z'),
            description: 'Italian restaurant',
            venue: {
              name: 'Restaurant Name',
              address: '123 Main St, NYC',
            },
          },
        ],
      };

      // Mock getTripById which is imported from the same module
      const getTripByIdMock = jest.fn().mockResolvedValue(mockTrip);
      jest.spyOn(require('../service'), 'getTripById').mockImplementation(getTripByIdMock);

      const icsContent = await generateIcs('trip-123');

      expect(icsContent).toContain('BEGIN:VCALENDAR');
      expect(icsContent).toContain('VERSION:2.0');
      expect(icsContent).toContain('BEGIN:VEVENT');
      expect(icsContent).toContain('SUMMARY:Dinner');
      expect(icsContent).toContain('LOCATION:123 Main St, NYC');
      expect(icsContent).toContain('DESCRIPTION:Italian restaurant');
      expect(icsContent).toContain('END:VEVENT');
      expect(icsContent).toContain('END:VCALENDAR');
    });

    it('should throw error if trip not found', async () => {
      const getTripByIdMock = jest.fn().mockResolvedValue(null);
      jest.spyOn(require('../service'), 'getTripById').mockImplementation(getTripByIdMock);

      await expect(generateIcs('nonexistent-id')).rejects.toThrow('Trip not found');
    });
  });

  describe('getOrCreateShareLink', () => {
    it('should return existing share link if exists', async () => {
      const mockShareLink = {
        id: 'share-123',
        tripId: 'trip-123',
        slug: 'abc123xyz',
        createdAt: new Date(),
      };

      (prisma.shareLink.findFirst as jest.Mock).mockResolvedValue(mockShareLink);

      const url = await getOrCreateShareLink('trip-123');

      expect(url).toContain('/t/abc123xyz');
      expect(prisma.shareLink.create).not.toHaveBeenCalled();
    });

    it('should create new share link if none exists', async () => {
      (prisma.shareLink.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.shareLink.create as jest.Mock).mockResolvedValue({
        id: 'share-123',
        tripId: 'trip-123',
        slug: 'newslug123',
        createdAt: new Date(),
      });

      const url = await getOrCreateShareLink('trip-123');

      expect(url).toContain('/t/newslug123');
      expect(prisma.shareLink.create).toHaveBeenCalledWith({
        data: {
          tripId: 'trip-123',
          slug: expect.any(String),
        },
      });
    });

    it('should generate cryptographically secure slug', async () => {
      (prisma.shareLink.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.shareLink.create as jest.Mock).mockImplementation((args) => {
        return Promise.resolve({
          id: 'share-123',
          tripId: args.data.tripId,
          slug: args.data.slug,
          createdAt: new Date(),
        });
      });

      await getOrCreateShareLink('trip-123');

      const createCall = (prisma.shareLink.create as jest.Mock).mock.calls[0][0];
      const slug = createCall.data.slug;

      expect(slug).toBeDefined();
      expect(slug.length).toBeGreaterThanOrEqual(12);
      expect(slug).toMatch(/^[A-Za-z0-9_-]+$/); // nanoid characters
    });
  });

  describe('bootstrapNotifications', () => {
    it('should create weather, headcount, and dress code notifications', async () => {
      const mockTrip = {
        id: 'trip-123',
        dateStart: new Date('2026-01-17T17:00:00.000Z'),
      };

      const getTripByIdMock = jest.fn().mockResolvedValue(mockTrip);
      jest.spyOn(require('../service'), 'getTripById').mockImplementation(getTripByIdMock);

      (prisma.notification.create as jest.Mock).mockResolvedValue({
        id: 'notif-123',
      });

      const notifications = await bootstrapNotifications('trip-123');

      expect(notifications).toHaveLength(3);
      expect(prisma.notification.create).toHaveBeenCalledTimes(3);

      // Verify weather check notification (48h before)
      const weatherCall = (prisma.notification.create as jest.Mock).mock.calls[0][0];
      expect(weatherCall.data.type).toBe('weather_check');
      expect(weatherCall.data.status).toBe('scheduled');

      // Verify headcount notification
      const headcountCall = (prisma.notification.create as jest.Mock).mock.calls[1][0];
      expect(headcountCall.data.type).toBe('headcount');

      // Verify dress code notification
      const dressCodeCall = (prisma.notification.create as jest.Mock).mock.calls[2][0];
      expect(dressCodeCall.data.type).toBe('dress_code');
    });
  });
});
