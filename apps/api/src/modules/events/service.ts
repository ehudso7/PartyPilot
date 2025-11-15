import { EventRepository } from './repository';
import { CreateEventInput, UpdateEventInput, EventResponse } from './types';

export class EventService {
  private repository: EventRepository;

  constructor() {
    this.repository = new EventRepository();
  }

  async createEvent(data: CreateEventInput): Promise<EventResponse> {
    return this.repository.create(data);
  }

  async getEventById(id: string): Promise<EventResponse> {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }

  async getEventsByTripId(tripId: string): Promise<EventResponse[]> {
    return this.repository.findByTripId(tripId);
  }

  async updateEvent(id: string, data: UpdateEventInput): Promise<EventResponse> {
    await this.getEventById(id); // Ensure event exists
    return this.repository.update(id, data);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.getEventById(id); // Ensure event exists
    await this.repository.delete(id);
  }
}
