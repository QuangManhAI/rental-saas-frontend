'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/services/notifications.service';
import { toast } from 'sonner';

const QUERY_KEY = ['notifications'];

export function useNotifications(limit = 20) {
  return useQuery({
    queryKey: [...QUERY_KEY, limit],
    queryFn: () => notificationsService.findAll(limit),
    refetchInterval: 30_000, // poll every 30s
    staleTime: 10_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Đã đánh dấu tất cả đã đọc');
    },
  });
}
