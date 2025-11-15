import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { EventService } from './event.service';
import { createEventSchema, eventIdParamSchema, updateEventSchema } from './event.types';

export class EventController {
  static listByTrip = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.query.tripId;
    if (typeof tripId !== 'string') {
      return res.status(400).json({ message: 'tripId query param is required' });
    }
    const events = await EventService.listByTrip(tripId);
    res.json({ events });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const { body } = createEventSchema.parse({ body: req.body });
    const event = await EventService.createEvent(body);
    res.status(201).json({ event });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { params } = eventIdParamSchema.parse({ params: req.params });
    const event = await EventService.getEvent(params.eventId);
    res.json({ event });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { params, body } = updateEventSchema.parse({ params: req.params, body: req.body });
    const event = await EventService.updateEvent(params.eventId, body);
    res.json({ event });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { params } = eventIdParamSchema.parse({ params: req.params });
    await EventService.deleteEvent(params.eventId);
    res.status(204).send();
  });
}
