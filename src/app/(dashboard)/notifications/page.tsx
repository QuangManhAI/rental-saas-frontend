'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/hooks/use-notifications';
import {
  PageHeader,
  EmptyState,
  LoadingSkeleton,
  ConfirmDialog,
  RoleGuard,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateNotificationDialog } from '@/components/notifications/create-notification-dialog';
import { useI18nStore } from '@/stores/i18n.store';
import { NotificationType, Role } from '@/types/enums';
import {
  Plus,
  Bell,
  CheckCheck,
  Check,
  Search,
  ExternalLink,
  Filter,
  Megaphone,
  AlertCircle,
  Receipt,
  FileText,
  CheckCircle2,
  Inbox,
  Clock,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const locale = useI18nStore((s) => s.locale);
  const dateFnsLocale = locale === 'vi' ? vi : enUS;

  const { data, isLoading } = useNotifications(100);
  const markReadMut = useMarkNotificationRead();
  const markAllMut = useMarkAllNotificationsRead();
  const deleteMut = useDeleteNotification();

  const notifications = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Search filter
      const matchSearch =
        !searchTerm.trim() ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unread' && !item.isRead) ||
        (statusFilter === 'read' && item.isRead);

      // Type filter
      const matchType = typeFilter === 'all' || item.type === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [notifications, searchTerm, statusFilter, typeFilter]);

  // Quick stats
  const totalCount = notifications.length;
  const infoCount = notifications.filter((n) => n.type === NotificationType.INFO).length;
  const billCount = notifications.filter(
    (n) => n.type === NotificationType.BILL_DUE || n.type === NotificationType.NEW_BILL,
  ).length;

  const getTypeMeta = (type: string) => {
    switch (type) {
      case NotificationType.BILL_DUE:
        return {
          label: 'Hạn hoá đơn',
          icon: AlertCircle,
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          iconBg: 'bg-amber-100 text-amber-600',
        };
      case NotificationType.NEW_BILL:
        return {
          label: 'Hoá đơn mới',
          icon: Receipt,
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          iconBg: 'bg-purple-100 text-purple-600',
        };
      case NotificationType.PAYMENT_RECEIVED:
        return {
          label: 'Thanh toán',
          icon: CheckCircle2,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconBg: 'bg-emerald-100 text-emerald-600',
        };
      case NotificationType.CONTRACT_EXPIRING:
        return {
          label: 'Hạn hợp đồng',
          icon: FileText,
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          iconBg: 'bg-rose-100 text-rose-600',
        };
      case NotificationType.INFO:
      default:
        return {
          label: 'Thông báo chung',
          icon: Megaphone,
          color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          iconBg: 'bg-indigo-100 text-indigo-600',
        };
    }
  };

  return (
    <RoleGuard roles={[Role.OWNER]}>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Thông báo"
          description="Quản lý và phát thông báo hệ thống tới người thuê"
          actionLabel="Tạo thông báo"
          actionIcon={Plus}
          onAction={() => setOpenCreateDialog(true)}
        >
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllMut.mutate()}
              disabled={markAllMut.isPending}
              className="gap-1.5"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Đánh dấu tất cả đã đọc</span>
            </Button>
          )}
        </PageHeader>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Tổng thông báo
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {totalCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Bell className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Chưa đọc
                </p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {unreadCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Thông báo chung
                </p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {infoCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Megaphone className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Hoá đơn & Thu tiền
                </p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {billCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Receipt className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tiêu đề hoặc nội dung thông báo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50/50 border-slate-200"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-44 shrink-0">
            <Select
              value={statusFilter}
              onValueChange={(val: any) => setStatusFilter(val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="unread">Chưa đọc ({unreadCount})</SelectItem>
                <SelectItem value="read">Đã đọc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-48 shrink-0">
            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Loại thông báo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phân loại</SelectItem>
                <SelectItem value={NotificationType.INFO}>Thông báo chung</SelectItem>
                <SelectItem value={NotificationType.BILL_DUE}>Nhắc hoá đơn</SelectItem>
                <SelectItem value={NotificationType.NEW_BILL}>Hoá đơn mới</SelectItem>
                <SelectItem value={NotificationType.CONTRACT_EXPIRING}>Hạn hợp đồng</SelectItem>
                <SelectItem value={NotificationType.PAYMENT_RECEIVED}>Thanh toán</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
            <EmptyState
              title="Chưa có thông báo nào"
              description="Bạn chưa tạo thông báo nào. Nhấn 'Tạo thông báo' để bắt đầu phát tin cho hệ thống hoặc khách thuê."
              icon={<Bell className="h-12 w-12 text-indigo-400" />}
            />
            <Button
              onClick={() => setOpenCreateDialog(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Tạo thông báo đầu tiên
            </Button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
            <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-medium text-slate-800">
              Không tìm thấy thông báo phù hợp
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Thử thay đổi từ khoá tìm kiếm hoặc đặt lại các bộ lọc.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="mt-4"
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((item) => {
              const meta = getTypeMeta(item.type);
              const Icon = meta.icon;

              return (
                <div
                  key={item._id}
                  className={cn(
                    'group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200',
                    item.isRead
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-indigo-50/40 border-indigo-200/80 shadow-xs hover:border-indigo-300',
                  )}
                >
                  {/* Left: Type Icon + Content */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition',
                        meta.iconBg,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {!item.isRead && (
                          <span
                            className="h-2 w-2 rounded-full bg-indigo-600 shrink-0"
                            title="Chưa đọc"
                          />
                        )}
                        <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                          {item.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={cn('text-[11px] font-medium py-0 px-2', meta.color)}
                        >
                          {meta.label}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
                        <span>
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                            locale: dateFnsLocale,
                          })}
                        </span>
                        <span>•</span>
                        <span>
                          {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {item.link && (
                      <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                        <Link href={item.link}>
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Xem liên kết
                        </Link>
                      </Button>
                    )}

                    {!item.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        onClick={() => markReadMut.mutate(item._id)}
                        disabled={markReadMut.isPending}
                        title="Đánh dấu đã đọc"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Đã đọc
                      </Button>
                    )}

                    <ConfirmDialog
                      title="Xoá thông báo này?"
                      description="Thông báo sẽ bị gỡ bỏ vĩnh viễn khỏi danh sách."
                      onConfirm={() => deleteMut.mutate(item._id)}
                      loading={deleteMut.isPending}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Dialog Modal */}
        <CreateNotificationDialog
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
        />
      </div>
    </RoleGuard>
  );
}
