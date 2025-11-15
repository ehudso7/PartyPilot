import { Request, Response, NextFunction } from 'express';
import { eventService } from './service';

export class EventController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.getEventById(req.params.id);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();
