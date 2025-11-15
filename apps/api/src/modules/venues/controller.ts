import { Request, Response } from 'express';
import { VenueService } from './service';
import { CreateVenueInput, UpdateVenueInput } from './types';

export class VenueController {
  private service: VenueService;

  constructor() {
    this.service = new VenueService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateVenueInput = req.body;
      const venue = await this.service.createVenue(data);
      res.status(201).json(venue);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create venue';
      res.status(400).json({ error: message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const venue = await this.service.getVenueById(id);
      res.json(venue);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Venue not found';
      res.status(404).json({ error: message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateVenueInput = req.body;
      const venue = await this.service.updateVenue(id, data);
      res.json(venue);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update venue';
      res.status(404).json({ error: message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.deleteVenue(id);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete venue';
      res.status(404).json({ error: message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const venues = await this.service.getAllVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch venues' });
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const criteria = req.query as any;
      const venues = await this.service.searchVenues(criteria);
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search venues' });
    }
  }
}
