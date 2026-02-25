import api from '@/lib/axios';
import {
  ApiResponse,
  PaginatedResult,
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
} from '@/types';

const BASE = '/tenants';

export const tenantsService = {
  create: (data: CreateTenantRequest) =>
    api.post<ApiResponse<Tenant>>(BASE, data).then((r) => r.data.data),

  findAll: () =>
    api.get<ApiResponse<PaginatedResult<Tenant>>>(BASE).then((r) => r.data.data.data),

  findOne: (id: string) =>
    api.get<ApiResponse<Tenant>>(`${BASE}/${id}`).then((r) => r.data.data),

  update: (id: string, data: UpdateTenantRequest) =>
    api.patch<ApiResponse<Tenant>>(`${BASE}/${id}`, data).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Tenant>>(`${BASE}/${id}`).then((r) => r.data.data),
};
