// ──────────────────────────────────────────────
// React Query key factory
// ──────────────────────────────────────────────

export const queryKeys = {
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    profile: ['users', 'profile'] as const,
  },
  properties: {
    all: ['properties'] as const,
    detail: (id: string) => ['properties', id] as const,
  },
  rooms: {
    all: (propertyId?: string) =>
      propertyId ? ['rooms', { propertyId }] as const : ['rooms'] as const,
    detail: (id: string) => ['rooms', id] as const,
  },
  tenants: {
    all: ['tenants'] as const,
    detail: (id: string) => ['tenants', id] as const,
  },
  customers: {
    all: ['customers'] as const,
    detail: (id: string) => ['customers', id] as const,
  },
  contracts: {
    all: ['contracts'] as const,
    detail: (id: string) => ['contracts', id] as const,
  },
  bills: {
    all: ['bills'] as const,
    detail: (id: string) => ['bills', id] as const,
  },
  payments: {
    byBill: (billId: string) => ['payments', 'bill', billId] as const,
  },
} as const;
