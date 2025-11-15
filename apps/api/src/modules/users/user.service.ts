import type { Prisma, User } from '@prisma/client';
import { HttpError } from '../../utils/httpError';
import * as userRepository from './user.repository';
import type { CreateUserInput, UpdateUserInput } from './user.schema';

const normalizeCreatePayload = (data: CreateUserInput): Prisma.UserCreateInput => ({
  email: data.email,
  name: data.name,
  phone: data.phone ?? null
});

const normalizeUpdatePayload = (data: UpdateUserInput): Prisma.UserUpdateInput => {
  const payload: Prisma.UserUpdateInput = {};

  if (data.email !== undefined) payload.email = data.email;
  if (data.name !== undefined) payload.name = data.name;
  if (data.phone !== undefined) payload.phone = data.phone;

  return payload;
};

export const listUsers = () => userRepository.findAll();

export const createUser = async (data: CreateUserInput) => {
  const existing = await userRepository.findByEmail(data.email);
  if (existing) {
    throw new HttpError(409, 'User with this email already exists');
  }
  return userRepository.create(normalizeCreatePayload(data));
};

export const getUserById = async (id: string) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  return user;
};

export const updateUser = async (id: string, data: UpdateUserInput): Promise<User> => {
  await getUserById(id);
  return userRepository.update(id, normalizeUpdatePayload(data));
};

export const deleteUser = async (id: string) => {
  await getUserById(id);
  await userRepository.remove(id);
};
