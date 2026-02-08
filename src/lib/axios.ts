import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

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

// ─── RESPONSE: silent refresh on 401 ────
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

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh for 401 and not already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = _getRefreshToken?.() ?? null;

    if (!refreshToken) {
      _logout?.();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the refresh completes
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
