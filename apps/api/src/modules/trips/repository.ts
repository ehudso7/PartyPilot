import prisma from '../../db/prismaClient';
import { Prisma } from '@prisma/client';

export type CreateTripInput = {
  userId: string;
  title: string;
  city: string;
  dateStart: Date;
  dateEnd: Date;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  status?: string;
};

export type UpdateTripInput = {
  title?: string;
  city?: string;
  dateStart?: Date;
  dateEnd?: Date;
  groupSizeMin?: number;
  groupSizeMax?: number;
  occasion?: string;
  budgetLevel?: string;
  status?: string;
};

export async function createTrip(data: CreateTripInput) {
  return await prisma.trip.create({ data });
}

export async function getTripWithDetails(tripId: string) {
  return await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      events: {
        include: { venue: true },
        orderBy: { orderIndex: 'asc' },
      },
      reservations: true,
      notifications: true,
      shareLinks: true,
    },
  });
}

export async function updateTrip(tripId: string, updates: UpdateTripInput) {
  return await prisma.trip.update({
    where: { id: tripId },
    data: updates,
  });
}
