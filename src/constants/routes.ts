// ──────────────────────────────────────────────
// Centralised route paths – import everywhere
// ──────────────────────────────────────────────

export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Properties
  PROPERTIES: '/properties',
  PROPERTY_NEW: '/properties/new',
  PROPERTY_DETAIL: (id: string) => `/properties/${id}` as const,
  PROPERTY_EDIT: (id: string) => `/properties/${id}/edit` as const,

  // Rooms
  ROOMS: '/rooms',
  ROOM_NEW: '/rooms/new',
  ROOM_DETAIL: (id: string) => `/rooms/${id}` as const,
  ROOM_EDIT: (id: string) => `/rooms/${id}/edit` as const,

  // Tenants
  TENANTS: '/tenants',
  TENANT_NEW: '/tenants/new',
  TENANT_DETAIL: (id: string) => `/tenants/${id}` as const,
  TENANT_EDIT: (id: string) => `/tenants/${id}/edit` as const,

  // Contracts
  CONTRACTS: '/contracts',
  CONTRACT_NEW: '/contracts/new',
  CONTRACT_DETAIL: (id: string) => `/contracts/${id}` as const,

  // Bills
  BILLS: '/bills',
  BILL_NEW: '/bills/new',
  BILL_DETAIL: (id: string) => `/bills/${id}` as const,

  // Payments
  PAYMENTS: '/payments',
  PAYMENT_SETTINGS: '/payment-settings',

  // Users (staff management)
  USERS: '/users',
  USER_NEW: '/users/new',
  USER_EDIT: (id: string) => `/users/${id}/edit` as const,

  // Profile
  PROFILE: '/profile',
} as const;
