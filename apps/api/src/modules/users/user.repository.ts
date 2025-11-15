import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prismaClient';

export class UserRepository {
  static create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  static findMany() {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  static findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  static delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
