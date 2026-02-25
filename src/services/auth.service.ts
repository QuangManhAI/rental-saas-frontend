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

  verifyEmail: (token: string) =>
    api.get<ApiResponse<{ message: string }>>(`${BASE}/verify-email`, { params: { token } }).then((r) => r.data.data),

  resendVerification: () =>
    api.post<ApiResponse<{ message: string }>>(`${BASE}/resend-verification`).then((r) => r.data.data),

  // OTP-based registration
  requestRegisterOtp: (data: RegisterRequest) =>
    api.post<ApiResponse<{ message: string; email: string }>>(`${BASE}/register/request-otp`, data).then((r) => r.data.data),

  verifyRegisterOtp: (data: { email: string; code: string }) =>
    api.post<ApiResponse<RegisterResponse>>(`${BASE}/register/verify-otp`, data).then((r) => r.data.data),

  // OTP-based change password
  requestChangePasswordOtp: () =>
    api.post<ApiResponse<{ message: string }>>(`${BASE}/change-password/request-otp`).then((r) => r.data.data),

  verifyChangePasswordOtp: (data: { code: string; currentPassword: string; newPassword: string }) =>
    api.post<ApiResponse<{ message: string }>>(`${BASE}/change-password/verify-otp`, data).then((r) => r.data.data),

  // OTP-based forgot password
  requestForgotPasswordOtp: (data: { email: string }) =>
    api.post<ApiResponse<{ message: string }>>(`${BASE}/forgot-password/request-otp`, data).then((r) => r.data.data),

  verifyForgotPasswordOtp: (data: { email: string; code: string; newPassword: string }) =>
    api.post<ApiResponse<{ message: string }>>(`${BASE}/forgot-password/verify-otp`, data).then((r) => r.data.data),
};

export const onboardingService = {
  getStatus: () =>
    api.get<ApiResponse<{ isOnboardingComplete: boolean; emailVerified: boolean }>>('/onboarding/status').then((r) => r.data.data),

  complete: () =>
    api.post<ApiResponse<{ message: string; isOnboardingComplete: boolean }>>('/onboarding/complete').then((r) => r.data.data),
};
