import { PlanTripInput, PlanTripOutput } from './types';

/**
 * Stub planner service for Phase 1.
 * Returns a hard-coded simple trip structure.
 * In Phase 2, this will be replaced with LLM integration.
 */
export class PlannerService {
  /**
   * Stub planner that returns a hard-coded trip for testing.
   * This will be replaced with actual LLM integration in Phase 2.
   */
  async planTrip(input: PlanTripInput): Promise<PlanTripOutput> {
    // Hard-coded example trip for Phase 1
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(17, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 0, 0, 0);

    return {
      trip: {
        title: 'NYC Bachelor Party',
        city: 'New York',
        dateStart: tomorrow.toISOString(),
        dateEnd: tomorrowEnd.toISOString(),
        groupSizeMin: 10,
        groupSizeMax: 15,
        occasion: 'bachelor',
        budgetLevel: 'medium',
      },
      events: [
        {
          orderIndex: 0,
          type: 'meal',
          title: 'Italian Dinner',
          description: 'Group dinner at Italian restaurant',
          startTime: new Date(tomorrow.getTime() + 30 * 60 * 1000).toISOString(), // 5:30 PM
          endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 7:30 PM
          isPrimary: true,
        },
        {
          orderIndex: 1,
          type: 'bar',
          title: 'Games Bar',
          description: 'Bar with games and drinks',
          startTime: new Date(tomorrow.getTime() + 2.5 * 60 * 60 * 1000).toISOString(), // 7:30 PM
          endTime: new Date(tomorrow.getTime() + 4.5 * 60 * 60 * 1000).toISOString(), // 9:30 PM
          isPrimary: true,
        },
        {
          orderIndex: 2,
          type: 'bar',
          title: 'Rooftop Bar',
          description: 'Rooftop bar with views',
          startTime: new Date(tomorrow.getTime() + 5 * 60 * 60 * 1000).toISOString(), // 10:00 PM
          endTime: new Date(tomorrow.getTime() + 7 * 60 * 60 * 1000).toISOString(), // 12:00 AM
          isPrimary: true,
        },
      ],
    };
  }
}
