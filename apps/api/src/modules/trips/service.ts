import { tripRepository } from './repository';
import { CreateTripDTO, UpdateTripDTO, PlanTripRequest } from './types';
import { AppError } from '../../middleware/errorHandler';
import { plannerService } from '../planner/service';
import { eventService } from '../events/service';
import { venueService } from '../venues/service';
import { logger } from '../../config/logger';

export class TripService {
  async createTrip(data: CreateTripDTO) {
    return tripRepository.create(data);
  }

  async getTripById(id: string) {
    const trip = await tripRepository.findById(id);
    if (!trip) {
      throw new AppError(404, 'Trip not found');
    }
    return trip;
  }

  async getTripsByUserId(userId: string) {
    return tripRepository.findByUserId(userId);
  }

  async updateTrip(id: string, data: UpdateTripDTO) {
    await this.getTripById(id); // Ensure trip exists
    return tripRepository.update(id, data);
  }

  async deleteTrip(id: string) {
    await this.getTripById(id); // Ensure trip exists
    return tripRepository.delete(id);
  }

  async listTrips() {
    return tripRepository.list();
  }

  /**
   * Plan a trip from a natural language prompt
   * This is the main entry point for trip planning
   */
  async planTrip(request: PlanTripRequest) {
    logger.info('Planning trip from prompt', { userId: request.userId });

    // Step 1: Parse prompt and generate trip plan using planner
    const plan = await plannerService.planFromPrompt(request.prompt, request.userId);

    // Step 2: Create the trip in the database
    const trip = await this.createTrip({
      userId: request.userId,
      title: plan.title,
      city: plan.city,
      dateStart: new Date(plan.dateStart),
      dateEnd: new Date(plan.dateEnd),
      groupSizeMin: plan.groupSizeMin,
      groupSizeMax: plan.groupSizeMax,
      occasion: plan.occasion,
      budgetLevel: plan.budgetLevel,
      status: 'planned',
    });

    logger.info('Trip created', { tripId: trip.id });

    // Step 3: Create events for each planned event
    const createdEvents = await eventService.createManyEvents(
      plan.events.map((event, index) => ({
        tripId: trip.id,
        venueId: event.venueId,
        orderIndex: index,
        type: event.type,
        title: event.label,
        description: event.description,
        startTime: new Date(event.timeWindow.start),
        endTime: new Date(event.timeWindow.end),
        isPrimary: true,
      }))
    );

    logger.info('Events created', { count: createdEvents.length });

    // Step 4: Fetch all venues associated with the events
    const venueIds = createdEvents
      .map((e) => e.venueId)
      .filter((id): id is string => id !== null);
    const venues = await Promise.all(
      venueIds.map((id) => venueService.getVenueById(id))
    );

    logger.info('Trip planning complete', { tripId: trip.id });

    return {
      trip,
      events: createdEvents,
      venues,
    };
  }
}

export const tripService = new TripService();
