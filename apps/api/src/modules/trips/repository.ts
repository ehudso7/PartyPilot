import prisma from '../../db/prismaClient';

export async function createTrip(data: any) {
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

export async function updateTrip(tripId: string, updates: any) {
  return await prisma.trip.update({
    where: { id: tripId },
    data: updates,
  });
}
