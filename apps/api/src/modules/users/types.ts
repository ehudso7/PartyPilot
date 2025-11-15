export interface CreateUserInput {
  email: string;
  name: string;
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}
