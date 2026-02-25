'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services';
import { useAuthStore } from '@/stores/auth.store';
import { queryKeys, ROUTES } from '@/constants';
import type { LoginRequest, RegisterRequest } from '@/types';
import { Role } from '@/types/enums';

export function useLogin() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (res) => {
      setTokens(res.tokens.accessToken, res.tokens.refreshToken);
      setUser(res.user);
      toast.success('Đăng nhập thành công');
      // Admin users go straight to the admin panel
      if (res.user.role === Role.ADMIN) {
        router.replace('/admin');
      } else if (!res.user.isOnboardingComplete) {
        router.replace(ROUTES.ONBOARDING);
      } else {
        router.replace(ROUTES.DASHBOARD);
      }
    },
    onError: () => {
      toast.error('Email hoặc mật khẩu không đúng');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (res) => {
      setTokens(res.tokens.accessToken, res.tokens.refreshToken);
      setUser(res.user);
      toast.success('Đăng ký thành công! Hãy kiểm tra email để xác thực.');
      router.replace(ROUTES.ONBOARDING);
    },
    onError: () => {
      toast.error('Đăng ký thất bại. Email có thể đã tồn tại.');
    },
  });
}

export function useLogout() {
  const { refreshToken, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) await authService.logout(refreshToken);
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      router.replace(ROUTES.LOGIN);
    },
  });
}

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

/**
 * Try to silently refresh the access token using the stored refresh token.
 */
export function useSilentRefresh() {
  const { refreshToken, setTokens, logout } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) throw new Error('No refresh token');
      return authService.refresh(refreshToken);
    },
    onSuccess: (res) => {
      setTokens(res.accessToken, res.refreshToken);
    },
    onError: () => {
      logout();
    },
  });
}
