import { Role } from './enums';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export type UpdateUserRequest = Partial<Omit<CreateUserRequest, 'email'>>;
