'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TenantProfile {
  _id?: string;
  fullName: string;
  email?: string;
  phone?: string;
}

interface TenantAuthState {
  accessToken: string | null;
  tenant: TenantProfile | null;
  isAuthenticated: boolean;

  setAuth: (token: string, tenant: TenantProfile) => void;
  logout: () => void;
}

export const useTenantAuthStore = create<TenantAuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      tenant: null,
      isAuthenticated: false,

      setAuth: (token, tenant) =>
        set({ accessToken: token, tenant, isAuthenticated: true }),

      logout: () =>
        set({ accessToken: null, tenant: null, isAuthenticated: false }),
    }),
    {
      name: 'tenant-auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
