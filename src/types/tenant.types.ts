export interface Tenant {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  identityCard: string;
  address?: string;
  dob?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantRequest {
  fullName: string;
  email?: string;
  phone: string;
  identityCard: string;
  address?: string;
  dob?: string;
}

export type UpdateTenantRequest = Partial<CreateTenantRequest>;
