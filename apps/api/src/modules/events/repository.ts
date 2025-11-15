import { prisma } from '../../db/prismaClient';
import { CreateEventInput, UpdateEventInput } from './types';
import { Event } from '@prisma/client';

export class EventRepository {
  async create(data: CreateEventInput): Promise<Event> {
    return prisma.event.create({
      data: {
        ...data,
        isPrimary: data.isPrimary ?? true,
      },
    });
  }

  async findById(id: string): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { id },
      include: { venue: true },
    });
  }

  async findByTripId(tripId: string): Promise<Event[]> {
    return prisma.event.findMany({
      where: { tripId },
      include: { venue: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async update(id: string, data: UpdateEventInput): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Event> {
    return prisma.event.delete({
      where: { id },
    });
  }

  async createMany(events: CreateEventInput[]): Promise<Event[]> {
    const created = await prisma.$transaction(
      events.map((event) =>
        prisma.event.create({
          data: {
            ...event,
            isPrimary: event.isPrimary ?? true,
          },
        })
      )
    );
    return created;
  }
}
