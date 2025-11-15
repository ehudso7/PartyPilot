import { prisma } from '../../db/prismaClient';
import { CreateVenueInput, UpdateVenueInput, VenueResponse } from './types';

export class VenueRepository {
  async create(data: CreateVenueInput): Promise<VenueResponse> {
    return prisma.venue.create({
      data,
    });
  }

  async findById(id: string): Promise<VenueResponse | null> {
    return prisma.venue.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<VenueResponse[]> {
    return prisma.venue.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCity(city: string): Promise<VenueResponse[]> {
    return prisma.venue.findMany({
      where: { city },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateVenueInput): Promise<VenueResponse> {
    return prisma.venue.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.venue.delete({
      where: { id },
    });
  }
}
