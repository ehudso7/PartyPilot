import { prisma } from '../../db/prismaClient';
import { CreateEventInput, UpdateEventInput, EventResponse } from './types';

export class EventRepository {
  async create(data: CreateEventInput): Promise<EventResponse> {
    return prisma.event.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });
  }

  async findById(id: string): Promise<EventResponse | null> {
    return prisma.event.findUnique({
      where: { id },
    });
  }

  async findByTripId(tripId: string): Promise<EventResponse[]> {
    return prisma.event.findMany({
      where: { tripId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async update(id: string, data: UpdateEventInput): Promise<EventResponse> {
    const updateData: any = { ...data };
    if (data.startTime) {
      updateData.startTime = new Date(data.startTime);
    }
    if (data.endTime) {
      updateData.endTime = new Date(data.endTime);
    }
    return prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.event.delete({
      where: { id },
    });
  }

  async deleteByTripId(tripId: string): Promise<void> {
    await prisma.event.deleteMany({
      where: { tripId },
    });
  }
}
