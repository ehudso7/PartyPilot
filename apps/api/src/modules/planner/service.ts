import { PlanTripInput, PlanTripResponse } from '../trips/types';
import { TripService } from '../trips/service';
import { EventService } from '../events/service';
import { VenueService } from '../venues/service';
import { CreateTripInput } from '../trips/types';
import { CreateEventInput } from '../events/types';

/**
 * Stub planner service that returns hard-coded trip data for Phase 1.
 * In Phase 2, this will be replaced with LLM-based planning.
 */
export class PlannerService {
  private tripService: TripService;
  private eventService: EventService;
  private venueService: VenueService;

  constructor() {
    this.tripService = new TripService();
    this.eventService = new EventService();
    this.venueService = new VenueService();
  }

  async planTrip(input: PlanTripInput): Promise<PlanTripResponse> {
    // For Phase 1, return a hard-coded simple trip
    // This will be replaced with LLM integration in Phase 2

    const now = new Date();
    const tripStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const tripEnd = new Date(tripStart.getTime() + 24 * 60 * 60 * 1000); // 1 day later

    // Create trip
    const tripData: CreateTripInput = {
      userId: input.userId,
      title: 'Sample Bachelor Party',
      city: 'NYC',
      dateStart: tripStart,
      dateEnd: tripEnd,
      groupSizeMin: 10,
      groupSizeMax: 15,
      occasion: 'bachelor',
      budgetLevel: 'medium',
      status: 'planned',
    };

    const trip = await this.tripService.createTrip(tripData);

    // Create sample venues (stub - will be replaced with real venue matching in Phase 2)
    const venue1 = await this.venueService.createVenue({
      name: 'Sample Italian Restaurant',
      address: '123 Main St, New York, NY 10001',
      city: 'NYC',
      bookingType: 'deeplink',
      bookingProvider: 'opentable',
      bookingUrl: 'https://www.opentable.com/restaurant/profile/12345',
      priceLevel: '$$',
      dressCodeSummary: 'Smart casual',
      groupFriendly: true,
    });

    const venue2 = await this.venueService.createVenue({
      name: 'Sample Games Bar',
      address: '456 Broadway, New York, NY 10002',
      city: 'NYC',
      bookingType: 'manual',
      phone: '+1-555-0123',
      priceLevel: '$$',
      dressCodeSummary: 'Casual',
      groupFriendly: true,
    });

    const venue3 = await this.venueService.createVenue({
      name: 'Sample Rooftop Bar',
      address: '789 Park Ave, New York, NY 10003',
      city: 'NYC',
      bookingType: 'webview_form',
      bookingUrl: 'https://example.com/book',
      priceLevel: '$$$',
      dressCodeSummary: 'Smart casual',
      groupFriendly: true,
    });

    // Create events
    const event1Start = new Date(tripStart);
    event1Start.setHours(18, 0, 0, 0); // 6 PM
    const event1End = new Date(event1Start);
    event1End.setHours(20, 30, 0, 0); // 8:30 PM

    const event2Start = new Date(event1End);
    event2Start.setHours(21, 0, 0, 0); // 9 PM
    const event2End = new Date(event2Start);
    event2End.setHours(23, 0, 0, 0); // 11 PM

    const event3Start = new Date(event2End);
    event3Start.setHours(23, 30, 0, 0); // 11:30 PM
    const event3End = new Date(event3Start);
    event3End.setHours(2, 0, 0, 0); // 2 AM next day

    const events: CreateEventInput[] = [
      {
        tripId: trip.id,
        venueId: venue1.id,
        orderIndex: 0,
        type: 'meal',
        title: 'Italian Dinner',
        description: 'Group dinner at Italian restaurant',
        startTime: event1Start,
        endTime: event1End,
        isPrimary: true,
      },
      {
        tripId: trip.id,
        venueId: venue2.id,
        orderIndex: 1,
        type: 'bar',
        title: 'Games Bar',
        description: 'Games and drinks',
        startTime: event2Start,
        endTime: event2End,
        isPrimary: true,
      },
      {
        tripId: trip.id,
        venueId: venue3.id,
        orderIndex: 2,
        type: 'bar',
        title: 'Rooftop Bar',
        description: 'Final stop at rooftop',
        startTime: event3Start,
        endTime: event3End,
        isPrimary: true,
      },
    ];

    const createdEvents = await this.eventService.createEvents(events);

    return {
      trip,
      events: createdEvents,
      venues: [venue1, venue2, venue3],
    };
  }
}
