import type { Event, Trip, Venue } from '@prisma/client';

import { prisma } from '../../db/prismaClient';
import { HttpError } from '../../lib/httpError';
import { plannerService } from '../planner/planner.service';
import { userService } from '../users/users.service';
import { venuesService } from '../venues/venues.service';
import type { PlanTripInput } from './trips.schema';

export interface TripPlanResult {
  trip: Trip;
  events: (Event & { venue: Venue | null })[];
  venues: Venue[];
}

const planTrip = async (payload: PlanTripInput): Promise<TripPlanResult> => {
  const user = await userService.getUserById(payload.userId);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const overrides = {
    city: payload.city,
    dateStart: payload.dateStart ? new Date(payload.dateStart) : undefined,
    dateEnd: payload.dateEnd ? new Date(payload.dateEnd) : undefined,
    groupSizeMin: payload.groupSizeMin,
    groupSizeMax: payload.groupSizeMax,
    occasion: payload.occasion,
    budgetLevel: payload.budgetLevel
  };

  const plan = plannerService.generatePlan(payload.prompt, overrides);

  const venueInputs = plan.events.flatMap((event) => (event.venue ? [event.venue] : []));
  const venues = venueInputs.length ? await venuesService.bulkUpsert(venueInputs) : [];

  const venueMap = new Map<string, Venue>();
  venues.forEach((venue) => {
    venueMap.set(venuesService.buildKey({ name: venue.name, address: venue.address }), venue);
  });

  const result = await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.create({
      data: {
        userId: user.id,
        title: plan.trip.title,
        city: plan.trip.city,
        dateStart: plan.trip.dateStart,
        dateEnd: plan.trip.dateEnd,
        groupSizeMin: plan.trip.groupSizeMin,
        groupSizeMax: plan.trip.groupSizeMax,
        occasion: plan.trip.occasion,
        budgetLevel: plan.trip.budgetLevel,
        status: 'planned'
      }
    });

    const events = await Promise.all(
      plan.events.map((event, idx) => {
        const venueKey = event.venue
          ? venuesService.buildKey({ name: event.venue.name, address: event.venue.address })
          : undefined;
        const venueId = venueKey ? venueMap.get(venueKey)?.id ?? null : null;
        return tx.event.create({
          data: {
            tripId: trip.id,
            orderIndex: idx,
            type: event.type,
            title: event.title,
            description: event.description ?? null,
            startTime: event.startTime,
            endTime: event.endTime,
            isPrimary: event.isPrimary,
            venueId
          },
          include: {
            venue: true
          }
        });
      })
    );

    return { trip, events };
  });

  return {
    trip: result.trip,
    events: result.events,
    venues
  };
};

const getTripWithDetails = async (tripId: string) => {
  return prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      user: true,
      events: {
        orderBy: { orderIndex: 'asc' },
        include: {
          venue: true,
          reservations: true
        }
      },
      reservations: true,
      notifications: true,
      shareLinks: true
    }
  });
};

export const tripsService = {
  planTrip,
  getTripWithDetails
};
