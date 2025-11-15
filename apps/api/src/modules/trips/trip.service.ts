import type { Prisma } from '@prisma/client';
import { HttpError } from '../../utils/httpError';
import * as tripRepository from './trip.repository';
import type { CreateTripInput, TripQuery, UpdateTripInput } from './trip.schema';

const toCreatePayload = (data: CreateTripInput): Prisma.TripUncheckedCreateInput => ({
  userId: data.userId,
  title: data.title,
  city: data.city,
  dateStart: data.dateStart,
  dateEnd: data.dateEnd,
  groupSizeMin: data.groupSizeMin,
  groupSizeMax: data.groupSizeMax,
  occasion: data.occasion,
  budgetLevel: data.budgetLevel,
  status: data.status
});

const toUpdatePayload = (data: UpdateTripInput): Prisma.TripUncheckedUpdateInput => ({
  userId: data.userId,
  title: data.title,
  city: data.city,
  dateStart: data.dateStart,
  dateEnd: data.dateEnd,
  groupSizeMin: data.groupSizeMin,
  groupSizeMax: data.groupSizeMax,
  occasion: data.occasion,
  budgetLevel: data.budgetLevel,
  status: data.status
});

export const listTrips = (query: TripQuery) => tripRepository.findAll(query);

export const createTrip = (data: CreateTripInput) => tripRepository.create(toCreatePayload(data));

export const ensureTripExists = async (tripId: string) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    throw new HttpError(404, 'Trip not found');
  }
  return trip;
};

export const getTripDetails = async (tripId: string) => {
  const trip = await tripRepository.findDetailedById(tripId);
  if (!trip) {
    throw new HttpError(404, 'Trip not found');
  }
  return trip;
};

export const updateTrip = async (tripId: string, data: UpdateTripInput) => {
  await ensureTripExists(tripId);
  return tripRepository.update(tripId, toUpdatePayload(data));
};

export const deleteTrip = async (tripId: string) => {
  await ensureTripExists(tripId);
  await tripRepository.remove(tripId);
};
