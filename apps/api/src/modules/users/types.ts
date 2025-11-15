import { User } from '@prisma/client';

export type CreateUserDTO = {
  email: string;
  name: string;
  phone?: string;
};

export type UpdateUserDTO = Partial<CreateUserDTO>;

export type UserResponse = User;
