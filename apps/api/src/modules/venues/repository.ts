import { prisma } from '../../db/prismaClient';
import { CreateVenueInput, UpdateVenueInput, VenueSearchCriteria } from './types';
import { Venue } from '@prisma/client';

export class VenueRepository {
  async create(data: CreateVenueInput): Promise<Venue> {
    return prisma.venue.create({
      data: {
        ...data,
        groupFriendly: data.groupFriendly ?? true,
      },
    });
  }

  async findById(id: string): Promise<Venue | null> {
    return prisma.venue.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateVenueInput): Promise<Venue> {
    return prisma.venue.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Venue> {
    return prisma.venue.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Venue[]> {
    return prisma.venue.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async search(criteria: VenueSearchCriteria): Promise<Venue[]> {
    const where: any = {};

    if (criteria.city) {
      where.city = criteria.city;
    }

    if (criteria.groupFriendly !== undefined) {
      where.groupFriendly = criteria.groupFriendly;
    }

    if (criteria.priceLevel) {
      where.priceLevel = criteria.priceLevel;
    }

    if (criteria.dressCode) {
      where.dressCodeSummary = {
        contains: criteria.dressCode,
        mode: 'insensitive',
      };
    }

    return prisma.venue.findMany({
      where,
      orderBy: { rating: 'desc' },
    });
  }
}
