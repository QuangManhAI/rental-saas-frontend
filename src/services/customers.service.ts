import api from '@/lib/axios';

export interface Customer {
  _id: string;
  name: string;
  email: string;
  telegramChatId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
}

export const customersService = {
  getAll: () => api.get<{ data: Customer[] }>('/customers').then((r) => r.data.data ?? r.data),
  getById: (id: string) => api.get<Customer>(`/customers/${id}`).then((r) => r.data),
  create: (data: CreateCustomerDto) => api.post<Customer>('/customers', data).then((r) => r.data),
  update: (id: string, data: UpdateCustomerDto) => api.patch<Customer>(`/customers/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  getTelegramLink: (id: string) => api.get<{ url: string }>(`/customers/${id}/telegram-link`).then((r) => r.data),
};