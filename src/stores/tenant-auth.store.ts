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
  mustChangePassword: boolean;

  setAuth: (token: string, tenant: TenantProfile, mustChangePassword?: boolean) => void;
  clearMustChangePassword: () => void;
  logout: () => void;
}

export const useTenantAuthStore = create<TenantAuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      tenant: null,
      isAuthenticated: false,
      mustChangePassword: false,

      setAuth: (token, tenant, mustChangePassword = false) =>
        set({ accessToken: token, tenant, isAuthenticated: true, mustChangePassword }),

      clearMustChangePassword: () =>
        set({ mustChangePassword: false }),

      logout: () =>
        set({ accessToken: null, tenant: null, isAuthenticated: false, mustChangePassword: false }),
    }),
    {
      name: 'tenant-auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
