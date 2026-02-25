import api from '@/lib/axios';
import { ApiResponse, PaginatedResult, Bill, CreateBillRequest } from '@/types';

const BASE = '/bills';

export const billsService = {
  create: (data: CreateBillRequest) =>
    api.post<ApiResponse<Bill>>(BASE, data).then((r) => r.data.data),

  findAll: () =>
    api.get<ApiResponse<PaginatedResult<Bill>>>(BASE).then((r) => r.data.data.data),

  findOne: (id: string) =>
    api.get<ApiResponse<Bill>>(`${BASE}/${id}`).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Bill>>(`${BASE}/${id}`).then((r) => r.data.data),
};
