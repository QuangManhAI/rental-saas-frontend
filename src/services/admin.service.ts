import api from '@/lib/axios';

const BASE = '/admin';

export interface AdminStats {
  users: { total: number; owners: number; staff: number };
  properties: number;
  rooms: number;
  bills: number;
  totalRevenue: number;
  planBreakdown: Record<string, number>;
  recentUsers: {
    _id: string;
    email: string;
    fullName: string;
    createdAt: string;
    isActive: boolean;
  }[];
}

export interface AdminUser {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  isOnboardingComplete: boolean;
  createdAt: string;
}

export interface AdminSubscription {
  _id: string;
  ownerId: string;
  plan: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd?: string;
  propertyLimit: number;
  roomLimit: number;
  staffLimit: number;
  notes?: string;
  createdAt: string;
}

export interface AdminHealth {
  status: string;
  timestamp: string;
  database: { users: number; bills: number; payments: number };
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  uptime: number;
  nodeVersion: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const adminService = {
  getStats: () =>
    api.get<{ data: AdminStats }>(`${BASE}/stats`).then((r) => r.data.data),

  getHealth: () =>
    api.get<{ data: AdminHealth }>(`${BASE}/health`).then((r) => r.data.data),

  listUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    api
      .get<{ data: PaginatedResult<AdminUser> }>(`${BASE}/users`, { params })
      .then((r) => r.data.data),

  getUser: (id: string) =>
    api
      .get<{ data: { user: AdminUser; subscription: AdminSubscription | null } }>(`${BASE}/users/${id}`)
      .then((r) => r.data.data),

  toggleUserActive: (id: string) =>
    api.patch<{ data: AdminUser }>(`${BASE}/users/${id}/toggle-active`).then((r) => r.data.data),

  listSubscriptions: (params?: { page?: number; limit?: number }) =>
    api
      .get<{ data: PaginatedResult<AdminSubscription> }>('/subscriptions', { params })
      .then((r) => r.data.data),

  activatePlan: (data: { ownerId: string; plan: string; months: number; notes?: string }) =>
    api.post<{ data: AdminSubscription }>('/subscriptions/activate', data).then((r) => r.data.data),
};
