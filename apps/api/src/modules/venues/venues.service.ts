import type { Prisma, Venue } from '@prisma/client';

import { prisma } from '../../db/prismaClient';
import type { PlannerVenueInput } from '../planner/planner.types';

const buildKey = (venue: Pick<PlannerVenueInput, 'name' | 'address'>) =>
  `${venue.name.toLowerCase()}|${venue.address.toLowerCase()}`;

const upsertVenue = async (payload: PlannerVenueInput, tx?: Prisma.TransactionClient): Promise<Venue> => {
  const client = tx ?? prisma;
  return client.venue.upsert({
    where: {
      name_address: {
        name: payload.name,
        address: payload.address
      }
    },
    update: {
      city: payload.city,
      lat: payload.lat ?? null,
      lng: payload.lng ?? null,
      bookingType: payload.bookingType,
      bookingProvider: payload.bookingProvider ?? null,
      bookingUrl: payload.bookingUrl ?? null,
      phone: payload.phone ?? null,
      website: payload.website ?? null,
      rating: payload.rating ?? null,
      priceLevel: payload.priceLevel ?? null,
      dressCodeSummary: payload.dressCodeSummary ?? null,
      groupFriendly: payload.groupFriendly
    },
    create: {
      name: payload.name,
      address: payload.address,
      city: payload.city,
      lat: payload.lat ?? null,
      lng: payload.lng ?? null,
      bookingType: payload.bookingType,
      bookingProvider: payload.bookingProvider ?? null,
      bookingUrl: payload.bookingUrl ?? null,
      phone: payload.phone ?? null,
      website: payload.website ?? null,
      rating: payload.rating ?? null,
      priceLevel: payload.priceLevel ?? null,
      dressCodeSummary: payload.dressCodeSummary ?? null,
      groupFriendly: payload.groupFriendly
    }
  });
};

const bulkUpsert = async (venues: PlannerVenueInput[], tx?: Prisma.TransactionClient) => {
  const unique = new Map<string, PlannerVenueInput>();
  venues.forEach((venue) => {
    unique.set(buildKey(venue), venue);
  });
  const promises: Promise<Venue>[] = [];
  unique.forEach((venue) => {
    promises.push(upsertVenue(venue, tx));
  });
  return Promise.all(promises);
};

export const venuesService = {
  bulkUpsert,
  upsertVenue,
  buildKey
};
