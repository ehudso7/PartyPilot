import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prismaClient';
import type { VenueQuery } from './venue.schema';

export const create = (data: Prisma.VenueCreateInput) => prisma.venue.create({ data });

export const findAll = (query: VenueQuery) =>
  prisma.venue.findMany({
    where: {
      city: query.city
    },
    orderBy: { name: 'asc' }
  });

export const findById = (id: string) =>
  prisma.venue.findUnique({
    where: { id }
  });

export const update = (id: string, data: Prisma.VenueUpdateInput) =>
  prisma.venue.update({
    where: { id },
    data
  });

export const remove = (id: string) =>
  prisma.venue.delete({
    where: { id }
  });
