import { UserRepository } from './repository';
import { CreateUserInput, UpdateUserInput, UserResponse } from './types';

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

    return this.repository.create(data);
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    return this.repository.findByEmail(email);
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return this.repository.findAll();
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserResponse> {
    await this.getUserById(id); // Ensure user exists
    return this.repository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id); // Ensure user exists
    await this.repository.delete(id);
  }
}
