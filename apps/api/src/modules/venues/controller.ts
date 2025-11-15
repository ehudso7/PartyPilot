import { Request, Response, NextFunction } from 'express';
import { venueService } from './service';

export class VenueController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const venue = await venueService.createVenue(req.body);
      res.status(201).json(venue);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const venue = await venueService.getVenueById(req.params.id);
      res.json(venue);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const venue = await venueService.updateVenue(req.params.id, req.body);
      res.json(venue);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await venueService.deleteVenue(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, priceLevel, groupFriendly } = req.query;
      const venues = await venueService.listVenues({
        city: city as string,
        priceLevel: priceLevel as string,
        groupFriendly: groupFriendly === 'true',
      });
      res.json(venues);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, city } = req.query;
      if (!q) {
        res.status(400).json({ error: 'Query parameter "q" is required' });
        return;
      }
      const venues = await venueService.searchVenues(q as string, city as string);
      res.json(venues);
    } catch (error) {
      next(error);
    }
  }
}

export const venueController = new VenueController();
