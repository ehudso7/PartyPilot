import { UserRepository } from './repository';
import { CreateUserInput, UpdateUserInput, UserResponse } from './types';
import { User } from '@prisma/client';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(data: CreateUserInput): Promise<UserResponse> {
    // Check if user already exists
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const user = await this.repository.create(data);
    return this.toResponse(user);
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.toResponse(user);
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.repository.findByEmail(email);
    return user ? this.toResponse(user) : null;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserResponse> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updated = await this.repository.update(id, data);
    return this.toResponse(updated);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.repository.delete(id);
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.repository.findAll();
    return users.map((u) => this.toResponse(u));
  }

  private toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
