import * as reservationsService from '../service';
import prisma from '../../../db/prismaClient';

jest.mock('../../../db/prismaClient', () => ({
  __esModule: true,
  default: {
    event: {
      findUnique: jest.fn(),
    },
    reservation: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Reservations Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('prepareReservations', () => {
    it('should create reservations for events', async () => {
      const mockEvent = {
        id: 'event-123',
        startTime: new Date('2026-01-17T18:00:00Z'),
        venue: {
          id: 'venue-123',
          bookingType: 'deeplink',
          bookingProvider: 'opentable',
          bookingUrl: 'https://opentable.com/book',
        },
        trip: {
          groupSizeMax: 15,
        },
      };

      const mockReservation = {
        id: 'reservation-123',
        tripId: 'trip-123',
        eventId: 'event-123',
        venueId: 'venue-123',
        method: 'deeplink',
        status: 'link_ready',
      };

      (prisma.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);
      (prisma.reservation.create as jest.Mock).mockResolvedValue(mockReservation);

      const result = await reservationsService.prepareReservations('trip-123', ['event-123']);

      expect(result).toHaveLength(1);
      expect(result[0].bookingUrl).toContain('opentable.com');
      expect(prisma.reservation.create).toHaveBeenCalled();
    });

    it('should skip events without venues', async () => {
      (prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id: 'event-123',
        venue: null,
      });

      const result = await reservationsService.prepareReservations('trip-123', ['event-123']);

      expect(result).toHaveLength(0);
      expect(prisma.reservation.create).not.toHaveBeenCalled();
    });
  });

  describe('bookReservation', () => {
    it('should book API method reservation', async () => {
      const mockReservation = {
        id: 'reservation-123',
        method: 'api',
        bookingProvider: 'opentable',
      };

      const mockUpdated = {
        ...mockReservation,
        status: 'confirmed',
        providerReservationId: 'MOCK-123',
      };

      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(mockReservation);
      (prisma.reservation.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await reservationsService.bookReservation('reservation-123');

      expect(result.status).toBe('confirmed');
      expect(prisma.reservation.update).toHaveBeenCalled();
    });

    it('should throw error for non-API method', async () => {
      const mockReservation = {
        id: 'reservation-123',
        method: 'deeplink',
      };

      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(mockReservation);

      await expect(
        reservationsService.bookReservation('reservation-123')
      ).rejects.toThrow('Only API method reservations can be booked this way');
    });
  });
});
