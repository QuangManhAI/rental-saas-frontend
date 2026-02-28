'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Check, X as XIcon, Crown, Zap, Sparkles,
  Building2, Home, Users, Clock, Info,
  CreditCard, Banknote, ChevronDown, ChevronUp, ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/* ─── Types ─── */

interface Subscription {
  _id: string;
  plan: 'free' | 'basic' | 'pro';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  roomLimit: number;
  propertyLimit: number;
  staffLimit: number;
  features: string[];
}

/** Returned by GET /subscriptions/usage */
interface UsageData {
  plan: 'free' | 'basic' | 'pro';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt: string | null;
  propertyCount: number;
  roomCount: number;
  staffCount: number;
  propertyLimit: number;
  roomLimit: number;
  staffLimit: number;
}

interface UpgradeRequest {
  _id: string;
  fromPlan: string;
  toPlan: string;
  months: number;
  amount: number;
  paymentMethod: 'momo' | 'bank_transfer';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

/* ─── Plan config (mirrors landing page exactly) ─── */

const PLAN_ORDER: Record<string, number> = { free: 0, basic: 1, pro: 2 };

const PLANS = [
  {
    key: 'free' as const,
    name: 'Miễn phí',
    price: '0',
    priceNum: 0,
    period: 'mãi mãi',
    desc: 'Dùng thử không giới hạn thời gian',
    highlight: false,
    badge: null as string | null,
    features: ['1 tòa nhà', '10 phòng', 'Hóa đơn & thanh toán cơ bản', 'Cổng thông tin khách thuê', 'Xuất PDF'],
    cta: 'Bắt đầu miễn phí',
  },
  {
    key: 'basic' as const,
    name: 'Cơ bản',
    price: '199.000',
    priceNum: 199000,
    period: 'tháng',
    desc: 'Cho chủ nhà từ 2–5 tòa nhà',
    highlight: true,
    badge: 'Phổ biến nhất' as string | null,
    features: ['5 tòa nhà', '50 phòng', 'Thông báo Telegram', 'Báo cáo doanh thu', 'VNPay + VietQR', 'Email tự động', '2 tài khoản nhân viên'],
    cta: 'Nâng cấp lên Cơ bản',
  },
  {
    key: 'pro' as const,
    name: 'Chuyên nghiệp',
    price: '499.000',
    priceNum: 499000,
    period: 'tháng',
    desc: 'Cho nhà đầu tư quy mô lớn',
    highlight: false,
    badge: null as string | null,
    features: ['Không giới hạn tòa nhà', 'Không giới hạn phòng', 'Tất cả tính năng Cơ bản', 'API tích hợp', 'Nhân viên không giới hạn', 'Hỗ trợ ưu tiên 24/7'],
    cta: 'Nâng cấp lên Chuyên nghiệp',
  },
];

const PLAN_ICONS: Record<string, React.ElementType> = { free: Sparkles, basic: Zap, pro: Crown };

const STATUS_META: Record<string, { label: string; color: string }> = {
  active:    { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700' },
  trial:     { label: 'Dùng thử',        color: 'bg-blue-100 text-blue-700'  },
  expired:   { label: 'Hết hạn',        color: 'bg-red-100 text-red-700'    },
  cancelled: { label: 'Đã hủy',         color: 'bg-gray-100 text-gray-500'  },
};

const PAYMENT_METHODS = [
  { key: 'momo'          as const, label: 'Ví MoMo',               icon: CreditCard, desc: 'Chuyển khoản qua ví MoMo',    color: 'text-pink-600',    bg: 'bg-pink-50 border-pink-200',      sel: 'bg-pink-50 border-pink-500 ring-2 ring-pink-200'    },
  { key: 'bank_transfer' as const, label: 'Chuyển khoản ngân hàng', icon: Banknote,   desc: 'Chuyển khoản qua VietQR',    color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', sel: 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200' },
];

const MONTH_OPTIONS = [
  { value: 1,  label: '1 tháng',  discount: null    },
  { value: 3,  label: '3 tháng',  discount: '–5%'   },
  { value: 6,  label: '6 tháng',  discount: '–10%'  },
  { value: 12, label: '12 tháng', discount: '–15%'  },
];

/* ─── Helpers ─── */

function daysUntil(d: string) { return Math.max(0, Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)); }
function fmtCurrency(n: number) { return n.toLocaleString('vi-VN') + '₫'; }
function fmtDate(d?: string) { return d ? new Date(d).toLocaleDateString('vi-VN') : '—'; }
function safeLimit(n: number | undefined) { return n ?? 10; }
function fmtLimit(n: number) { return n === -1 ? '∞' : String(n); }

/* ─── Usage bar ─── */

function UsageBar({ label, used, limit, icon: Icon }: {
  label: string; used: number; limit: number; icon: React.ElementType;
}) {
  const lim = safeLimit(limit);
  const unlimited = lim === -1;
  const pct = unlimited ? 0 : lim > 0 ? Math.min(100, (used / lim) * 100) : 0;
  const bar = pct >= 95 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-indigo-500';
  const txt = pct >= 95 ? 'text-red-600' : pct >= 80 ? 'text-amber-600' : 'text-gray-700';

  return (
    /*
     * Fix A — overflow root cause:
     *   Old: icon (32px) + gap (12px) = 44px margin offset on bar,
     *        combined with w-full → bar width = 100% + 44px → overflows.
     *
     * Fix: icon sits as a shrink-0 sibling; content column uses flex-1 + min-w-0.
     *   min-w-0 overrides flexbox's default min-width:auto, allowing the child
     *   to shrink below its content size. The bar then lives entirely inside
     *   the content column and w-full = 100% of that column — never the parent.
     */
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-indigo-600" />
      </div>

      {/* flex-1 min-w-0: content column can shrink; bar stays inside */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-700 truncate">{label}</p>
          <span className={cn('text-sm font-semibold shrink-0', txt)}>
            {unlimited ? `${used} (∞)` : `${used} / ${fmtLimit(lim)}`}
          </span>
        </div>
        {!unlimited && (
          /* w-full here = 100% of the flex-1 column — never overflows */
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-200">
            <div
              className={cn('h-1.5 rounded-full transition-all duration-300', bar)}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Upgrade Dialog ─── */

function UpgradeDialog({ open, onClose, fromPlan, toPlan }: {
  open: boolean; onClose: () => void; fromPlan: string; toPlan: string;
}) {
  const [months, setMonths] = useState(1);
  const [method, setMethod] = useState<'momo' | 'bank_transfer'>('bank_transfer');
  const qc = useQueryClient();

  const plan = PLANS.find((p) => p.key === toPlan)!;
  const from = PLANS.find((p) => p.key === fromPlan);
  const total = (plan?.priceNum ?? 0) * months;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (method === 'momo') {
        // MoMo: create payment and redirect to MoMo
        const res = await api.post('/subscriptions/create-momo-payment', { toPlan, months });
        return res.data.data ?? res.data;
      }
      // Bank transfer: submit upgrade request for admin approval
      const res = await api.post('/subscriptions/request-upgrade', { toPlan, months, paymentMethod: method });
      return res.data;
    },
    onSuccess: (data: any) => {
      if (method === 'momo' && data?.payUrl) {
        toast.success('Đang chuyển đến MoMo...');
        window.location.href = data.payUrl;
        return;
      }
      toast.success('Yêu cầu nâng cấp đã gửi! Admin sẽ xét duyệt trong 24h.');
      qc.invalidateQueries({ queryKey: ['subscription', 'payment-history'] });
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Lỗi khi gửi yêu cầu'),
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Nâng cấp gói dịch vụ</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {from?.name ?? fromPlan} → <span className="font-semibold text-indigo-600">{plan?.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Plan preview */}
          <div className={cn('rounded-xl p-4 border', plan?.highlight ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-50 border-gray-200')}>
            <p className={cn('text-sm font-semibold', plan?.highlight ? 'text-indigo-100' : 'text-gray-500')}>{plan?.name}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={cn('text-2xl font-extrabold', plan?.highlight ? 'text-white' : 'text-gray-900')}>{plan?.price}đ</span>
              <span className={cn('text-sm', plan?.highlight ? 'text-indigo-200' : 'text-gray-500')}>/{plan?.period}</span>
            </div>
          </div>

          {/* Months */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Thời hạn</p>
            <div className="grid grid-cols-4 gap-2">
              {MONTH_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setMonths(opt.value)}
                  className={cn('relative flex flex-col items-center rounded-xl border py-2.5 text-sm font-medium transition-all',
                    months === opt.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100' : 'border-gray-200 text-gray-600 hover:border-indigo-300',
                  )}
                >
                  {opt.label}
                  {opt.discount && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-green-100 text-green-700 text-[10px] font-bold px-1.5 whitespace-nowrap">
                      {opt.discount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Phương thức thanh toán</p>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((m) => {
                const MI = m.icon;
                const sel = method === m.key;
                return (
                  <button key={m.key} onClick={() => setMethod(m.key)}
                    className={cn('flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all', sel ? m.sel : m.bg)}
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', sel ? 'bg-white' : 'bg-white/70')}>
                      <MI className={cn('w-4 h-4', m.color)} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 leading-tight">{m.label}</p>
                      <p className="text-[11px] text-gray-500">{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
            <span className="text-sm font-medium text-gray-600">Tổng cộng</span>
            <span className="text-xl font-extrabold text-indigo-600">{fmtCurrency(total)}</span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            {method === 'momo'
              ? 'Bạn sẽ được chuyển đến MoMo để thanh toán. Gói sẽ tự động kích hoạt sau khi thanh toán thành công.'
              : 'Admin sẽ xác nhận thanh toán và kích hoạt trong vòng 24 giờ. Bạn sẽ nhận email khi được duyệt.'}
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-5">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>Hủy</Button>
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => mutate()} disabled={isPending}>
            {isPending
              ? (method === 'momo' ? 'Đang xử lý...' : 'Đang gửi...')
              : (method === 'momo' ? 'Thanh toán MoMo' : 'Gửi yêu cầu')}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Payment History ─── */

const REQ_STATUS: Record<string, { label: string; color: string }> = {
  pending:  { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Đã duyệt',  color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Từ chối',   color: 'bg-red-100 text-red-700'     },
};
const PLAN_LBL: Record<string, string> = { free: 'Miễn phí', basic: 'Cơ bản', pro: 'Chuyên nghiệp' };
const METHOD_LBL: Record<string, string> = { momo: 'MoMo', bank_transfer: 'Chuyển khoản' };

function PaymentHistory() {
  const [open, setOpen] = useState(false);
  const { data: history, isLoading } = useQuery<UpgradeRequest[]>({
    queryKey: ['subscription', 'payment-history'],
    queryFn: () => api.get('/subscriptions/payment-history').then((r) => r.data.data),
    staleTime: 60_000,
  });

  if (isLoading) return <Skeleton className="h-10 w-48 rounded-lg" />;
  if (!history?.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 mb-4 group">
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        Lịch sử yêu cầu nâng cấp ({history.length})
      </button>
      {open && (
        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Ngày', 'Gói', 'Số tiền', 'Phương thức', 'Trạng thái'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((row) => {
                const s = REQ_STATUS[row.status] ?? REQ_STATUS.pending;
                return (
                  <tr key={row._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{fmtDate(row.createdAt)}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      {PLAN_LBL[row.fromPlan] ?? row.fromPlan} → {PLAN_LBL[row.toPlan] ?? row.toPlan}
                      <span className="ml-1.5 text-xs text-gray-400">({row.months}th)</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">{fmtCurrency(row.amount)}</td>
                    <td className="px-5 py-3.5 text-gray-600">{METHOD_LBL[row.paymentMethod] ?? row.paymentMethod}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', s.color)}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Page ─── */

export default function SubscriptionStandalonePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [upgradeTarget, setUpgradeTarget] = useState<string | null>(null);
  const [downgradeConfirm, setDowngradeConfirm] = useState(false);

  // Auth guard
  useEffect(() => {
    if (user === null) router.replace('/login');
  }, [user, router]);

  const { data: sub, isLoading: subLoading } = useQuery<Subscription>({
    queryKey: ['subscription', 'my'],
    queryFn: () => api.get('/subscriptions/my').then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });

  // Single endpoint: DB counts + plan limits returned atomically
  const { data: usage, isLoading: usageLoading } = useQuery<UsageData>({
    queryKey: ['subscription', 'usage'],
    queryFn: () => api.get('/subscriptions/usage').then((r) => r.data.data),
    staleTime: 60 * 1000,
    enabled: !!user,
  });

  // On trial, effective plan = BASIC (user has BASIC limits during trial)
  const currentStatus = usage?.status ?? sub?.status;
  const effectivePlan = currentStatus === 'trial' ? 'basic' : (usage?.plan ?? sub?.plan ?? 'free');
  const planMeta      = PLANS.find((p) => p.key === effectivePlan) ?? PLANS[0];
  const PlanIcon      = PLAN_ICONS[effectivePlan] ?? Sparkles;
  const statusMeta    = STATUS_META[currentStatus ?? 'active'] ?? STATUS_META.active;
  // Counts and limits come exclusively from the usage endpoint
  const propertyCount = usage?.propertyCount ?? 0;
  const roomCount     = usage?.roomCount     ?? 0;
  const staffCount    = usage?.staffCount    ?? 0;
  const propertyLimit = usage?.propertyLimit ?? sub?.propertyLimit ?? 1;
  const roomLimit     = usage?.roomLimit     ?? sub?.roomLimit     ?? 10;
  const staffLimit    = usage?.staffLimit    ?? sub?.staffLimit    ?? 1;
  const trialEndsAt   = usage?.trialEndsAt ?? sub?.trialEndsAt ?? null;
  const trialDays     = currentStatus === 'trial' && trialEndsAt ? daysUntil(trialEndsAt) : null;
  const isPageLoading = subLoading || usageLoading;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Rental SaaS</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại dashboard
          </Link>
        </div>
      </nav>

      {/* ── Page hero ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gói dịch vụ của bạn</h1>
          <p className="mt-1 text-gray-500 text-base">Xem trạng thái hiện tại và nâng cấp khi cần</p>
        </div>
      </div>

      <div className="py-10 space-y-10">

        {/* ── Current plan card ── */}
        {isPageLoading ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : sub ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6">

            {/* Trial / expired banners */}
            {trialDays !== null && (
              <div className="flex items-center gap-3 rounded-2xl bg-blue-50 border border-blue-200 px-5 py-3.5 mb-5">
                <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="flex-1 text-sm text-blue-800 font-medium">
                  {trialDays > 0
                    ? `Đang dùng thử gói Cơ bản — còn ${trialDays} ngày (hết hạn ${fmtDate(sub.trialEndsAt)})`
                    : 'Gói dùng thử đã hết hạn. Tài khoản sẽ chuyển về gói Miễn phí.'}
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" onClick={() => setUpgradeTarget('basic')}>
                  Nâng cấp ngay
                </Button>
              </div>
            )}
            {sub.status === 'expired' && (
              <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-5 py-3.5 mb-5">
                <Info className="w-5 h-5 text-red-500 shrink-0" />
                <p className="flex-1 text-sm text-red-800 font-medium">
                  Gói dịch vụ đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng đầy đủ tính năng.
                </p>
                <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 shrink-0" onClick={() => setUpgradeTarget('basic')}>
                  Gia hạn
                </Button>
              </div>
            )}

            {/* Plan summary card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center',
                    sub.plan === 'pro' ? 'bg-purple-100' : sub.plan === 'basic' ? 'bg-blue-100' : 'bg-gray-100',
                  )}>
                    <PlanIcon className={cn('w-7 h-7',
                      sub.plan === 'pro' ? 'text-purple-600' : sub.plan === 'basic' ? 'text-blue-600' : 'text-gray-500',
                    )} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl font-bold text-gray-900">{planMeta.name}</h2>
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', statusMeta.color)}>
                        {statusMeta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      {sub.currentPeriodStart && <span>Từ: {fmtDate(sub.currentPeriodStart)}</span>}
                      {sub.currentPeriodEnd && sub.plan !== 'free' && <span>Đến: {fmtDate(sub.currentPeriodEnd)}</span>}
                      {trialDays !== null && <span className="text-blue-600 font-semibold">Còn {trialDays} ngày dùng thử</span>}
                    </div>
                  </div>
                </div>
                {effectivePlan !== 'pro' && (
                  <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setUpgradeTarget(effectivePlan === 'free' ? 'basic' : 'pro')}>
                    Nâng cấp gói
                  </Button>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <UsageBar label="Tòa nhà"  used={propertyCount} limit={propertyLimit} icon={Building2} />
                <UsageBar label="Phòng"    used={roomCount}     limit={roomLimit}     icon={Home} />
                <UsageBar label="Nhân viên" used={staffCount}   limit={staffLimit}    icon={Users} />
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Pricing cards — exact landing page style ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Chọn gói phù hợp</h2>
            <p className="mt-2 text-gray-500">Nâng cấp bất cứ lúc nào, huỷ khi không cần</p>
          </div>

          {isPageLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {PLANS.map((plan) => {
                const isCurrent = plan.key === effectivePlan;
                const isUpgrade = sub ? PLAN_ORDER[plan.key] > PLAN_ORDER[effectivePlan] : true;

                return (
                  <div
                    key={plan.key}
                    className={cn(
                      'rounded-2xl p-6 border relative',
                      plan.highlight
                        ? 'border-indigo-500 shadow-xl shadow-indigo-100 bg-indigo-600 text-white'
                        : 'border-gray-200 bg-white shadow-sm md:mt-5',
                        plan.key === 'free' && 'md:min-h-[420px]',
                      isCurrent && !plan.highlight && 'ring-2 ring-offset-2 ring-indigo-400',
                    )}
                  >
                    {/* Badge */}
                    {plan.badge && !isCurrent && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <Badge className="bg-amber-400 text-amber-900 border-amber-300 shadow-sm px-3 py-1 text-xs font-bold">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <Badge className={cn('shadow-sm px-3 py-1 text-xs font-bold',
                          plan.highlight ? 'bg-white text-indigo-700 border-indigo-200' : 'bg-indigo-600 text-white border-indigo-500',
                        )}>
                          Gói hiện tại
                        </Badge>
                      </div>
                    )}

                    <p className={cn('font-semibold mt-2', plan.highlight ? 'text-indigo-100' : 'text-gray-500')}>{plan.name}</p>
                    <div className="mt-2 flex items-end gap-1">
                      <span className={cn('text-4xl font-extrabold', plan.highlight ? 'text-white' : 'text-gray-900')}>{plan.price}đ</span>
                      <span className={cn('mb-1', plan.highlight ? 'text-indigo-200' : 'text-gray-500')}>/{plan.period}</span>
                    </div>
                    <p className={cn('mt-2 text-sm', plan.highlight ? 'text-indigo-200' : 'text-gray-500')}>{plan.desc}</p>

                    <div className="mt-6">
                      {isCurrent ? (
                        <Button disabled className={cn('w-full', plan.highlight ? 'bg-white/20 text-white border border-white/30' : 'bg-gray-100 text-gray-500')}>
                          Đang sử dụng
                        </Button>
                      ) : isUpgrade ? (
                        <Button
                          className={cn('w-full', plan.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700')}
                          onClick={() => setUpgradeTarget(plan.key)}
                        >
                          {plan.cta}
                        </Button>
                      ) : (
                        <Button variant="outline" className={cn('w-full', plan.highlight ? 'border-white/40 text-black hover:bg-white/10' : 'border-gray-300 text-gray-500')}
                          onClick={() => setDowngradeConfirm(true)}
                        >
                          Nâng cấp
                        </Button>
                      )}
                    </div>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-3 text-sm">
                          <div className={cn('w-4 h-4 rounded-full flex items-center justify-center shrink-0', plan.highlight ? 'bg-indigo-400' : 'bg-indigo-50')}>
                            <Check className={cn('w-2.5 h-2.5', plan.highlight ? 'text-white' : 'text-indigo-600')} />
                          </div>
                          <span className={plan.highlight ? 'text-indigo-100' : 'text-gray-700'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Payment history ── */}
        <PaymentHistory />

      </div>

      {/* ── Dialogs ── */}
      {upgradeTarget && sub && (
        <UpgradeDialog open onClose={() => setUpgradeTarget(null)} fromPlan={sub.plan} toPlan={upgradeTarget} />
      )}

      {downgradeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hạ cấp gói?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Để hạ cấp xuống gói thấp hơn, vui lòng liên hệ admin. Dữ liệu của bạn sẽ được giữ nguyên.
            </p>
            <div className="flex gap-3 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => setDowngradeConfirm(false)}>Đóng</Button>
              <Button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white" onClick={() => setDowngradeConfirm(false)}>Đã hiểu</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
