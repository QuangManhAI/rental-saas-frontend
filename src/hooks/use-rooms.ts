'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { roomsService } from '@/services';
import { queryKeys, ROUTES } from '@/constants';
import type { CreateRoomRequest, UpdateRoomRequest } from '@/types';

export function useRooms(propertyId?: string) {
  return useQuery({
    queryKey: queryKeys.rooms.all(propertyId),
    queryFn: () => roomsService.findAll(propertyId),
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(id),
    queryFn: () => roomsService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateRoomRequest) => roomsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Tạo phòng thành công');
      router.push(ROUTES.ROOMS);
    },
    onError: () => toast.error('Tạo phòng thất bại'),
  });
}

export function useUpdateRoom(id: string) {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateRoomRequest) => roomsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Cập nhật phòng thành công');
      router.push(ROUTES.ROOMS);
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Xoá phòng thành công');
    },
    onError: () => toast.error('Xoá phòng thất bại'),
  });
}
