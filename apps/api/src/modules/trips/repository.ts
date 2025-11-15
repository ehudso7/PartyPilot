import { prisma } from '../../db/prismaClient';
import { CreateTripInput, UpdateTripInput } from './types';
import { Trip } from '@prisma/client';

export class TripRepository {
  async create(data: CreateTripInput): Promise<Trip> {
    return prisma.trip.create({
      data: {
        ...data,
        status: data.status || 'draft',
      },
    });
  }

  async findById(id: string): Promise<Trip | null> {
    return prisma.trip.findUnique({
      where: { id },
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

  async findByUserId(userId: string): Promise<Trip[]> {
    return prisma.trip.findMany({
      where: { userId },
      include: {
        events: {
          include: { venue: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { dateStart: 'desc' },
    });
  }

  async update(id: string, data: UpdateTripInput): Promise<Trip> {
    return prisma.trip.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Trip> {
    return prisma.trip.delete({
      where: { id },
    });
  }
}
