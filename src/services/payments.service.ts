import api from '@/lib/axios';
import { ApiResponse, Payment, CreatePaymentRequest } from '@/types';

const BASE = '/payments';

export interface PaymentFilters {
  billId?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
}

export const paymentsService = {
  getAll: (filters?: PaymentFilters) => {
    const params = new URLSearchParams();
    if (filters?.billId) params.append('billId', filters.billId);
    if (filters?.method) params.append('method', filters.method);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString();
    return api
      .get<ApiResponse<Payment[]>>(`${BASE}${query ? `?${query}` : ''}`)
      .then((r) => r.data.data);
  },

  create: (data: CreatePaymentRequest) =>
    api.post<ApiResponse<Payment>>(BASE, data).then((r) => r.data.data),

  findByBill: (billId: string) =>
    api
      .get<ApiResponse<Payment[]>>(`${BASE}/bill/${billId}`)
      .then((r) => r.data.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Payment>>(`${BASE}/${id}`).then((r) => r.data.data),
};

