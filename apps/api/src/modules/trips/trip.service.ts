import type { Trip, Event, Venue, Reservation, Notification } from '@prisma/client';
import { AppError } from '../../utils/appError';
import { TripRepository } from './trip.repository';
import type { CreateTripInput, UpdateTripInput } from './trip.types';
import { UserRepository } from '../users/user.repository';

export type TripDetails = {
  trip: Trip;
  events: (Event & { venue: Venue | null; reservations: Reservation[] })[];
  venues: Venue[];
  reservations: Reservation[];
  notifications: Notification[];
};

export class TripService {
  static async createTrip(payload: CreateTripInput): Promise<Trip> {
    const user = await UserRepository.findById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    TripService.validateGroupSizes(payload.groupSizeMin, payload.groupSizeMax);

    return TripRepository.create({ ...payload });
  }

  static listTrips(): Promise<Trip[]> {
    return TripRepository.findMany();
  }

  static async getTripById(tripId: string): Promise<Trip> {
    const trip = await TripRepository.findById(tripId);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }
    return trip;
  }

  static async getTripDetails(tripId: string): Promise<TripDetails> {
    const trip = await TripRepository.findDetailed(tripId);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    const venuesMap = new Map<string, Venue>();
    trip.events.forEach((event) => {
      if (event.venue) {
        venuesMap.set(event.venue.id, event.venue);
      }
    });

    const { events, reservations, notifications, ...tripData } = trip;

    return {
      trip: tripData as Trip,
      events,
      venues: Array.from(venuesMap.values()),
      reservations,
      notifications
    };
  }

  static async updateTrip(tripId: string, payload: UpdateTripInput): Promise<Trip> {
    const existing = await this.getTripById(tripId);
    const nextMin = payload.groupSizeMin ?? existing.groupSizeMin;
    const nextMax = payload.groupSizeMax ?? existing.groupSizeMax;
    TripService.validateGroupSizes(nextMin, nextMax);
    return TripRepository.update(tripId, payload);
  }

  static async deleteTrip(tripId: string): Promise<void> {
    await this.getTripById(tripId);
    await TripRepository.delete(tripId);
  }

  private static validateGroupSizes(min: number, max: number) {
    if (min > max) {
      throw new AppError('groupSizeMin cannot be greater than groupSizeMax', 400);
    }
  }
}
