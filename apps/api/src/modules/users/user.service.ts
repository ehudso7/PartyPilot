import type { User } from '@prisma/client';
import { AppError } from '../../utils/appError';
import { UserRepository } from './user.repository';
import type { CreateUserInput, UpdateUserInput } from './user.types';

export class UserService {
  static async createUser(payload: CreateUserInput): Promise<User> {
    const existing = await UserRepository.findByEmail(payload.email);
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    return UserRepository.create(payload);
  }

  static async listUsers(): Promise<User[]> {
    return UserRepository.findMany();
  }

  static async getUserById(userId: string): Promise<User> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  static async updateUser(userId: string, payload: UpdateUserInput): Promise<User> {
    await this.getUserById(userId);
    return UserRepository.update(userId, payload);
  }

  static async deleteUser(userId: string): Promise<void> {
    await this.getUserById(userId);
    await UserRepository.delete(userId);
  }
}
