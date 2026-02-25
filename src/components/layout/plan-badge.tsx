'use client';

import { useQuery } from '@tanstack/react-query';
import { Sparkles, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useAuthStore } from '@/stores/auth.store';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import api from '@/lib/axios';

interface Subscription {
  plan: 'free' | 'basic' | 'pro';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt?: string;
  roomLimit: number;
}

const PLAN_META = {
  free: {
    label: 'Miễn phí',
    shortLabel: 'FREE',
    icon: Sparkles,
    chipBg: 'bg-gray-100',
    chipText: 'text-gray-600',
  },
  basic: {
    label: 'Cơ bản',
    shortLabel: 'BASIC',
    icon: Zap,
    chipBg: 'bg-blue-100',
    chipText: 'text-blue-700',
  },
  pro: {
    label: 'Chuyên nghiệp',
    shortLabel: 'PRO',
    icon: Crown,
    chipBg: 'bg-purple-100',
    chipText: 'text-purple-700',
  },
};

function daysUntil(dateStr: string): number {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}

export function PlanBadge() {
  const { collapsed } = useSidebarStore();
  const user = useAuthStore((s) => s.user);

  const { data: usage } = useQuery({
  queryKey: ['subscription', 'usage'],
  queryFn: () =>
    api.get('/subscriptions/usage').then((r) => r.data.data),
  staleTime: 5 * 60 * 1000,
});

  const { data: sub } = useQuery<Subscription>({
    queryKey: ['subscription', 'my'],
    queryFn: () => api.get('/subscriptions/my').then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const avatarLetter = user?.fullName?.[0]?.toUpperCase() ?? 'U';

  /* ── Loading skeleton ── */
  if (!sub) {
    if (collapsed) {
      return (
        <div className="flex items-center justify-center py-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
        </div>
      );
    }
    return <div className="mx-2 mb-2 h-[88px] rounded-xl bg-slate-50 animate-pulse" />;
  }

  const meta = PLAN_META[sub.plan] ?? PLAN_META.free;
  const Icon = meta.icon;

  /* ── Derived values ── */
  const roomCount = usage?.roomCount ?? 0;
  const roomLimit = usage?.roomLimit ?? sub.roomLimit ?? 10;
  const isUnlimited = roomLimit === -1;
  const pct = isUnlimited ? 0 : roomLimit > 0 ? Math.min(100, (roomCount / roomLimit) * 100) : 0;
  const barColorClass = pct >= 95 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-indigo-500';
  const countColor = pct >= 95 ? 'text-red-600' : pct >= 80 ? 'text-amber-600' : 'text-slate-600';

  const isTrial = sub.status === 'trial';
  const isExpired = sub.status === 'expired';
  const isPro = sub.plan === 'pro';
  const trialDays = isTrial && sub.trialEndsAt ? daysUntil(sub.trialEndsAt) : null;

  /* ── Collapsed: avatar + plan icon, tooltip shows name + plan ── */
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/subscription"
            className="flex flex-col items-center gap-1 py-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {avatarLetter}
            </div>
            <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', meta.chipBg)}>
              <Icon className={cn('w-3.5 h-3.5', meta.chipText)} />
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="leading-tight">
          <p className="font-semibold text-sm">{user?.fullName ?? 'Người dùng'}</p>
          <p className="text-xs opacity-70">
            {isTrial ? `Dùng thử · ${trialDays} ngày còn lại` : meta.label}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  /* ── Expanded: combined user + plan card ── */
  return (
    <Link
      href="/subscription"
      className={cn(
        'mx-2 mb-2 block rounded-xl border px-3 py-3 transition-all hover:shadow-sm',
        isExpired
          ? 'border-red-200 bg-red-50/50 hover:border-red-300'
          : isTrial
            ? 'border-blue-200 bg-blue-50/50 hover:border-blue-300'
            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300',
      )}
    >
      {/* Row 1: avatar + name + plan chip */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
          {avatarLetter}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
              {user?.fullName ?? '—'}
            </p>
            <span className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 leading-none',
              isExpired ? 'bg-red-100 text-red-600'
                : isTrial ? 'bg-blue-100 text-blue-700'
                  : cn(meta.chipBg, meta.chipText),
            )}>
              {isExpired ? 'HẾT HẠN' : isTrial ? 'TRIAL' : meta.shortLabel}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate leading-tight">{user?.email ?? ''}</p>
        </div>
      </div>

      {/* Row 2: room usage */}
      <div className="mt-2.5">
        <div className="flex items-center justify-between mb-1">
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <Icon className={cn('w-3 h-3', meta.chipText)} />
            Phòng
          </span>
          <span className={cn('text-[11px] font-semibold', countColor)}>
            {isUnlimited ? `${roomCount} (không giới hạn)` : `${roomCount} / ${roomLimit}`}
          </span>
        </div>
        {!isUnlimited && (
          <div className="h-1 w-full rounded-full bg-slate-200">
            <div
              className={cn('h-1 rounded-full transition-all', barColorClass)}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* Row 3: CTA / status hint */}
      {isExpired ? (
        <p className="text-[11px] font-medium mt-2 text-red-600">Gia hạn ngay →</p>
      ) : isTrial ? (
        <p className="text-[11px] font-medium mt-2 text-blue-600">
          Dùng thử còn {trialDays} ngày →
        </p>
      ) : !isPro ? (
        <p className={cn('text-[11px] font-medium mt-2', meta.chipText)}>Nâng cấp →</p>
      ) : null}
    </Link>
  );
}
