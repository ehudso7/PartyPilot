import { prisma } from '../../db/prismaClient';
import { CreateTripInput, UpdateTripInput, TripResponse } from './types';

export class TripRepository {
  async create(data: CreateTripInput): Promise<TripResponse> {
    return prisma.trip.create({
      data: {
        ...data,
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
        status: data.status || 'draft',
      },
    });
  }

  async findById(id: string): Promise<TripResponse | null> {
    return prisma.trip.findUnique({
      where: { id },
    });
  }

  async findByIdWithRelations(id: string) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            venue: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
        reservations: {
          include: {
            venue: true,
            event: true,
          },
        },
        notifications: {
          orderBy: { scheduledFor: 'asc' },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<TripResponse[]> {
    return prisma.trip.findMany({
      where: { userId },
      orderBy: { dateStart: 'desc' },
    });
  }

  async update(id: string, data: UpdateTripInput): Promise<TripResponse> {
    const updateData: any = { ...data };
    if (data.dateStart) {
      updateData.dateStart = new Date(data.dateStart);
    }
    if (data.dateEnd) {
      updateData.dateEnd = new Date(data.dateEnd);
    }
    return prisma.trip.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.trip.delete({
      where: { id },
    });
  }
}
