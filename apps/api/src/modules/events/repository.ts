import prisma from '../../db/prismaClient';
import { CreateEventDTO, UpdateEventDTO } from './types';

export class EventRepository {
  async create(data: CreateEventDTO) {
    return prisma.event.create({
      data,
      include: {
        venue: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
      },
    });
  }

  async findByTripId(tripId: string) {
    return prisma.event.findMany({
      where: { tripId },
      include: {
        venue: true,
      },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async update(id: string, data: UpdateEventDTO) {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        venue: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.event.delete({
      where: { id },
    });
  }

  async createMany(events: CreateEventDTO[]) {
    return prisma.$transaction(
      events.map((event) =>
        prisma.event.create({
          data: event,
          include: {
            venue: true,
          },
        })
      )
    );
  }
}

export const eventRepository = new EventRepository();
