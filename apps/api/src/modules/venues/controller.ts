import { Request, Response } from 'express';
import { VenueService } from './service';
import { CreateVenueInput, UpdateVenueInput } from './types';

export class VenueController {
  private service: VenueService;

  constructor() {
    this.service = new VenueService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateVenueInput = req.body;
      const venue = await this.service.createVenue(data);
      res.status(201).json(venue);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create venue';
      res.status(400).json({ error: message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const venue = await this.service.getVenueById(id);
      res.json(venue);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Venue not found';
      res.status(404).json({ error: message });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const city = req.query.city as string | undefined;
      const venues = city
        ? await this.service.getVenuesByCity(city)
        : await this.service.getAllVenues();
      res.json(venues);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch venues';
      res.status(500).json({ error: message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data: UpdateVenueInput = req.body;
      const venue = await this.service.updateVenue(id, data);
      res.json(venue);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update venue';
      const status = message === 'Venue not found' ? 404 : 400;
      res.status(status).json({ error: message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.deleteVenue(id);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete venue';
      const status = message === 'Venue not found' ? 404 : 500;
      res.status(status).json({ error: message });
    }
  };
}
