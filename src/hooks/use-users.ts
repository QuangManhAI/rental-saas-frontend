'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usersService } from '@/services';
import { queryKeys, ROUTES } from '@/constants';
import type { CreateUserRequest, UpdateUserRequest } from '@/types';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => usersService.findAll(),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Tạo nhân viên thành công');
      router.push(ROUTES.USERS);
    },
    onError: () => toast.error('Tạo nhân viên thất bại'),
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      toast.success('Cập nhật nhân viên thành công');
      router.push(ROUTES.USERS);
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Xoá nhân viên thành công');
    },
    onError: () => toast.error('Xoá nhân viên thất bại'),
  });
}
