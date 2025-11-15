import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { TripService } from './trip.service';
import { createTripSchema, tripIdParamSchema, updateTripSchema } from './trip.types';

export class TripController {
  static list = asyncHandler(async (_req: Request, res: Response) => {
    const trips = await TripService.listTrips();
    res.json({ trips });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const { body } = createTripSchema.parse({ body: req.body });
    const trip = await TripService.createTrip(body);
    res.status(201).json({ trip });
  });

  static getDetails = asyncHandler(async (req: Request, res: Response) => {
    const { params } = tripIdParamSchema.parse({ params: req.params });
    const data = await TripService.getTripDetails(params.tripId);
    res.json(data);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { params, body } = updateTripSchema.parse({ params: req.params, body: req.body });
    const trip = await TripService.updateTrip(params.tripId, body);
    res.json({ trip });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { params } = tripIdParamSchema.parse({ params: req.params });
    await TripService.deleteTrip(params.tripId);
    res.status(204).send();
  });
}
