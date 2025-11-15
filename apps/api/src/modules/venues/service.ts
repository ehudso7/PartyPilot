import { venueRepository } from './repository';
import { CreateVenueDTO, UpdateVenueDTO, VenueSearchCriteria } from './types';
import { AppError } from '../../middleware/errorHandler';

export class VenueService {
  async createVenue(data: CreateVenueDTO) {
    return venueRepository.create(data);
  }

  async getVenueById(id: string) {
    const venue = await venueRepository.findById(id);
    if (!venue) {
      throw new AppError(404, 'Venue not found');
    }
    return venue;
  }

  async updateVenue(id: string, data: UpdateVenueDTO) {
    await this.getVenueById(id); // Ensure venue exists
    return venueRepository.update(id, data);
  }

  async deleteVenue(id: string) {
    await this.getVenueById(id); // Ensure venue exists
    return venueRepository.delete(id);
  }

  async listVenues(criteria?: VenueSearchCriteria) {
    return venueRepository.list(criteria);
  }

  async searchVenues(query: string, city?: string) {
    return venueRepository.search(query, city);
  }

  /**
   * Find venues matching event requirements
   * This is used by the planner to match venues to events
   */
  async findMatchingVenues(requirements: VenueSearchCriteria, limit = 3) {
    const venues = await venueRepository.list(requirements);
    return venues.slice(0, limit);
  }
}

export const venueService = new VenueService();
