import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { VenueService } from './venue.service';
import { createVenueSchema, updateVenueSchema, venueIdParamSchema } from './venue.types';

export class VenueController {
  static list = asyncHandler(async (_req: Request, res: Response) => {
    const venues = await VenueService.listVenues();
    res.json({ venues });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const { body } = createVenueSchema.parse({ body: req.body });
    const venue = await VenueService.createVenue(body);
    res.status(201).json({ venue });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { params } = venueIdParamSchema.parse({ params: req.params });
    const venue = await VenueService.getVenue(params.venueId);
    res.json({ venue });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { params, body } = updateVenueSchema.parse({ params: req.params, body: req.body });
    const venue = await VenueService.updateVenue(params.venueId, body);
    res.json({ venue });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { params } = venueIdParamSchema.parse({ params: req.params });
    await VenueService.deleteVenue(params.venueId);
    res.status(204).send();
  });
}
