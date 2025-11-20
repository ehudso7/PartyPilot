import prisma from '../../db/prismaClient';

export async function findVenuesByCity(city: string) {
  return prisma.venue.findMany({
    where: {
      city: {
        equals: city,
        mode: 'insensitive',
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function findVenuesByIds(ids: string[]) {
  if (!ids.length) {
    return [];
  }

  return prisma.venue.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}
