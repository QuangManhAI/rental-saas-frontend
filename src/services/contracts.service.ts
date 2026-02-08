import api from '@/lib/axios';
import { ApiResponse, Contract, CreateContractRequest } from '@/types';

const BASE = '/contracts';

export const contractsService = {
  create: (data: CreateContractRequest) =>
    api.post<ApiResponse<Contract>>(BASE, data).then((r) => r.data.data),

  findAll: () =>
    api.get<ApiResponse<Contract[]>>(BASE).then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<ApiResponse<Contract>>(`${BASE}/${id}`).then((r) => r.data.data),

  terminate: (id: string) =>
    api.patch<ApiResponse<Contract>>(`${BASE}/${id}/terminate`).then((r) => r.data.data),
};
