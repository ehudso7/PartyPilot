import { TripRepository } from './repository';
import { CreateTripInput, UpdateTripInput, TripResponse, TripWithRelationsResponse } from './types';

export class TripService {
  private repository: TripRepository;

  constructor() {
    this.repository = new TripRepository();
  }

  async createTrip(data: CreateTripInput): Promise<TripResponse> {
    return this.repository.create(data);
  }

  async getTripById(id: string): Promise<TripResponse> {
    const trip = await this.repository.findById(id);
    if (!trip) {
      throw new Error('Trip not found');
    }
    return trip;
  }

  async getTripByIdWithRelations(id: string): Promise<TripWithRelationsResponse> {
    const trip = await this.repository.findByIdWithRelations(id);
    if (!trip) {
      throw new Error('Trip not found');
    }
    
    // Extract unique venues from events
    const venues = trip.events
      .map((e) => e.venue)
      .filter((v): v is NonNullable<typeof v> => v !== null);
    const uniqueVenues = Array.from(
      new Map(venues.map((v) => [v.id, v])).values()
    );

    return {
      ...trip,
      venues: uniqueVenues,
    };
  }

  async getTripsByUserId(userId: string): Promise<TripResponse[]> {
    return this.repository.findByUserId(userId);
  }

  async updateTrip(id: string, data: UpdateTripInput): Promise<TripResponse> {
    await this.getTripById(id); // Ensure trip exists
    return this.repository.update(id, data);
  }

  async deleteTrip(id: string): Promise<void> {
    await this.getTripById(id); // Ensure trip exists
    await this.repository.delete(id);
  }
}
