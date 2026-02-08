'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { tenantsService } from '@/services';
import { queryKeys, ROUTES } from '@/constants';
import type { CreateTenantRequest, UpdateTenantRequest } from '@/types';

export function useTenants() {
  return useQuery({
    queryKey: queryKeys.tenants.all,
    queryFn: () => tenantsService.findAll(),
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: queryKeys.tenants.detail(id),
    queryFn: () => tenantsService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateTenant() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tenants.all });
      toast.success('Thêm khách thuê thành công');
      router.push(ROUTES.TENANTS);
    },
    onError: () => toast.error('Thêm khách thuê thất bại'),
  });
}

export function useUpdateTenant(id: string) {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateTenantRequest) => tenantsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tenants.all });
      qc.invalidateQueries({ queryKey: queryKeys.tenants.detail(id) });
      toast.success('Cập nhật khách thuê thành công');
      router.push(ROUTES.TENANTS);
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
}

export function useDeleteTenant() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tenants.all });
      toast.success('Xoá khách thuê thành công');
    },
    onError: () => toast.error('Xoá khách thuê thất bại'),
  });
}
