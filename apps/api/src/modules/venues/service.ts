import { VenueRepository } from './repository';
import { CreateVenueInput, UpdateVenueInput, VenueResponse } from './types';

export class VenueService {
  private repository: VenueRepository;

  constructor() {
    this.repository = new VenueRepository();
  }

  async createVenue(data: CreateVenueInput): Promise<VenueResponse> {
    return this.repository.create(data);
  }

  async getVenueById(id: string): Promise<VenueResponse> {
    const venue = await this.repository.findById(id);
    if (!venue) {
      throw new Error('Venue not found');
    }
    return venue;
  }

  async getAllVenues(): Promise<VenueResponse[]> {
    return this.repository.findAll();
  }

  async getVenuesByCity(city: string): Promise<VenueResponse[]> {
    return this.repository.findByCity(city);
  }

  async updateVenue(id: string, data: UpdateVenueInput): Promise<VenueResponse> {
    await this.getVenueById(id); // Ensure venue exists
    return this.repository.update(id, data);
  }

  async deleteVenue(id: string): Promise<void> {
    await this.getVenueById(id); // Ensure venue exists
    await this.repository.delete(id);
  }
}
