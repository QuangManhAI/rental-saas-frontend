'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Check, X as XIcon, Crown, Zap, Sparkles, Clock, ChevronRight } from 'lucide-react';
import api from '@/lib/axios';

interface Subscription {
  plan: 'free' | 'basic' | 'pro';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt?: string;
  currentPeriodEnd?: string;
  roomLimit: number;
  propertyLimit: number;
}

/* ─── Static plan config ─── */

const PLANS = [
  {
    key: 'free' as const,
    label: 'Miễn phí',
    price: '0₫',
    period: '/mãi mãi',
    Icon: Sparkles,
    accentColor: '#6b7280',
    bgGradient: 'from-gray-50 to-white',
    border: '#e5e7eb',
    ringColor: 'ring-gray-300',
    buttonStyle: { background: '#fff', color: '#374151', border: '1px solid #d1d5db' },
    features: ['Hóa đơn & thanh toán', 'Cổng khách thuê', 'Xuất PDF', '1 tòa · 10 phòng'],
    missingFeatures: ['Telegram', 'Báo cáo', 'VNPay', 'Email'],
    popular: false,
  },
  {
    key: 'basic' as const,
    label: 'Cơ bản',
    price: '199.000₫',
    period: '/tháng',
    Icon: Zap,
    accentColor: '#2563eb',
    bgGradient: 'from-blue-600 to-indigo-600',
    border: '#2563eb',
    ringColor: 'ring-blue-500',
    buttonStyle: { background: '#fff', color: '#2563eb', border: 'none' },
    features: ['Mọi thứ gói Miễn phí', 'Telegram & Email', 'Báo cáo doanh thu', 'VNPay + VietQR', '5 tòa · 50 phòng'],
    missingFeatures: ['API', 'Hỗ trợ 24/7'],
    popular: true,
  },
  {
    key: 'pro' as const,
    label: 'Chuyên nghiệp',
    price: '499.000₫',
    period: '/tháng',
    Icon: Crown,
    accentColor: '#7c3aed',
    bgGradient: 'from-gray-50 to-white',
    border: '#7c3aed',
    ringColor: 'ring-purple-500',
    buttonStyle: { background: '#7c3aed', color: '#fff', border: 'none' },
    features: ['Mọi thứ gói Cơ bản', 'Không giới hạn tòa/phòng', 'API tích hợp', 'Hỗ trợ ưu tiên 24/7'],
    missingFeatures: [],
    popular: false,
  },
];

function daysUntil(d: string) {
  return Math.max(0, Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000));
}

/* ─── Component ─── */

export function PlanStatusWidget() {
  const router = useRouter();

  const { data: sub, isLoading } = useQuery<Subscription>({
    queryKey: ['subscription', 'my'],
    queryFn: () => api.get('/subscriptions/my').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const handleClick = () => router.push('/subscription');

  /* Skeleton */
  if (isLoading || !sub) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 animate-pulse space-y-3">
        <div className="h-5 w-36 bg-gray-100 rounded" />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-52 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const trialDays = sub.status === 'trial' && sub.trialEndsAt ? daysUntil(sub.trialEndsAt) : null;
  const isExpired = sub.status === 'expired';

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group rounded-2xl border border-gray-200 bg-white p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Gói dịch vụ</p>
          {trialDays !== null && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <p className="text-xs text-blue-600 font-medium">
                Dùng thử PRO · còn {trialDays} ngày
              </p>
            </div>
          )}
          {isExpired && (
            <p className="text-xs text-red-600 font-medium mt-0.5">Gói đã hết hạn</p>
          )}
          {sub.status === 'active' && sub.plan !== 'free' && sub.currentPeriodEnd && (
            <p className="text-xs text-gray-500 mt-0.5">
              Hết hạn {new Date(sub.currentPeriodEnd).toLocaleDateString('vi-VN')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.key === sub.plan;
          const Icon = plan.Icon;
          const isHighlighted = plan.popular && !isCurrent;

          return (
            <div
              key={plan.key}
              className={`relative rounded-xl overflow-hidden transition-all ${
                isCurrent
                  ? `ring-2 ${plan.ringColor} ring-offset-1 shadow-md`
                  : isHighlighted
                    ? 'ring-2 ring-blue-400 ring-offset-1'
                    : 'border border-gray-200'
              }`}
              style={{ borderColor: isCurrent ? plan.accentColor : undefined }}
            >
              {/* Card top — gradient for Basic, plain for others */}
              <div
                className={`px-4 pt-4 pb-3 ${
                  plan.popular
                    ? `bg-gradient-to-br ${plan.bgGradient}`
                    : 'bg-white'
                }`}
              >
                {/* Badges */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: plan.popular ? 'rgba(255,255,255,0.2)' : `${plan.accentColor}18` }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: plan.popular ? '#fff' : plan.accentColor }}
                    />
                  </div>
                  {isCurrent ? (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: plan.popular ? 'rgba(255,255,255,0.25)' : `${plan.accentColor}18`,
                        color: plan.popular ? '#fff' : plan.accentColor,
                      }}
                    >
                      Gói hiện tại
                    </span>
                  ) : plan.popular ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900">
                      Phổ biến nhất
                    </span>
                  ) : null}
                </div>

                <p
                  className="font-bold text-sm"
                  style={{ color: plan.popular ? '#fff' : '#111827' }}
                >
                  {plan.label}
                </p>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  <span
                    className="text-lg font-extrabold"
                    style={{ color: plan.popular ? '#fff' : plan.accentColor }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ color: plan.popular ? 'rgba(255,255,255,0.75)' : '#9ca3af' }}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white px-4 py-3 space-y-1.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-green-500 shrink-0" />
                    <span className="text-[11px] text-gray-700">{f}</span>
                  </div>
                ))}
                {plan.missingFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <XIcon className="w-3 h-3 text-gray-300 shrink-0" />
                    <span className="text-[11px] text-gray-400">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="bg-white px-4 pb-4">
                <button
                  className="w-full rounded-lg py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={plan.buttonStyle}
                  tabIndex={-1}
                >
                  {isCurrent
                    ? 'Đang sử dụng'
                    : plan.key === 'free'
                      ? 'Hạ cấp'
                      : `Nâng lên ${plan.label}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
