import { Prisma } from '@prisma/client';
import { prisma } from '../../db/client';
import { stubPlanner } from '../planner/stubPlanner';
import { userService, UpsertUserInput } from '../users/user.service';
import { venueService } from '../venues/venue.service';

export interface PlanTripInput {
  prompt: string;
  user: UpsertUserInput;
}

export type TripWithRelations = Prisma.TripGetPayload<{
  include: {
    user: true;
    events: {
      include: {
        venue: true;
      };
    };
  };
}>;

export class TripService {
  async planTrip({ prompt, user }: PlanTripInput): Promise<TripWithRelations> {
    const [plan, existingUser] = await Promise.all([stubPlanner.plan(prompt), userService.upsertUser(user)]);

    const result = await prisma.$transaction(async (tx) => {
      const venueMap = await venueService.ensureSeedVenues(tx);

      const trip = await tx.trip.create({
        data: {
          userId: existingUser.id,
          title: plan.title,
          city: plan.city,
          dateStart: new Date(plan.dateStart),
          dateEnd: new Date(plan.dateEnd),
          groupSizeMin: plan.groupSizeMin,
          groupSizeMax: plan.groupSizeMax,
          occasion: plan.occasion,
          budgetLevel: plan.budgetLevel,
          status: 'planned'
        }
      });

      for (const event of plan.events) {
        const venue = venueMap[event.orderIndex];

        await tx.event.create({
          data: {
            tripId: trip.id,
            venueId: venue?.id,
            orderIndex: event.orderIndex,
            type: event.type,
            title: event.label,
            description: event.primaryVenueRequirements.tags.join(', '),
            startTime: new Date(event.timeWindow.start),
            endTime: new Date(event.timeWindow.end),
            isPrimary: true
          }
        });
      }

      return tx.trip.findUniqueOrThrow({
        where: { id: trip.id },
        include: {
          user: true,
          events: {
            orderBy: { orderIndex: 'asc' },
            include: { venue: true }
          }
        }
      });
    });

    return result;
  }

  async getTripById(tripId: string): Promise<TripWithRelations | null> {
    return prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        user: true,
        events: {
          orderBy: { orderIndex: 'asc' },
          include: { venue: true }
        }
      }
    });
  }
}

export const tripService = new TripService();
