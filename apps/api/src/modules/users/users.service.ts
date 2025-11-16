import { prisma } from '../../db/prismaClient';
import type { CreateUserInput } from './users.schema';

const createUser = async (payload: CreateUserInput) => {
  return prisma.user.create({
    data: payload
  });
};

const getUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

const findOrCreateByEmail = async (payload: CreateUserInput) => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) {
    return existing;
  }
  return createUser(payload);
};

export const userService = {
  createUser,
  getUserById,
  findOrCreateByEmail
};
