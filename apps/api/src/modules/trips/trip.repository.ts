import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prismaClient';

export class TripRepository {
  static create(data: Prisma.TripUncheckedCreateInput) {
    return prisma.trip.create({ data });
  }

  static findMany() {
    return prisma.trip.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static findById(id: string) {
    return prisma.trip.findUnique({ where: { id } });
  }

  static findDetailed(id: string) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            venue: true,
            reservations: true
          },
          orderBy: { orderIndex: 'asc' }
        },
        reservations: true,
        notifications: true
      }
    });
  }

  static update(id: string, data: Prisma.TripUncheckedUpdateInput) {
    return prisma.trip.update({ where: { id }, data });
  }

  static delete(id: string) {
    return prisma.trip.delete({ where: { id } });
  }
}
