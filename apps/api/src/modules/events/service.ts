import { EventRepository } from './repository';
import { CreateEventInput, UpdateEventInput, EventResponse } from './types';
import { Event } from '@prisma/client';

export class EventService {
  private repository: EventRepository;

  constructor() {
    this.repository = new EventRepository();
  }

  async createEvent(data: CreateEventInput): Promise<EventResponse> {
    const event = await this.repository.create(data);
    return this.toResponse(event);
  }

  async getEventById(id: string): Promise<EventResponse> {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    return this.toResponse(event);
  }

  async getEventsByTripId(tripId: string): Promise<EventResponse[]> {
    const events = await this.repository.findByTripId(tripId);
    return events.map((e) => this.toResponse(e));
  }

  async updateEvent(id: string, data: UpdateEventInput): Promise<EventResponse> {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    const updated = await this.repository.update(id, data);
    return this.toResponse(updated);
  }

  async deleteEvent(id: string): Promise<void> {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    await this.repository.delete(id);
  }

  async createEvents(events: CreateEventInput[]): Promise<EventResponse[]> {
    const created = await this.repository.createMany(events);
    return created.map((e) => this.toResponse(e));
  }

  private toResponse(event: Event): EventResponse {
    return {
      id: event.id,
      tripId: event.tripId,
      venueId: event.venueId,
      orderIndex: event.orderIndex,
      type: event.type,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      isPrimary: event.isPrimary,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}
