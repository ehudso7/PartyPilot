import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prismaClient';

export const create = (data: Prisma.UserCreateInput) => prisma.user.create({ data });

export const findAll = () =>
  prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

export const findById = (id: string) =>
  prisma.user.findUnique({
    where: { id }
  });

export const findByEmail = (email: string) =>
  prisma.user.findUnique({
    where: { email }
  });

export const update = (id: string, data: Prisma.UserUpdateInput) =>
  prisma.user.update({
    where: { id },
    data
  });

export const remove = (id: string) =>
  prisma.user.delete({
    where: { id }
  });
