'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentsService } from '@/services';
import { queryKeys } from '@/constants';
import type { CreatePaymentRequest } from '@/types';

export function usePaymentsByBill(billId: string) {
  return useQuery({
    queryKey: queryKeys.payments.byBill(billId),
    queryFn: () => paymentsService.findByBill(billId),
    enabled: !!billId,
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentsService.create(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.payments.byBill(variables.billId) });
      qc.invalidateQueries({ queryKey: queryKeys.bills.detail(variables.billId) });
      qc.invalidateQueries({ queryKey: queryKeys.bills.all });
      toast.success('Thanh toán thành công');
    },
    onError: () => toast.error('Thanh toán thất bại'),
  });
}

export function useDeletePayment(billId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.payments.byBill(billId) });
      qc.invalidateQueries({ queryKey: queryKeys.bills.detail(billId) });
      qc.invalidateQueries({ queryKey: queryKeys.bills.all });
      toast.success('Xoá thanh toán thành công');
    },
    onError: () => toast.error('Xoá thanh toán thất bại'),
  });
}
