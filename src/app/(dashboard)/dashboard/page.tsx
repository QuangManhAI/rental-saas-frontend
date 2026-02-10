'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth.store';
import { useProperties } from '@/hooks/use-properties';
import { useRooms } from '@/hooks/use-rooms';
import { useContracts } from '@/hooks/use-contracts';
import { useBills } from '@/hooks/use-bills';
import { reportsService } from '@/services/reports.service';
import { RoomStatus, ContractStatus, BillStatus } from '@/types/enums';
import { formatCurrency } from '@/lib/utils';
import {
  Building2,
  DoorOpen,
  FileText,
  Receipt,
  FileSpreadsheet,
  Send,
  Download,
  Loader2,
  MessageCircle,
  Link,
} from 'lucide-react';
import { LoadingSkeleton } from '@/components/shared';
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';
import { toast } from 'sonner';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: properties, isLoading: pLoading } = useProperties();
  const { data: rooms, isLoading: rLoading } = useRooms();
  const { data: contracts, isLoading: cLoading } = useContracts();
  const { data: bills, isLoading: bLoading } = useBills();

  const [reportLoading, setReportLoading] = useState(false);

  const isLoading = pLoading || rLoading || cLoading || bLoading;

  // Default to current month/year (use 2024 for demo data)
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = 2024; // Demo data is for 2024

  // Construct Telegram link URL from user's ownerId
  const telegramLinkUrl = user?.ownerId
    ? `https://t.me/quangManhAI_bot?start=owner_${user.ownerId}`
    : '';

  /** Open Telegram bot to link */
  const handleLinkTelegram = () => {
    if (telegramLinkUrl) {
      window.open(telegramLinkUrl, '_blank');
      toast.info('Mở Telegram để liên kết. Nhấn START trong bot!');
    } else {
      toast.error('Không tìm thấy thông tin người dùng');
    }
  };

  /** Generate monthly report + send to Telegram */
  const handleSendReport = async () => {
    setReportLoading(true);
    try {
      const result = await reportsService.monthlyTelegram(
        currentMonth,
        currentYear,
      );

      if (result.telegram?.ok) {
        toast.success(
          `Đã gửi báo cáo tháng ${currentMonth}/${currentYear} qua Telegram!`,
        );
      } else {
        toast.warning('Báo cáo đã tạo nhưng gửi Telegram thất bại');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tạo báo cáo');
    } finally {
      setReportLoading(false);
    }
  };

  /** Download monthly Excel file */
  const handleDownloadReport = async () => {
    setReportLoading(true);
    try {
      const blob = await reportsService.downloadMonthlyExcel(currentMonth, currentYear);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${currentYear}_${String(currentMonth).padStart(2, '0')}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Đã tải xuống báo cáo');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải báo cáo');
    } finally {
      setReportLoading(false);
    }
  };

  if (isLoading) return <LoadingSkeleton rows={4} columns={4} />;

  const availableRooms =
    rooms?.filter((r) => r.status === RoomStatus.AVAILABLE).length ?? 0;
  const occupiedRooms =
    rooms?.filter((r) => r.status === RoomStatus.OCCUPIED).length ?? 0;
  const activeContracts =
    contracts?.filter((c) => c.status === ContractStatus.ACTIVE).length ?? 0;
  const unpaidBills =
    bills?.filter(
      (b) => b.status === BillStatus.UNPAID || b.status === BillStatus.PARTIAL,
    ) ?? [];
  const unpaidTotal = unpaidBills.reduce(
    (sum, b) => sum + (b.totalAmount - b.paidAmount),
    0,
  );

  const stats = [
    {
      label: 'Nhà trọ',
      value: properties?.length ?? 0,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100/50',
    },
    {
      label: 'Phòng trống / Tổng',
      value: `${availableRooms} / ${rooms?.length ?? 0}`,
      sub: `${occupiedRooms} đang thuê`,
      icon: DoorOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100/50',
    },
    {
      label: 'Hợp đồng đang hoạt động',
      value: activeContracts,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100/50',
    },
    {
      label: 'Hoá đơn chưa thu',
      value: `${unpaidBills.length} hoá đơn`,
      sub: formatCurrency(unpaidTotal),
      icon: Receipt,
      color: 'text-red-600',
      bgColor: 'bg-red-100/50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReport}
            disabled={reportLoading}
          >
            {reportLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Tải Excel
          </Button>

          <Button
            size="sm"
            onClick={handleSendReport}
            disabled={reportLoading}
          >
            {reportLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Gửi Telegram
          </Button>
        </div>
      </div>

      {/* Telegram Connection Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Liên kết Telegram</p>
              <p className="text-sm text-muted-foreground">
                Liên kết tài khoản Telegram để nhận báo cáo doanh thu
              </p>
            </div>
          </div>
          <Button size="sm" onClick={handleLinkTelegram}>
            <Link className="mr-2 h-4 w-4" />
            Liên kết mới
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-muted/40">
        <CardContent className="flex items-center gap-3 py-3">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          <span className="text-sm text-muted-foreground">
            Báo cáo tháng{' '}
            <span className="font-semibold text-foreground">
              {currentMonth}/{currentYear}
            </span>{' '}
            — Nhấn <strong>Tải Excel</strong> để tải xuống hoặc{' '}
            <strong>Gửi Telegram</strong> để gửi kèm thông báo.
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.sub && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.sub}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <DashboardAnalytics />
    </div>
  );
}
