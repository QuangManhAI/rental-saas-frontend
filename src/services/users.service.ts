import api from '@/lib/axios';
import { ApiResponse, User, CreateUserRequest, UpdateUserRequest } from '@/types';

const BASE = '/users';

export const usersService = {
  create: (data: CreateUserRequest) =>
    api.post<ApiResponse<User>>(BASE, data).then((r) => r.data.data),

  findAll: () =>
    api.get<ApiResponse<User[]>>(BASE).then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<ApiResponse<User>>(`${BASE}/${id}`).then((r) => r.data.data),

  getProfile: () =>
    api.get<ApiResponse<User>>(`${BASE}/profile`).then((r) => r.data.data),

  update: (id: string, data: UpdateUserRequest) =>
    api.patch<ApiResponse<User>>(`${BASE}/${id}`, data).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete<ApiResponse<User>>(`${BASE}/${id}`).then((r) => r.data.data),
};
