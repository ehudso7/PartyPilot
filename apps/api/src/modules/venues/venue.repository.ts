import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prismaClient';

export class VenueRepository {
  static create(data: Prisma.VenueCreateInput | Prisma.VenueUncheckedCreateInput) {
    return prisma.venue.create({ data });
  }

  static findMany() {
    return prisma.venue.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static findById(venueId: string) {
    return prisma.venue.findUnique({ where: { id: venueId } });
  }

  static findByNameAndCity(name: string, city: string) {
    return prisma.venue.findFirst({ where: { name, city } });
  }

  static update(venueId: string, data: Prisma.VenueUncheckedUpdateInput) {
    return prisma.venue.update({ where: { id: venueId }, data });
  }

  static delete(venueId: string) {
    return prisma.venue.delete({ where: { id: venueId } });
  }
}
