'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { propertiesService } from '@/services';
import { queryKeys, ROUTES } from '@/constants';
import type { CreatePropertyRequest, UpdatePropertyRequest } from '@/types';

export function useProperties() {
  return useQuery({
    queryKey: queryKeys.properties.all,
    queryFn: () => propertiesService.findAll(),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => propertiesService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreatePropertyRequest) => propertiesService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
      toast.success('Tạo nhà trọ thành công');
      router.push(ROUTES.PROPERTIES);
    },
    onError: () => toast.error('Tạo nhà trọ thất bại'),
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdatePropertyRequest) => propertiesService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
      qc.invalidateQueries({ queryKey: queryKeys.properties.detail(id) });
      toast.success('Cập nhật nhà trọ thành công');
      router.push(ROUTES.PROPERTIES);
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
      toast.success('Xoá nhà trọ thành công');
    },
    onError: () => toast.error('Xoá nhà trọ thất bại'),
  });
}
