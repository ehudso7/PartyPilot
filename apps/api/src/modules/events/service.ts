import { eventRepository } from './repository';
import { CreateEventDTO, UpdateEventDTO } from './types';
import { AppError } from '../../middleware/errorHandler';

export class EventService {
  async createEvent(data: CreateEventDTO) {
    return eventRepository.create(data);
  }

  async getEventById(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new AppError(404, 'Event not found');
    }
    return event;
  }

  async getEventsByTripId(tripId: string) {
    return eventRepository.findByTripId(tripId);
  }

  async updateEvent(id: string, data: UpdateEventDTO) {
    await this.getEventById(id); // Ensure event exists
    return eventRepository.update(id, data);
  }

  async deleteEvent(id: string) {
    await this.getEventById(id); // Ensure event exists
    return eventRepository.delete(id);
  }

  async createManyEvents(events: CreateEventDTO[]) {
    return eventRepository.createMany(events);
  }
}

export const eventService = new EventService();
