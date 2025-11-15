import { Request, Response } from 'express';
import { TripService } from './service';
import { CreateTripInput, UpdateTripInput } from './types';
import { PlannerService } from '../planner/service';
import { EventService } from '../events/service';

export class TripController {
  private service: TripService;
  private plannerService: PlannerService;
  private eventService: EventService;

  constructor() {
    this.service = new TripService();
    this.plannerService = new PlannerService();
    this.eventService = new EventService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateTripInput = req.body;
      const trip = await this.service.createTrip(data);
      res.status(201).json(trip);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create trip';
      res.status(400).json({ error: message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tripId } = req.params;
      const trip = await this.service.getTripByIdWithRelations(tripId);
      res.json(trip);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Trip not found';
      res.status(404).json({ error: message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tripId } = req.params;
      const data: UpdateTripInput = req.body;
      const trip = await this.service.updateTrip(tripId, data);
      res.json(trip);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update trip';
      const status = message === 'Trip not found' ? 404 : 400;
      res.status(status).json({ error: message });
    }
  };

  plan = async (req: Request, res: Response): Promise<void> => {
    try {
      const { prompt, userId } = req.body;

      if (!prompt || !userId) {
        res.status(400).json({ error: 'prompt and userId are required' });
        return;
      }

      // Call stub planner
      const planResult = await this.plannerService.planTrip({ prompt, userId });

      // Create trip in database
      const trip = await this.service.createTrip({
        userId,
        ...planResult.trip,
      });

      // Create events in database
      const createdEvents = await Promise.all(
        planResult.events.map((eventData) =>
          this.eventService.createEvent({
            tripId: trip.id,
            ...eventData,
          })
        )
      );

      // Get venues (empty for now, will be populated in Phase 2)
      const venues: any[] = [];

      res.status(201).json({
        trip,
        events: createdEvents,
        venues,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to plan trip';
      res.status(500).json({ error: message });
    }
  };
}
