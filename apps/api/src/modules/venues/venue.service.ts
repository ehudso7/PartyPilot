import type { Prisma } from '@prisma/client';
import { HttpError } from '../../utils/httpError';
import * as venueRepository from './venue.repository';
import type { CreateVenueInput, UpdateVenueInput, VenueQuery } from './venue.schema';

const toCreatePayload = (data: CreateVenueInput): Prisma.VenueCreateInput => ({
  name: data.name,
  address: data.address,
  city: data.city,
  lat: data.lat,
  lng: data.lng,
  bookingType: data.bookingType,
  bookingProvider: data.bookingProvider,
  bookingUrl: data.bookingUrl,
  phone: data.phone,
  website: data.website,
  rating: data.rating,
  priceLevel: data.priceLevel,
  dressCodeSummary: data.dressCodeSummary,
  groupFriendly: data.groupFriendly ?? true
});

const toUpdatePayload = (data: UpdateVenueInput): Prisma.VenueUpdateInput => ({
  name: data.name,
  address: data.address,
  city: data.city,
  lat: data.lat,
  lng: data.lng,
  bookingType: data.bookingType,
  bookingProvider: data.bookingProvider,
  bookingUrl: data.bookingUrl,
  phone: data.phone,
  website: data.website,
  rating: data.rating,
  priceLevel: data.priceLevel,
  dressCodeSummary: data.dressCodeSummary,
  groupFriendly: data.groupFriendly
});

export const listVenues = (query: VenueQuery) => venueRepository.findAll(query);

export const createVenue = (data: CreateVenueInput) => venueRepository.create(toCreatePayload(data));

export const getVenueById = async (venueId: string) => {
  const venue = await venueRepository.findById(venueId);
  if (!venue) {
    throw new HttpError(404, 'Venue not found');
  }
  return venue;
};

export const updateVenue = async (venueId: string, data: UpdateVenueInput) => {
  await getVenueById(venueId);
  return venueRepository.update(venueId, toUpdatePayload(data));
};

export const deleteVenue = async (venueId: string) => {
  await getVenueById(venueId);
  await venueRepository.remove(venueId);
};
