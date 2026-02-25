import api from '@/lib/axios';

export interface AppNotification {
  _id: string;
  ownerId: string;
  type: string;
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

export const notificationsService = {
  findAll: (limit = 20): Promise<NotificationsResponse> =>
    api
      .get<{ data: NotificationsResponse }>('/notifications', { params: { limit } })
      .then((r) => r.data.data),

  markRead: (id: string): Promise<AppNotification> =>
    api.patch<{ data: AppNotification }>(`/notifications/${id}/read`).then((r) => r.data.data),

  markAllRead: (): Promise<{ modifiedCount: number }> =>
    api.patch<{ data: { modifiedCount: number } }>('/notifications/read-all').then((r) => r.data.data),
};
