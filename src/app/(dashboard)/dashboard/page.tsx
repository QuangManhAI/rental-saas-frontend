'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth.store';
import { useProperties } from '@/hooks/use-properties';
import { useRooms } from '@/hooks/use-rooms';
import { useContracts } from '@/hooks/use-contracts';
import { useBills } from '@/hooks/use-bills';
import { reportsService } from '@/services/reports.service';
import { RoomStatus, ContractStatus, BillStatus } from '@/types/enums';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import {
  Building2,
  DoorOpen,
  FileText,
  Receipt,
  Download,
  Loader2,
  MessageCircle,
  Link as LinkIcon,
  Send,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Users,
  CalendarDays,
  Info,
} from 'lucide-react';
import { LoadingSkeleton } from '@/components/shared';
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';
import { toast } from 'sonner';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const { data: properties, isLoading: pLoading } = useProperties();
  const { data: rooms, isLoading: rLoading } = useRooms();
  const { data: contracts, isLoading: cLoading } = useContracts();
  const { data: bills, isLoading: bLoading } = useBills();

  const isLoading = pLoading || rLoading || cLoading || bLoading;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Month-picker dialog state
  type DialogMode = 'telegram' | 'download';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('telegram');
  const [pickedMonth, setPickedMonth] = useState(currentMonth);
  const [pickedYear, setPickedYear] = useState(currentYear);
  const [reportLoading, setReportLoading] = useState(false);

  const isPickedPartial = pickedMonth === currentMonth && pickedYear === currentYear;

  const openDialog = (mode: DialogMode) => {
    setPickedMonth(currentMonth);
    setPickedYear(currentYear);
    setDialogMode(mode);
    setDialogOpen(true);
  };

  const ownerId = user?.ownerId || user?._id;
  const telegramLinkUrl = ownerId
    ? `https://t.me/quangManhAI_bot?start=owner_${ownerId}`
    : '';

  const handleLinkTelegram = () => {
    if (telegramLinkUrl) {
      window.open(telegramLinkUrl, '_blank');
      toast.info('Mở Telegram để liên kết. Nhấn START trong bot!');
    } else {
      toast.error('Không tìm thấy thông tin người dùng');
    }
  };

  const handleConfirmReport = async () => {
    setReportLoading(true);
    setDialogOpen(false);
    try {
      if (dialogMode === 'telegram') {
        const result = await reportsService.monthlyTelegram(pickedMonth, pickedYear);
        if (result.telegram?.ok) {
          toast.success(`Đã gửi báo cáo tháng ${pickedMonth}/${pickedYear} qua Telegram!`);
        } else {
          toast.warning('Báo cáo đã tạo nhưng gửi Telegram thất bại');
        }
      } else {
        const blob = await reportsService.downloadMonthlyExcel(pickedMonth, pickedYear);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${pickedYear}_${String(pickedMonth).padStart(2, '0')}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Đã tải xuống báo cáo');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tạo báo cáo');
    } finally {
      setReportLoading(false);
    }
  };

  // Available years: current year and 2 years back
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  if (isLoading) return <LoadingSkeleton rows={4} columns={4} />;

  const allRooms = rooms ?? [];
  const availableRooms = allRooms.filter((r) => r.status === RoomStatus.AVAILABLE).length;
  const occupiedRooms = allRooms.filter((r) => r.status === RoomStatus.OCCUPIED).length;
  const totalRooms = allRooms.length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const activeContracts = contracts?.filter((c) => c.status === ContractStatus.ACTIVE).length ?? 0;

  const allBills = bills ?? [];
  const unpaidBills = allBills.filter(
    (b) => b.status === BillStatus.UNPAID || b.status === BillStatus.PARTIAL,
  );
  const unpaidTotal = unpaidBills.reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0);
  const overdueBills = allBills.filter((b) => b.status === BillStatus.OVERDUE);

  const stats = [
    {
      label: t('dashboard.properties'),
      value: properties?.length ?? 0,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: null as null | 'up' | 'down',
      sub: null as null | string,
    },
    {
      label: t('dashboard.roomsAvailable'),
      value: `${availableRooms} / ${totalRooms}`,
      sub: `${occupancyRate}% lấp đầy`,
      icon: DoorOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: (occupancyRate >= 70 ? 'up' : 'down') as 'up' | 'down',
    },
    {
      label: t('dashboard.activeContracts'),
      value: activeContracts,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: null as null | 'up' | 'down',
      sub: null as null | string,
    },
    {
      label: t('dashboard.unpaidBills'),
      value: `${unpaidBills.length} ${t('dashboard.bills')}`,
      sub: formatCurrency(unpaidTotal),
      icon: Receipt,
      color: unpaidBills.length > 0 ? 'text-red-600' : 'text-slate-500',
      bgColor: unpaidBills.length > 0 ? 'bg-red-50' : 'bg-slate-50',
      borderColor: unpaidBills.length > 0 ? 'border-red-200' : 'border-slate-200',
      trend: (unpaidBills.length > 0 ? 'down' : null) as null | 'down',
    },
  ];

  const quickActions = [
    {
      label: t('dashboard.addRoom'),
      href: ROUTES.ROOM_NEW,
      icon: DoorOpen,
      color: 'text-green-600 bg-green-50 hover:bg-green-100',
    },
    {
      label: t('dashboard.createBill'),
      href: ROUTES.BILL_NEW,
      icon: Receipt,
      color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
    },
    {
      label: t('dashboard.addTenant'),
      href: ROUTES.TENANT_NEW,
      icon: Users,
      color: 'text-orange-600 bg-orange-50 hover:bg-orange-100',
    },
    {
      label: t('dashboard.addContract'),
      href: ROUTES.CONTRACT_NEW,
      icon: FileText,
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.title')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {t('dashboard.reportMonth')} {currentMonth}/{currentYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDialog('download')}
            disabled={reportLoading}
          >
            {reportLoading && dialogMode === 'download' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            <span className="hidden sm:inline">{t('dashboard.downloadExcel')}</span>
          </Button>

          <Button size="sm" onClick={() => openDialog('telegram')} disabled={reportLoading}>
            {reportLoading && dialogMode === 'telegram' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            <span className="hidden sm:inline">{t('dashboard.sendTelegram')}</span>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={cn('border', stat.borderColor)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.label}
              </CardTitle>
              <div className={cn('p-2 rounded-full', stat.bgColor)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              {stat.sub && (
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === 'up' && (
                    <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                  )}
                  {stat.trend === 'down' && (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  )}
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: alerts + analytics */}
        <div className="lg:col-span-2 space-y-4">
          {/* Telegram link card */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">
                    {t('dashboard.telegramLink')}
                  </p>
                  <p className="text-sm text-slate-500">
                    {t('dashboard.telegramDesc')}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={handleLinkTelegram}>
                <LinkIcon className="mr-2 h-4 w-4" />
                {t('dashboard.linkNew')}
              </Button>
            </CardContent>
          </Card>

          {/* Overdue bills alert */}
          {overdueBills.length > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-red-600 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">
                      {overdueBills.length} hoá đơn quá hạn
                    </p>
                    <p className="text-sm text-slate-500">
                      Tổng:{' '}
                      {formatCurrency(
                        overdueBills.reduce(
                          (s, b) => s + b.totalAmount - b.paidAmount,
                          0,
                        ),
                      )}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={ROUTES.BILLS}>Xem ngay</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Analytics charts */}
          <DashboardAnalytics />
        </div>

        {/* Right: quick actions + report */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {t('dashboard.quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl p-4 transition-colors text-center',
                    action.color,
                  )}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-xs font-medium leading-tight">
                    {action.label}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-muted/40">
            <CardContent className="flex items-start gap-3 py-4">
              <FileSpreadsheet className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t('dashboard.reportHint')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Month-picker dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-indigo-600" />
              {dialogMode === 'telegram' ? 'Gửi báo cáo qua Telegram' : 'Tải xuống báo cáo Excel'}
            </DialogTitle>
            <DialogDescription>
              Chọn tháng và năm muốn xuất báo cáo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tháng</Label>
                <Select
                  value={String(pickedMonth)}
                  onValueChange={(v) => setPickedMonth(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_NAMES.map((name, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Năm</Label>
                <Select
                  value={String(pickedYear)}
                  onValueChange={(v) => setPickedYear(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isPickedPartial && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-sm text-amber-800">
                <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                <span>
                  Tháng {pickedMonth}/{pickedYear} chưa kết thúc —{' '}
                  báo cáo sẽ xuất từ <strong>01/{String(pickedMonth).padStart(2, '0')}</strong>{' '}
                  đến <strong>{String(now.getDate()).padStart(2, '0')}/{String(pickedMonth).padStart(2, '0')}</strong>.
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleConfirmReport} disabled={reportLoading}>
              {reportLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : dialogMode === 'telegram' ? (
                <Send className="mr-2 h-4 w-4" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {dialogMode === 'telegram' ? 'Gửi Telegram' : 'Tải xuống'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
