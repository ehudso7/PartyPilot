import type { Venue } from '@prisma/client';
import { AppError } from '../../utils/appError';
import { VenueRepository } from './venue.repository';
import type { CreateVenueInput, UpdateVenueInput } from './venue.types';

export class VenueService {
  static createVenue(payload: CreateVenueInput): Promise<Venue> {
    return VenueRepository.create(payload);
  }

  static listVenues(): Promise<Venue[]> {
    return VenueRepository.findMany();
  }

  static async getVenue(venueId: string): Promise<Venue> {
    const venue = await VenueRepository.findById(venueId);
    if (!venue) {
      throw new AppError('Venue not found', 404);
    }
    return venue;
  }

  static async updateVenue(venueId: string, payload: UpdateVenueInput): Promise<Venue> {
    await this.getVenue(venueId);
    return VenueRepository.update(venueId, payload);
  }

  static async deleteVenue(venueId: string): Promise<void> {
    await this.getVenue(venueId);
    await VenueRepository.delete(venueId);
  }
}
