import { User } from './user.types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: TokenPair;
}

export interface RegisterResponse {
  user: User;
  tokens: TokenPair;
}
