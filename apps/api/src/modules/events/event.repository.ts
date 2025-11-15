import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prismaClient';

export class EventRepository {
  static create(data: Prisma.EventUncheckedCreateInput) {
    return prisma.event.create({ data });
  }

  static findById(eventId: string) {
    return prisma.event.findUnique({ where: { id: eventId }, include: { venue: true } });
  }

  static findByTrip(tripId: string) {
    return prisma.event.findMany({
      where: { tripId },
      orderBy: { orderIndex: 'asc' },
      include: { venue: true }
    });
  }

  static update(eventId: string, data: Prisma.EventUncheckedUpdateInput) {
    return prisma.event.update({ where: { id: eventId }, data, include: { venue: true } });
  }

  static delete(eventId: string) {
    return prisma.event.delete({ where: { id: eventId } });
  }
}
