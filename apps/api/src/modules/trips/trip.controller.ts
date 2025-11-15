import { asyncHandler } from '../../utils/asyncHandler';
import { createTripSchema, listTripsQuerySchema, tripIdParamSchema, updateTripSchema } from './trip.schema';
import * as tripService from './trip.service';

export const listTrips = asyncHandler(async (req, res) => {
  const query = listTripsQuerySchema.parse(req.query);
  const trips = await tripService.listTrips(query);
  res.json({ trips });
});

export const createTrip = asyncHandler(async (req, res) => {
  const payload = createTripSchema.parse(req.body);
  const trip = await tripService.createTrip(payload);
  res.status(201).json({ trip });
});

export const getTripDetails = asyncHandler(async (req, res) => {
  const { tripId } = tripIdParamSchema.parse(req.params);
  const trip = await tripService.getTripDetails(tripId);
  const { events, reservations, notifications, ...tripBase } = trip;
  const venues = events
    .map((event) => event.venue)
    .filter((venue): venue is NonNullable<typeof venue> => Boolean(venue));
  const uniqueVenues = Array.from(new Map(venues.map((venue) => [venue.id, venue])).values());

  res.json({
    trip: tripBase,
    events,
    venues: uniqueVenues,
    reservations,
    notifications
  });
});

export const updateTrip = asyncHandler(async (req, res) => {
  const { tripId } = tripIdParamSchema.parse(req.params);
  const payload = updateTripSchema.parse(req.body);
  const trip = await tripService.updateTrip(tripId, payload);
  res.json({ trip });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const { tripId } = tripIdParamSchema.parse(req.params);
  await tripService.deleteTrip(tripId);
  res.status(204).send();
});
