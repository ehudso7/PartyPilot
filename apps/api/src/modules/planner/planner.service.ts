import type { Event, Trip, Venue, PrismaClient } from '@prisma/client';
import { prisma } from '../../db/prismaClient';
import { AppError } from '../../utils/appError';
import { UserRepository } from '../users/user.repository';
import type { PlanTripInput, StubTripPlan, StubEventPlan } from './planner.types';

export type PlannerResult = {
  trip: Trip;
  events: Event[];
  venues: Venue[];
};

export class PlannerService {
  static async planTrip(input: PlanTripInput): Promise<PlannerResult> {
    const user = await UserRepository.findById(input.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const stubPlan = PlannerService.generateStubPlan(input.prompt);

    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          userId: input.userId,
          title: stubPlan.title,
          city: stubPlan.city,
          dateStart: stubPlan.dateStart,
          dateEnd: stubPlan.dateEnd,
          groupSizeMin: stubPlan.groupSizeMin,
          groupSizeMax: stubPlan.groupSizeMax,
          occasion: stubPlan.occasion,
          budgetLevel: stubPlan.budgetLevel,
          status: 'planned'
        }
      });

      const createdVenues: Venue[] = [];
      const createdEvents: Event[] = [];

      for (const eventPlan of stubPlan.events) {
        const venue = await PlannerService.findOrCreateVenue(tx, eventPlan);
        createdVenues.push(venue);

        const event = await tx.event.create({
          data: {
            tripId: trip.id,
            venueId: venue.id,
            orderIndex: eventPlan.orderIndex,
            type: eventPlan.type,
            title: eventPlan.title,
            description: eventPlan.description,
            startTime: eventPlan.startTime,
            endTime: eventPlan.endTime,
            isPrimary: true
          }
        });

        createdEvents.push(event);
      }

      return { trip, events: createdEvents, venues: createdVenues };
    });
  }

  private static async findOrCreateVenue(tx: Pick<PrismaClient, 'venue'>, eventPlan: StubEventPlan): Promise<Venue> {
    const existing = await tx.venue.findFirst({
      where: {
        name: eventPlan.venue.name,
        city: eventPlan.venue.city
      }
    });

    if (existing) {
      return existing;
    }

    return tx.venue.create({
      data: {
        name: eventPlan.venue.name,
        address: eventPlan.venue.address,
        city: eventPlan.venue.city,
        bookingType: eventPlan.venue.bookingType,
        bookingProvider: eventPlan.venue.bookingProvider ?? null,
        bookingUrl: eventPlan.venue.bookingUrl ?? null,
        phone: eventPlan.venue.phone ?? null,
        website: eventPlan.venue.website ?? null,
        rating: eventPlan.venue.rating ?? null,
        priceLevel: eventPlan.venue.priceLevel ?? null,
        dressCodeSummary: eventPlan.venue.dressCodeSummary ?? null,
        groupFriendly: true
      }
    });
  }

  private static generateStubPlan(prompt: string): StubTripPlan {
    const city = PlannerService.inferCity(prompt);
    const occasion = PlannerService.inferOccasion(prompt);
    const budgetLevel = PlannerService.inferBudget(prompt);
    const groupSize = PlannerService.inferGroupSize(prompt);

    const startDate = PlannerService.upcomingWeekendDate();
    const startTime = new Date(startDate.setHours(16, 0, 0, 0));

    const events: StubEventPlan[] = [];

    events.push({
      orderIndex: 0,
      type: 'meetup',
      title: 'Welcome Drinks & Meetup',
      description: 'Kick things off with skyline views and light bites.',
      startTime,
      endTime: new Date(startTime.getTime() + 90 * 60 * 1000),
      venue: {
        name: "Ophelia Lounge",
        address: '3 Mitchell Pl, New York, NY 10017',
        city,
        bookingType: 'deeplink',
        bookingProvider: 'opentable',
        bookingUrl: 'https://www.opentable.com/r/ophelia-new-york',
        phone: '+1 212-980-4796',
        website: 'https://opheliany.com',
        priceLevel: '$$$',
        rating: 4.6,
        dressCodeSummary: 'Smart casual'
      }
    });

    const dinnerStart = new Date(events[0].endTime.getTime() + 30 * 60 * 1000);

    events.push({
      orderIndex: 1,
      type: 'meal',
      title: 'Italian Dinner Feast',
      description: 'Shared plates, pasta, and celebratory toasts.',
      startTime: dinnerStart,
      endTime: new Date(dinnerStart.getTime() + 2 * 60 * 60 * 1000),
      venue: {
        name: 'Lilia',
        address: '567 Union Ave, Brooklyn, NY 11211',
        city,
        bookingType: 'manual',
        bookingProvider: null,
        bookingUrl: 'https://www.lilianewyork.com',
        phone: '+1 718-576-3095',
        website: 'https://www.lilianewyork.com',
        priceLevel: '$$$',
        rating: 4.7,
        dressCodeSummary: 'Upscale casual'
      }
    });

    const lateNightStart = new Date(events[1].endTime.getTime() + 30 * 60 * 1000);

    events.push({
      orderIndex: 2,
      type: 'bar',
      title: 'Rooftop Nightcap & DJ',
      description: 'Dance floor optional, skyline mandatory.',
      startTime: lateNightStart,
      endTime: new Date(lateNightStart.getTime() + 120 * 60 * 1000),
      venue: {
        name: 'Electric Lemon Rooftop',
        address: '33 Hudson Yards, New York, NY 10001',
        city,
        bookingType: 'webview_form',
        bookingProvider: 'sevenrooms',
        bookingUrl: 'https://www.sevenrooms.com/reservations/electriclemon',
        phone: '+1 212-904-1301',
        website: 'https://www.electriclemonnyc.com',
        priceLevel: '$$$',
        rating: 4.5,
        dressCodeSummary: 'Dressy casual'
      }
    });

    const dateEnd = events[events.length - 1].endTime;

    return {
      title: `PartyPilot Plan for ${city}`,
      city,
      occasion,
      budgetLevel,
      groupSizeMin: groupSize,
      groupSizeMax: groupSize,
      dateStart: events[0].startTime,
      dateEnd,
      events
    };
  }

  private static inferCity(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes('vegas')) return 'Las Vegas';
    if (lower.includes('miami')) return 'Miami';
    if (lower.includes('austin')) return 'Austin';
    if (lower.includes('la') || lower.includes('los angeles')) return 'Los Angeles';
    if (lower.includes('chicago')) return 'Chicago';
    if (lower.includes('nashville')) return 'Nashville';
    return 'New York';
  }

  private static inferOccasion(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes('bachelor')) return 'bachelor';
    if (lower.includes('bachelorette')) return 'bachelorette';
    if (lower.includes('birthday')) return 'birthday';
    if (lower.includes('corporate')) return 'corporate';
    return 'custom';
  }

  private static inferBudget(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes('lux') || lower.includes('high-end') || lower.includes('premium')) return 'high';
    if (lower.includes('budget') || lower.includes('affordable')) return 'low';
    return 'medium';
  }

  private static inferGroupSize(prompt: string): number {
    const match = prompt.match(/(\d{1,3})\s+(?:people|guests|friends|attendees|folks)/i);
    if (match) {
      return Math.max(2, parseInt(match[1], 10));
    }
    return 12;
  }

  private static upcomingWeekendDate(): Date {
    const now = new Date();
    const date = new Date(now);
    const day = date.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7;
    date.setDate(date.getDate() + (daysUntilSaturday || 7));
    return date;
  }
}
