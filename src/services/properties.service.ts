import api from '@/lib/axios';
import {
  ApiResponse,
  PaginatedResult,
  Property,
  CreatePropertyRequest,
  UpdatePropertyRequest,
} from '@/types';

const BASE = '/properties';

export const propertiesService = {
  create: (data: CreatePropertyRequest) =>
    api.post<ApiResponse<Property>>(BASE, data).then((r) => r.data.data),

  findAll: () =>
    api.get<ApiResponse<PaginatedResult<Property>>>(BASE).then((r) => r.data.data.data),

  findOne: (id: string) =>
    api.get<ApiResponse<Property>>(`${BASE}/${id}`).then((r) => r.data.data),

  update: (id: string, data: UpdatePropertyRequest) =>
    api.patch<ApiResponse<Property>>(`${BASE}/${id}`, data).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Property>>(`${BASE}/${id}`).then((r) => r.data.data),
};
