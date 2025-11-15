import { Request, Response, NextFunction } from 'express';
import { tripService } from './service';

export class TripController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const trip = await tripService.createTrip(req.body);
      res.status(201).json(trip);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const trip = await tripService.getTripById(req.params.id);
      res.json(trip);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const trip = await tripService.updateTrip(req.params.id, req.body);
      res.json(trip);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await tripService.deleteTrip(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const trips = await tripService.listTrips();
      res.json(trips);
    } catch (error) {
      next(error);
    }
  }

  async plan(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt, userId } = req.body;

      if (!prompt || !userId) {
        res.status(400).json({ error: 'prompt and userId are required' });
        return;
      }

      const result = await tripService.planTrip({ prompt, userId });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const trip = await tripService.getTripById(req.params.id);
      res.json(trip.events || []);
    } catch (error) {
      next(error);
    }
  }
}

export const tripController = new TripController();
