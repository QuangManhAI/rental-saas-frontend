import api from '@/lib/axios';
import { NotificationType } from '@/types/enums';

export interface AppNotification {
  _id: string;
  ownerId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface NotificationsResponse {
  data: AppNotification[];
  unreadCount: number;
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

export const notificationsService = {
  findAll: (limit = 50): Promise<NotificationsResponse> =>
    api
      .get<{ data: NotificationsResponse }>('/notifications', { params: { limit } })
      .then((r) => r.data.data),

  create: (dto: CreateNotificationPayload): Promise<AppNotification> =>
    api.post<{ data: AppNotification }>('/notifications', dto).then((r) => r.data.data),

  markRead: (id: string): Promise<AppNotification> =>
    api.patch<{ data: AppNotification }>(`/notifications/${id}/read`).then((r) => r.data.data),

  markAllRead: (): Promise<{ modifiedCount: number }> =>
    api.patch<{ data: { modifiedCount: number } }>('/notifications/read-all').then((r) => r.data.data),

  delete: (id: string): Promise<AppNotification | null> =>
    api.delete<{ data: AppNotification | null }>(`/notifications/${id}`).then((r) => r.data.data),
};
