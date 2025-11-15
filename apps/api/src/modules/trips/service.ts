import { TripRepository } from './repository';
import { CreateTripInput, UpdateTripInput, TripResponse } from './types';
import { Trip } from '@prisma/client';

export class TripService {
  private repository: TripRepository;

  constructor() {
    this.repository = new TripRepository();
  }

  async createTrip(data: CreateTripInput): Promise<TripResponse> {
    const trip = await this.repository.create(data);
    return this.toResponse(trip);
  }

  async getTripById(id: string): Promise<any> {
    const trip = await this.repository.findById(id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Transform to include nested data
    return {
      id: trip.id,
      userId: trip.userId,
      title: trip.title,
      city: trip.city,
      dateStart: trip.dateStart,
      dateEnd: trip.dateEnd,
      groupSizeMin: trip.groupSizeMin,
      groupSizeMax: trip.groupSizeMax,
      occasion: trip.occasion,
      budgetLevel: trip.budgetLevel,
      status: trip.status,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
      events: trip.events.map((e) => ({
        id: e.id,
        tripId: e.tripId,
        venueId: e.venueId,
        orderIndex: e.orderIndex,
        type: e.type,
        title: e.title,
        description: e.description,
        startTime: e.startTime,
        endTime: e.endTime,
        isPrimary: e.isPrimary,
        venue: e.venue,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
      reservations: trip.reservations,
      notifications: trip.notifications,
      shareLinks: trip.shareLinks,
    };
  }

  async getTripsByUserId(userId: string): Promise<TripResponse[]> {
    const trips = await this.repository.findByUserId(userId);
    return trips.map((t) => this.toResponse(t));
  }

  async updateTrip(id: string, data: UpdateTripInput): Promise<TripResponse> {
    const trip = await this.repository.findById(id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    const updated = await this.repository.update(id, data);
    return this.toResponse(updated);
  }

  async deleteTrip(id: string): Promise<void> {
    const trip = await this.repository.findById(id);
    if (!trip) {
      throw new Error('Trip not found');
    }
    await this.repository.delete(id);
  }

  private toResponse(trip: Trip): TripResponse {
    return {
      id: trip.id,
      userId: trip.userId,
      title: trip.title,
      city: trip.city,
      dateStart: trip.dateStart,
      dateEnd: trip.dateEnd,
      groupSizeMin: trip.groupSizeMin,
      groupSizeMax: trip.groupSizeMax,
      occasion: trip.occasion,
      budgetLevel: trip.budgetLevel,
      status: trip.status,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }
}
