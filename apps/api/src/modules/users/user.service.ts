import { User } from '@prisma/client';
import { prisma } from '../../db/client';

export interface UpsertUserInput {
  email: string;
  name?: string;
  phone?: string;
}

export class UserService {
  async upsertUser(input: UpsertUserInput): Promise<User> {
    const fallbackName = input.name ?? input.email.split('@')[0] ?? 'PartyPilot User';

    return prisma.user.upsert({
      where: { email: input.email },
      update: {
        name: input.name ?? fallbackName,
        phone: input.phone
      },
      create: {
        email: input.email,
        name: fallbackName,
        phone: input.phone
      }
    });
  }
}

export const userService = new UserService();
