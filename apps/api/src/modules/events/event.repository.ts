import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prismaClient';
import type { EventQuery } from './event.schema';

export const create = (data: Prisma.EventUncheckedCreateInput) =>
  prisma.event.create({
    data,
    include: { venue: true }
  });

export const findAll = (query: EventQuery) =>
  prisma.event.findMany({
    where: { tripId: query.tripId },
    orderBy: { orderIndex: 'asc' },
    include: { venue: true }
  });

export const findById = (id: string) =>
  prisma.event.findUnique({
    where: { id },
    include: { venue: true }
  });

export const update = (id: string, data: Prisma.EventUncheckedUpdateInput) =>
  prisma.event.update({
    where: { id },
    data,
    include: { venue: true }
  });

export const remove = (id: string) =>
  prisma.event.delete({
    where: { id }
  });
