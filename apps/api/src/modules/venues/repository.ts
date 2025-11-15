import prisma from '../../db/prismaClient';
import { CreateVenueDTO, UpdateVenueDTO, VenueSearchCriteria } from './types';

export class VenueRepository {
  async create(data: CreateVenueDTO) {
    return prisma.venue.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.venue.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateVenueDTO) {
    return prisma.venue.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.venue.delete({
      where: { id },
    });
  }

  async list(criteria?: VenueSearchCriteria) {
    const where: any = {};

    if (criteria?.city) {
      where.city = criteria.city;
    }

    if (criteria?.priceLevel) {
      where.priceLevel = criteria.priceLevel;
    }

    if (criteria?.groupFriendly !== undefined) {
      where.groupFriendly = criteria.groupFriendly;
    }

    return prisma.venue.findMany({
      where,
      orderBy: { rating: 'desc' },
    });
  }

  async search(query: string, city?: string) {
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (city) {
      where.city = city;
    }

    return prisma.venue.findMany({
      where,
      orderBy: { rating: 'desc' },
      take: 20,
    });
  }
}

export const venueRepository = new VenueRepository();
