import { asyncHandler } from '../../utils/asyncHandler';
import { createVenueSchema, listVenuesQuerySchema, updateVenueSchema, venueIdParamSchema } from './venue.schema';
import * as venueService from './venue.service';

export const listVenues = asyncHandler(async (req, res) => {
  const query = listVenuesQuerySchema.parse(req.query);
  const venues = await venueService.listVenues(query);
  res.json({ venues });
});

export const createVenue = asyncHandler(async (req, res) => {
  const payload = createVenueSchema.parse(req.body);
  const venue = await venueService.createVenue(payload);
  res.status(201).json({ venue });
});

export const getVenueById = asyncHandler(async (req, res) => {
  const { venueId } = venueIdParamSchema.parse(req.params);
  const venue = await venueService.getVenueById(venueId);
  res.json({ venue });
});

export const updateVenue = asyncHandler(async (req, res) => {
  const { venueId } = venueIdParamSchema.parse(req.params);
  const payload = updateVenueSchema.parse(req.body);
  const venue = await venueService.updateVenue(venueId, payload);
  res.json({ venue });
});

export const deleteVenue = asyncHandler(async (req, res) => {
  const { venueId } = venueIdParamSchema.parse(req.params);
  await venueService.deleteVenue(venueId);
  res.status(204).send();
});
