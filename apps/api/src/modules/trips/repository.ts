import prisma from '../../db/prismaClient';
import { z } from 'zod';

// Schema for creating a trip
const CreateTripSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  dateStart: z.date(),
  dateEnd: z.date(),
  groupSizeMin: z.number().int().min(1).max(1000),
  groupSizeMax: z.number().int().min(1).max(1000),
  occasion: z.string().min(1).max(100),
  budgetLevel: z.string().min(1).max(50),
  status: z.string().optional(),
}).strict();

// Schema for updating a trip
const UpdateTripSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  city: z.string().min(1).max(100).optional(),
  dateStart: z.date().optional(),
  dateEnd: z.date().optional(),
  groupSizeMin: z.number().int().min(1).max(1000).optional(),
  groupSizeMax: z.number().int().min(1).max(1000).optional(),
  occasion: z.string().min(1).max(100).optional(),
  budgetLevel: z.string().min(1).max(50).optional(),
  status: z.string().min(1).max(50).optional(),
}).strict();

export type CreateTripInput = z.infer<typeof CreateTripSchema>;
export type UpdateTripInput = z.infer<typeof UpdateTripSchema>;

export async function createTrip(data: unknown) {
  const validated = CreateTripSchema.parse(data);
  return await prisma.trip.create({ data: validated });
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

export async function updateTrip(tripId: string, updates: unknown) {
  const validated = UpdateTripSchema.parse(updates);
  return await prisma.trip.update({
    where: { id: tripId },
    data: validated,
  });
}
