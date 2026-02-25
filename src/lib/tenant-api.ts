/**
 * Separate Axios instance for the Tenant Portal.
 * Uses tenant-auth-storage JWT (not the owner JWT).
 */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

const tenantApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

tenantApi.interceptors.request.use((config) => {
  // Read token directly from localStorage to avoid circular store imports
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('tenant-auth-storage');
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
        const token = parsed?.state?.accessToken;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

export default tenantApi;
