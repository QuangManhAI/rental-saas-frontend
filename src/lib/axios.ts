import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { triggerUpgradeDialog } from '@/components/shared/upgrade-dialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ─── helpers to avoid circular-import with the Zustand store ────
let _getAccessToken: (() => string | null) | null = null;
let _getRefreshToken: (() => string | null) | null = null;
let _setTokens: ((access: string, refresh: string) => void) | null = null;
let _logout: (() => void) | null = null;

export function registerAuthInterceptors(fns: {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
}) {
  _getAccessToken = fns.getAccessToken;
  _getRefreshToken = fns.getRefreshToken;
  _setTokens = fns.setTokens;
  _logout = fns.logout;
}

// ─── REQUEST: attach Bearer token ────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = _getAccessToken?.();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── RESPONSE: silent refresh on 401, toast for 402/403/500 ────
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}

function extractMessage(error: AxiosError): string {
  const data = error.response?.data as { message?: string | string[] } | undefined;
  if (!data?.message) return 'Có lỗi xảy ra. Vui lòng thử lại.';
  return Array.isArray(data.message) ? data.message[0] : data.message;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    // ── 402: Plan limit exceeded ─────────────────────────────────────────────
    if (status === 402) {
      const msg = extractMessage(error);
      triggerUpgradeDialog(msg);
      return Promise.reject(error);
    }

    // ── 403: Forbidden ───────────────────────────────────────────────────────
    if (status === 403) {
      toast.error('Bạn không có quyền thực hiện thao tác này.');
      return Promise.reject(error);
    }

    // ── 500+: Server error ────────────────────────────────────────────────────
    if (status && status >= 500) {
      toast.error('Có lỗi xảy ra trên máy chủ. Vui lòng thử lại sau.');
      return Promise.reject(error);
    }

    // ── 401: Attempt silent token refresh ────────────────────────────────────
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = _getRefreshToken?.() ?? null;

    if (!refreshToken) {
      _logout?.();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      const newAccess: string = data.data.accessToken;
      const newRefresh: string = data.data.refreshToken;

      _setTokens?.(newAccess, newRefresh);
      processQueue(null, newAccess);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      _logout?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
