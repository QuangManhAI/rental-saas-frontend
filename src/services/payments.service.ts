import api from '@/lib/axios';
import { ApiResponse, Payment, CreatePaymentRequest } from '@/types';

const BASE = '/payments';

export const paymentsService = {
  create: (data: CreatePaymentRequest) =>
    api.post<ApiResponse<Payment>>(BASE, data).then((r) => r.data.data),

  findByBill: (billId: string) =>
    api
      .get<ApiResponse<Payment[]>>(`${BASE}/bill/${billId}`)
      .then((r) => r.data.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Payment>>(`${BASE}/${id}`).then((r) => r.data.data),
};
