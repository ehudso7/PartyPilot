import prisma from '../../db/prismaClient';
import { CreateTripDTO, UpdateTripDTO } from './types';

export class TripRepository {
  async create(data: CreateTripDTO) {
    return prisma.trip.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            venue: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
        reservations: true,
        notifications: true,
        shareLinks: true,
        user: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.trip.findMany({
      where: { userId },
      include: {
        events: {
          include: {
            venue: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateTripDTO) {
    return prisma.trip.update({
      where: { id },
      data,
      include: {
        events: {
          include: {
            venue: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.trip.delete({
      where: { id },
    });
  }

  async list() {
    return prisma.trip.findMany({
      include: {
        events: {
          include: {
            venue: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const tripRepository = new TripRepository();
