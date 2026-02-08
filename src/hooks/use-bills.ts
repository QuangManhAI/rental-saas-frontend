'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { billsService } from '@/services';
import { queryKeys, ROUTES } from '@/constants';
import type { CreateBillRequest } from '@/types';

export function useBills() {
  return useQuery({
    queryKey: queryKeys.bills.all,
    queryFn: () => billsService.findAll(),
  });
}

export function useBill(id: string) {
  return useQuery({
    queryKey: queryKeys.bills.detail(id),
    queryFn: () => billsService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateBill() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateBillRequest) => billsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bills.all });
      toast.success('Tạo hoá đơn thành công');
      router.push(ROUTES.BILLS);
    },
    onError: () => toast.error('Tạo hoá đơn thất bại'),
  });
}

export function useDeleteBill() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => billsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bills.all });
      toast.success('Xoá hoá đơn thành công');
    },
    onError: () => toast.error('Xoá hoá đơn thất bại'),
  });
}
