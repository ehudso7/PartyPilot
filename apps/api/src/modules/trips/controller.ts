import { Request, Response } from 'express';
import { TripService } from './service';
import { PlannerService } from '../planner/service';
import { CreateTripInput, UpdateTripInput, PlanTripInput } from './types';

export class TripController {
  private service: TripService;
  private plannerService: PlannerService;

  constructor() {
    this.service = new TripService();
    this.plannerService = new PlannerService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateTripInput = req.body;
      const trip = await this.service.createTrip(data);
      res.status(201).json(trip);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create trip';
      res.status(400).json({ error: message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { tripId } = req.params;
      const trip = await this.service.getTripById(tripId);
      res.json(trip);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Trip not found';
      res.status(404).json({ error: message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { tripId } = req.params;
      const data: UpdateTripInput = req.body;
      const trip = await this.service.updateTrip(tripId, data);
      res.json(trip);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update trip';
      res.status(404).json({ error: message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { tripId } = req.params;
      await this.service.deleteTrip(tripId);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete trip';
      res.status(404).json({ error: message });
    }
  }

  async plan(req: Request, res: Response): Promise<void> {
    try {
      const input: PlanTripInput = req.body;

      if (!input.prompt || !input.userId) {
        res.status(400).json({ error: 'prompt and userId are required' });
        return;
      }

      const result = await this.plannerService.planTrip(input);
      res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to plan trip';
      res.status(500).json({ error: message });
    }
  }
}
