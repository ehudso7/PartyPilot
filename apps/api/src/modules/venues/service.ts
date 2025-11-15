import { VenueRepository } from './repository';
import { CreateVenueInput, UpdateVenueInput, VenueResponse, VenueSearchCriteria } from './types';
import { Venue } from '@prisma/client';

export class VenueService {
  private repository: VenueRepository;

  constructor() {
    this.repository = new VenueRepository();
  }

  async createVenue(data: CreateVenueInput): Promise<VenueResponse> {
    const venue = await this.repository.create(data);
    return this.toResponse(venue);
  }

  async getVenueById(id: string): Promise<VenueResponse> {
    const venue = await this.repository.findById(id);
    if (!venue) {
      throw new Error('Venue not found');
    }
    return this.toResponse(venue);
  }

  async updateVenue(id: string, data: UpdateVenueInput): Promise<VenueResponse> {
    const venue = await this.repository.findById(id);
    if (!venue) {
      throw new Error('Venue not found');
    }

    const updated = await this.repository.update(id, data);
    return this.toResponse(updated);
  }

  async deleteVenue(id: string): Promise<void> {
    const venue = await this.repository.findById(id);
    if (!venue) {
      throw new Error('Venue not found');
    }
    await this.repository.delete(id);
  }

  async getAllVenues(): Promise<VenueResponse[]> {
    const venues = await this.repository.findAll();
    return venues.map((v) => this.toResponse(v));
  }

  async searchVenues(criteria: VenueSearchCriteria): Promise<VenueResponse[]> {
    const venues = await this.repository.search(criteria);
    return venues.map((v) => this.toResponse(v));
  }

  private toResponse(venue: Venue): VenueResponse {
    return {
      id: venue.id,
      name: venue.name,
      address: venue.address,
      city: venue.city,
      lat: venue.lat,
      lng: venue.lng,
      bookingType: venue.bookingType,
      bookingProvider: venue.bookingProvider,
      bookingUrl: venue.bookingUrl,
      phone: venue.phone,
      website: venue.website,
      rating: venue.rating,
      priceLevel: venue.priceLevel,
      dressCodeSummary: venue.dressCodeSummary,
      groupFriendly: venue.groupFriendly,
      createdAt: venue.createdAt,
      updatedAt: venue.updatedAt,
    };
  }
}
