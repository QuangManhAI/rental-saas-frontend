'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2, FileText } from 'lucide-react';
import { tenantPortalService } from '@/services/tenant-portal.service';
import { BillStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: BillStatus.UNPAID, label: 'Chưa TT' },
  { key: BillStatus.OVERDUE, label: 'Quá hạn' },
  { key: BillStatus.PARTIAL, label: 'Một phần' },
  { key: BillStatus.PAID, label: 'Đã TT' },
];

const STATUS_STYLE: Record<BillStatus, { badge: string; label: string }> = {
  [BillStatus.UNPAID]: { badge: 'bg-yellow-100 text-yellow-700', label: 'Chưa TT' },
  [BillStatus.PARTIAL]: { badge: 'bg-blue-100 text-blue-700', label: 'Một phần' },
  [BillStatus.PAID]: { badge: 'bg-green-100 text-green-700', label: 'Đã TT' },
  [BillStatus.OVERDUE]: { badge: 'bg-red-100 text-red-700', label: 'Quá hạn' },
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function TenantBillsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['tenant-bills'],
    queryFn: tenantPortalService.getBills,
  });

  const filtered = activeTab === 'all' ? bills : bills.filter((b) => b.status === activeTab);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-slate-800">Hóa đơn của tôi</h1>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const count = tab.key === 'all' ? bills.length : bills.filter((b) => b.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600',
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className={cn('ml-1', activeTab === tab.key ? 'opacity-80' : 'text-slate-400')}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bill list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
          <FileText className="h-10 w-10" />
          <p className="text-sm">Không có hóa đơn</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((bill) => {
            const style = STATUS_STYLE[bill.status] ?? { badge: 'bg-slate-100 text-slate-600', label: bill.status };
            const remaining = bill.totalAmount - bill.paidAmount;
            return (
              <Link
                key={bill._id}
                href={`/tenant/bills/${bill._id}`}
                className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 p-4 shadow-sm active:bg-slate-50"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">
                    Tháng {bill.month}/{bill.year}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tổng: {formatCurrency(bill.totalAmount)}
                    {remaining > 0 && bill.status !== BillStatus.PAID && (
                      <> · Còn: {formatCurrency(remaining)}</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn('text-[11px] px-2 py-0.5 rounded-full font-medium', style.badge)}>
                    {style.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
