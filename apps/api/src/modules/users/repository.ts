import { prisma } from '../../db/prismaClient';
import { CreateUserInput, UpdateUserInput, UserResponse } from './types';

export class UserRepository {
  async create(data: CreateUserInput): Promise<UserResponse> {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<UserResponse | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<UserResponse[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<UserResponse> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
