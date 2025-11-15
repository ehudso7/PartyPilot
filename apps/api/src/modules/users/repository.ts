import prisma from '../../db/prismaClient';
import { CreateUserDTO, UpdateUserDTO } from './types';

export class UserRepository {
  async create(data: CreateUserDTO) {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserDTO) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async list() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const userRepository = new UserRepository();
