'use client';

import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/use-notifications';
import { useTranslation } from '@/hooks/use-translation';
import { useI18nStore } from '@/stores/i18n.store';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';

export function NotificationBell() {
  const { t } = useTranslation();
  const locale = useI18nStore((s) => s.locale);
  const router = useRouter();

  const { data, isLoading } = useNotifications(10);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const unreadCount = data?.unreadCount ?? 0;
  const notifications = data?.data ?? [];

  const dateFnsLocale = locale === 'vi' ? vi : enUS;

  function handleClick(id: string, link?: string) {
    markRead.mutate(id);
    if (link) router.push(link);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 max-h-[480px] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-sm font-semibold">{t('notifications.title')}</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
            >
              {markAll.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="h-3 w-3 mr-1" />
              )}
              {t('notifications.markAllRead')}
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Bell className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-muted-foreground">
              {t('notifications.noNotifications')}
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n._id}
              className={cn(
                'flex flex-col items-start gap-1 px-3 py-3 cursor-pointer',
                !n.isRead && 'bg-indigo-50/50',
              )}
              onClick={() => handleClick(n._id, n.link)}
            >
              <div className="flex items-center gap-2 w-full">
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                )}
                <p className={cn('text-sm font-medium leading-tight', !n.isRead ? 'ml-0' : 'ml-4')}>
                  {n.title}
                </p>
              </div>
              <p className="text-xs text-muted-foreground ml-4 leading-snug">
                {n.message}
              </p>
              <p className="text-[10px] text-slate-400 ml-4">
                {formatDistanceToNow(new Date(n.createdAt), {
                  addSuffix: true,
                  locale: dateFnsLocale,
                })}
              </p>
            </DropdownMenuItem>
          ))
        )}

        {/* Footer */}
        <DropdownMenuSeparator />
        <div className="p-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8"
            onClick={() => router.push(ROUTES.NOTIFICATIONS)}
          >
            Xem tất cả & quản lý thông báo
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
