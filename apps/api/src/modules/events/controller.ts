import { Request, Response } from 'express';
import { EventService } from './service';
import { CreateEventInput, UpdateEventInput } from './types';

export class EventController {
  private service: EventService;

  constructor() {
    this.service = new EventService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateEventInput = req.body;
      const event = await this.service.createEvent(data);
      res.status(201).json(event);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create event';
      res.status(400).json({ error: message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await this.service.getEventById(id);
      res.json(event);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Event not found';
      res.status(404).json({ error: message });
    }
  }

  async getByTripId(req: Request, res: Response): Promise<void> {
    try {
      const { tripId } = req.params;
      const events = await this.service.getEventsByTripId(tripId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateEventInput = req.body;
      const event = await this.service.updateEvent(id, data);
      res.json(event);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update event';
      res.status(404).json({ error: message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.deleteEvent(id);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete event';
      res.status(404).json({ error: message });
    }
  }
}
