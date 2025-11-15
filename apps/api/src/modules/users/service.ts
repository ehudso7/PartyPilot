import { userRepository } from './repository';
import { CreateUserDTO, UpdateUserDTO } from './types';
import { AppError } from '../../middleware/errorHandler';

export class UserService {
  async createUser(data: CreateUserDTO) {
    // Check if user already exists
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError(400, 'User with this email already exists');
    }

    return userRepository.create(data);
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    await this.getUserById(id); // Ensure user exists
    return userRepository.update(id, data);
  }

  async deleteUser(id: string) {
    await this.getUserById(id); // Ensure user exists
    return userRepository.delete(id);
  }

  async listUsers() {
    return userRepository.list();
  }
}

export const userService = new UserService();
