import { TripPlan } from './types';
import { venueService } from '../venues/service';
import { logger } from '../../config/logger';
import { AppError } from '../../middleware/errorHandler';

export class PlannerService {
  /**
   * Plan a trip from a natural language prompt
   * Phase 1: Returns a hard-coded simple trip
   * Phase 2: Will use LLM to generate plan based on PLANNER_LOGIC.json
   */
  async planFromPrompt(prompt: string, userId: string): Promise<TripPlan> {
    logger.info('Planner: Processing prompt', { prompt, userId });

    // PHASE 1 STUB: Return a hard-coded trip for NYC
    // This will be replaced with LLM integration in Phase 2
    const plan = await this.generateStubPlan(prompt);

    // Match venues to events based on requirements
    await this.matchVenuesToEvents(plan);

    return plan;
  }

  /**
   * STUB: Generate a hard-coded trip plan
   * This simulates what the LLM will eventually do
   */
  private async generateStubPlan(prompt: string): Promise<TripPlan> {
    // Parse basic info from prompt (very simple extraction)
    const cityMatch = prompt.match(/in ([\w\s]+?)(?:,|\.|on|$)/i);
    const city = cityMatch ? cityMatch[1].trim() : 'NYC';

    const dateMatch = prompt.match(/on ([\w\s,]+?)(?:,|\.|$)/i);
    const dateStr = dateMatch ? dateMatch[1].trim() : 'Jan 17, 2026';

    // Parse date (simple heuristic)
    let tripDate: Date;
    try {
      tripDate = new Date(dateStr);
      if (isNaN(tripDate.getTime())) {
        // Default to 30 days from now
        tripDate = new Date();
        tripDate.setDate(tripDate.getDate() + 30);
      }
    } catch {
      tripDate = new Date();
      tripDate.setDate(tripDate.getDate() + 30);
    }

    const endDate = new Date(tripDate);
    endDate.setHours(23, 59, 59);

    // Extract group size
    const sizeMatch = prompt.match(/(\d+)\s*people/i);
    const groupSize = sizeMatch ? parseInt(sizeMatch[1], 10) : 10;

    // Extract occasion
    let occasion = 'other';
    if (prompt.match(/bachelor/i)) occasion = 'bachelor';
    else if (prompt.match(/birthday/i)) occasion = 'birthday';
    else if (prompt.match(/bar\s*crawl/i)) occasion = 'bar_crawl';

    // Extract budget
    let budgetLevel = 'medium';
    if (prompt.match(/cheap|budget|low/i)) budgetLevel = 'low';
    else if (prompt.match(/expensive|high|luxury|premium/i)) budgetLevel = 'high';

    logger.info('Generated stub plan', { city, date: tripDate, groupSize, occasion });

    // Generate events based on prompt keywords
    const events = [];
    let currentTime = new Date(tripDate);
    currentTime.setHours(17, 0, 0); // Start at 5 PM

    // Check for Italian dinner
    if (prompt.match(/italian|dinner/i)) {
      events.push({
        orderIndex: events.length,
        type: 'meal',
        label: 'Italian Dinner',
        description: 'Authentic Italian dining experience',
        timeWindow: {
          start: this.formatDateTime(currentTime),
          end: this.formatDateTime(this.addHours(currentTime, 2)),
        },
        primaryVenueRequirements: {
          tags: ['italian', 'dinner', 'restaurant'],
          groupFriendly: true,
          priceLevel: budgetLevel === 'high' ? '$$$' : '$$',
        },
      });
      currentTime = this.addHours(currentTime, 2.5);
    }

    // Check for games/bar
    if (prompt.match(/games|bar|arcade/i)) {
      events.push({
        orderIndex: events.length,
        type: 'bar',
        label: 'Games Bar',
        description: 'Bar with games and entertainment',
        timeWindow: {
          start: this.formatDateTime(currentTime),
          end: this.formatDateTime(this.addHours(currentTime, 2)),
        },
        primaryVenueRequirements: {
          tags: ['bar', 'games', 'entertainment'],
          groupFriendly: true,
          priceLevel: '$$',
        },
      });
      currentTime = this.addHours(currentTime, 2.5);
    }

    // Check for rooftop
    if (prompt.match(/rooftop/i)) {
      events.push({
        orderIndex: events.length,
        type: 'bar',
        label: 'Rooftop Bar',
        description: 'Rooftop bar with city views',
        timeWindow: {
          start: this.formatDateTime(currentTime),
          end: this.formatDateTime(this.addHours(currentTime, 2)),
        },
        primaryVenueRequirements: {
          tags: ['rooftop', 'bar', 'views'],
          groupFriendly: true,
          priceLevel: budgetLevel === 'high' ? '$$$' : '$$',
        },
      });
    }

    // If no events matched, create a default event
    if (events.length === 0) {
      events.push({
        orderIndex: 0,
        type: 'meetup',
        label: 'Group Meetup',
        description: 'Initial gathering point',
        timeWindow: {
          start: this.formatDateTime(currentTime),
          end: this.formatDateTime(this.addHours(currentTime, 1)),
        },
        primaryVenueRequirements: {
          groupFriendly: true,
        },
      });
    }

    return {
      title: `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} in ${city}`,
      city,
      dateStart: tripDate.toISOString(),
      dateEnd: endDate.toISOString(),
      groupSizeMin: Math.max(1, groupSize - 2),
      groupSizeMax: groupSize + 5,
      occasion,
      budgetLevel,
      events,
    };
  }

  /**
   * Match venues to events based on their requirements
   */
  private async matchVenuesToEvents(plan: TripPlan): Promise<void> {
    logger.info('Matching venues to events', { eventCount: plan.events.length });

    for (const event of plan.events) {
      try {
        const venues = await venueService.findMatchingVenues({
          city: plan.city,
          priceLevel: event.primaryVenueRequirements.priceLevel,
          groupFriendly: event.primaryVenueRequirements.groupFriendly,
        }, 1);

        if (venues.length > 0) {
          event.venueId = venues[0].id;
          logger.info('Matched venue to event', {
            eventLabel: event.label,
            venueId: event.venueId,
          });
        } else {
          logger.warn('No venue found for event', { eventLabel: event.label });
        }
      } catch (error) {
        logger.error('Error matching venue', {
          eventLabel: event.label,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  private addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  private formatDateTime(date: Date): string {
    return date.toISOString();
  }
}

export const plannerService = new PlannerService();
