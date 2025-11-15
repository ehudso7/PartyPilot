import type { Prisma, Venue } from '@prisma/client';
import { prisma } from '../../db/prismaClient';
import { HttpError } from '../../utils/httpError';
import { PlanTripInput } from './planner.schema';

const HOURS = 60 * 60 * 1000;

type VenueSeed = Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>;

type StubEventDefinition = {
  orderIndex: number;
  type: string;
  title: string;
  description: string;
  startOffsetHours: number;
  durationHours: number;
  venue: VenueSeed;
};

type StubPlan = {
  title: string;
  city: string;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  events: StubEventDefinition[];
};

const buildStubPlan = (prompt: string): StubPlan => {
  const baseTitle = prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt;
  const title = `Plan • ${baseTitle}`;

  const venueBase: Omit<VenueSeed, 'name' | 'address' | 'bookingType'> = {
    city: 'New York City',
    lat: null,
    lng: null,
    bookingProvider: null,
    bookingUrl: null,
    phone: null,
    website: null,
    rating: null,
    priceLevel: '$$' as const,
    dressCodeSummary: 'Smart casual',
    groupFriendly: true
  };

  return {
    title: `PartyPilot Night Out – ${title}`,
    city: 'New York City',
    groupSizeMin: 10,
    groupSizeMax: 14,
    occasion: 'celebration',
    budgetLevel: 'medium',
    events: [
      {
        orderIndex: 0,
        type: 'meetup',
        title: 'Welcome Cocktails',
        description: 'Gather the group with light bites and a custom welcome drink.',
        startOffsetHours: 0,
        durationHours: 1.5,
        venue: {
          ...venueBase,
          name: 'Beacon Lounge',
          address: '123 Hudson Blvd, New York, NY 10001',
          bookingType: 'deeplink',
          bookingUrl: 'https://example.com/book/beacon-lounge'
        } satisfies VenueSeed
      },
      {
        orderIndex: 1,
        type: 'meal',
        title: 'Italian Dinner',
        description: 'Family-style pasta and mains with a paired wine flight.',
        startOffsetHours: 1.5,
        durationHours: 2,
        venue: {
          ...venueBase,
          name: 'Da Andrea Trattoria',
          address: '35 W 13th St, New York, NY 10011',
          bookingType: 'manual',
          phone: '+1-212-555-0199'
        } satisfies VenueSeed
      },
      {
        orderIndex: 2,
        type: 'bar',
        title: 'Games Bar + Karaoke',
        description: 'Arcade classics, duckpin bowling, and a private karaoke room.',
        startOffsetHours: 3.75,
        durationHours: 2,
        venue: {
          ...venueBase,
          name: 'The Ace Playhouse',
          address: '75 Varick St, New York, NY 10013',
          bookingType: 'api',
          bookingProvider: 'opentable'
        } satisfies VenueSeed
      },
      {
        orderIndex: 3,
        type: 'club',
        title: 'Rooftop Nightcap',
        description: 'Skyline views with reserved lounge seating and DJ set.',
        startOffsetHours: 6,
        durationHours: 1.5,
        venue: {
          ...venueBase,
          name: 'Skyline 230',
          address: '230 5th Ave, New York, NY 10001',
          bookingType: 'webview_form',
          website: 'https://230-fifth.com/reservations'
        } satisfies VenueSeed
      }
    ]
  };
};

type PlannerEventPayload = Omit<Prisma.EventUncheckedCreateInput, 'tripId' | 'venueId'>;

const materializeEventDefinition = (
  baseStart: Date,
  definition: StubEventDefinition
): PlannerEventPayload => {
  const startTime = new Date(baseStart.getTime() + definition.startOffsetHours * HOURS);
  const endTime = new Date(startTime.getTime() + definition.durationHours * HOURS);
  return {
    orderIndex: definition.orderIndex,
    type: definition.type,
    title: definition.title,
    description: definition.description,
    startTime,
    endTime,
    isPrimary: true
  };
};

export const planTripFromPrompt = async ({ prompt, userId }: PlanTripInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const plan = buildStubPlan(prompt);
  const baseStart = new Date();
  baseStart.setDate(baseStart.getDate() + 7);
  baseStart.setHours(17, 0, 0, 0);

  type EventWithVenue = Prisma.EventGetPayload<{ include: { venue: true } }>;

  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.create({
      data: {
        userId,
        title: plan.title,
        city: plan.city,
        dateStart: baseStart,
        dateEnd: new Date(baseStart.getTime() + 8 * HOURS),
        groupSizeMin: plan.groupSizeMin,
        groupSizeMax: plan.groupSizeMax,
        occasion: plan.occasion,
        budgetLevel: plan.budgetLevel,
        status: 'planned'
      }
    });

    const createdEvents: EventWithVenue[] = [];
    const createdVenues: Venue[] = [];

    for (const definition of plan.events) {
      const venue = await tx.venue.create({
        data: {
          name: definition.venue.name,
          address: definition.venue.address,
          city: definition.venue.city,
          lat: definition.venue.lat,
          lng: definition.venue.lng,
          bookingType: definition.venue.bookingType,
          bookingProvider: definition.venue.bookingProvider,
          bookingUrl: definition.venue.bookingUrl,
          phone: definition.venue.phone,
          website: definition.venue.website,
          rating: definition.venue.rating,
          priceLevel: definition.venue.priceLevel,
          dressCodeSummary: definition.venue.dressCodeSummary,
          groupFriendly: definition.venue.groupFriendly
        }
      });

      const eventPayload = materializeEventDefinition(baseStart, definition);
      const event = await tx.event.create({
        data: {
          ...eventPayload,
          tripId: trip.id,
          venueId: venue.id
        },
        include: { venue: true }
      });

      createdEvents.push(event);
      createdVenues.push(venue);
    }

    return { trip, events: createdEvents, venues: createdVenues };
  });
};
