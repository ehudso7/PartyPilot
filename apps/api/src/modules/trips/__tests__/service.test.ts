import * as tripsService from '../service';
import * as plannerService from '../../planner/service';
import * as repository from '../repository';
import prisma from '../../../db/prismaClient';

jest.mock('../../planner/service');
jest.mock('../repository');
jest.mock('../../../db/prismaClient', () => ({
  __esModule: true,
  default: {
    event: {
      create: jest.fn(),
    },
  },
}));

describe('Trips Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('planTrip', () => {
    it('should create trip and events from prompt', async () => {
      const mockPlanData = {
        title: 'Test Trip',
        city: 'NYC',
        dateStart: '2026-01-17T00:00:00Z',
        dateEnd: '2026-01-17T23:59:59Z',
        groupSizeMin: 10,
        groupSizeMax: 15,
        occasion: 'bachelor',
        budgetLevel: 'medium',
        events: [
          {
            type: 'meal',
            title: 'Dinner',
            description: 'Italian dinner',
            startTime: '2026-01-17T18:00:00Z',
            endTime: '2026-01-17T20:00:00Z',
          },
        ],
      };

      const mockTrip = {
        id: 'trip-123',
        userId: 'user-123',
        ...mockPlanData,
        status: 'draft',
      };

      (plannerService.parsePlannerPrompt as jest.Mock).mockResolvedValue(mockPlanData);
      (repository.createTrip as jest.Mock).mockResolvedValue(mockTrip);
      (prisma.event.create as jest.Mock).mockResolvedValue({
        id: 'event-123',
        tripId: 'trip-123',
        ...mockPlanData.events[0],
      });

      const result = await tripsService.planTrip('Test prompt', 'user-123');

      expect(result.trip).toEqual(mockTrip);
      expect(result.events).toHaveLength(1);
      expect(plannerService.parsePlannerPrompt).toHaveBeenCalledWith('Test prompt');
      expect(repository.createTrip).toHaveBeenCalled();
    });
  });

  describe('getTripById', () => {
    it('should return trip with details', async () => {
      const mockTrip = {
        id: 'trip-123',
        userId: 'user-123',
        title: 'Test Trip',
        events: [],
        reservations: [],
        notifications: [],
        shareLinks: [],
      };

      (repository.getTripWithDetails as jest.Mock).mockResolvedValue(mockTrip);

      const result = await tripsService.getTripById('trip-123');

      expect(result).toEqual(mockTrip);
      expect(repository.getTripWithDetails).toHaveBeenCalledWith('trip-123');
    });
  });
});
