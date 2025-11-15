import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prismaClient';
import type { TripQuery } from './trip.schema';

export const create = (data: Prisma.TripUncheckedCreateInput) =>
  prisma.trip.create({ data });

export const findById = (id: string) =>
  prisma.trip.findUnique({
    where: { id }
  });

export const findDetailedById = (id: string) =>
  prisma.trip.findUnique({
    where: { id },
    include: {
      events: {
        orderBy: { orderIndex: 'asc' },
        include: { venue: true, reservations: true }
      },
      reservations: {
        include: { venue: true, event: true }
      },
      notifications: true
    }
  });

export const findAll = (query: TripQuery) =>
  prisma.trip.findMany({
    where: {
      userId: query.userId
    },
    orderBy: { createdAt: 'desc' }
  });

export const update = (id: string, data: Prisma.TripUncheckedUpdateInput) =>
  prisma.trip.update({
    where: { id },
    data
  });

export const remove = (id: string) =>
  prisma.trip.delete({
    where: { id }
  });
