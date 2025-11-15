import type { Event, Venue } from '@prisma/client';
import { AppError } from '../../utils/appError';
import { EventRepository } from './event.repository';
import type { CreateEventInput, UpdateEventInput } from './event.types';
import { TripRepository } from '../trips/trip.repository';
import { VenueRepository } from '../venues/venue.repository';

export class EventService {
  static async createEvent(payload: CreateEventInput): Promise<Event> {
    await EventService.ensureTripExists(payload.tripId);
    if (payload.venueId) {
      await EventService.ensureVenueExists(payload.venueId);
    }
    return EventRepository.create(payload);
  }

  static async getEvent(eventId: string): Promise<Event & { venue: Venue | null }> {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }
    return event;
  }

  static listByTrip(tripId: string) {
    return EventRepository.findByTrip(tripId);
  }

  static async updateEvent(eventId: string, payload: UpdateEventInput) {
    await EventService.getEvent(eventId);
    if (payload.venueId) {
      await EventService.ensureVenueExists(payload.venueId);
    }
    return EventRepository.update(eventId, payload);
  }

  static async deleteEvent(eventId: string) {
    await EventService.getEvent(eventId);
    await EventRepository.delete(eventId);
  }

  private static async ensureTripExists(tripId: string) {
    const trip = await TripRepository.findById(tripId);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }
  }

  private static async ensureVenueExists(venueId: string) {
    const venue = await VenueRepository.findById(venueId);
    if (!venue) {
      throw new AppError('Venue not found', 404);
    }
  }
}
