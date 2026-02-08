import api from '@/lib/axios';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  TokenPair,
  ApiResponse,
  User,
} from '@/types';

const BASE = '/auth';

export const authService = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>(`${BASE}/login`, data).then((r) => r.data.data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<RegisterResponse>>(`${BASE}/register`, data).then((r) => r.data.data),

  refresh: (refreshToken: string) =>
    api
      .post<ApiResponse<TokenPair>>(`${BASE}/refresh`, { refreshToken })
      .then((r) => r.data.data),

  logout: (refreshToken: string) =>
    api.post(`${BASE}/logout`, { refreshToken }),

  getProfile: () =>
    api.get<ApiResponse<User>>(`${BASE}/profile`).then((r) => r.data.data),
};
