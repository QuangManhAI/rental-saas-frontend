'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, CreditCard, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useTenantAuthStore } from '@/stores/tenant-auth.store';
import { tenantPortalService } from '@/services/tenant-portal.service';
import { BillStatus } from '@/types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export default function TenantDashboardPage() {
  const tenant = useTenantAuthStore((s) => s.tenant);

  const { data: bills = [] } = useQuery({
    queryKey: ['tenant-bills'],
    queryFn: tenantPortalService.getBills,
  });

  const unpaidBills = bills.filter((b) => b.status === BillStatus.UNPAID || b.status === BillStatus.OVERDUE);
  const totalOwed = unpaidBills.reduce((s, b) => s + (b.totalAmount - b.paidAmount), 0);
  const latestBill = bills[0] ?? null;

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="pt-2">
        <p className="text-slate-500 text-sm">Xin chào,</p>
        <h2 className="text-xl font-bold text-slate-800">{tenant?.fullName ?? 'Khách thuê'}</h2>
      </div>

      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-5 shadow-lg">
        <p className="text-indigo-200 text-xs font-medium uppercase tracking-wide">Số tiền cần thanh toán</p>
        <p className="text-3xl font-bold mt-1">{formatCurrency(totalOwed)}</p>
        {unpaidBills.length > 0 ? (
          <p className="text-indigo-200 text-sm mt-1">{unpaidBills.length} hóa đơn chưa thanh toán</p>
        ) : (
          <p className="text-indigo-200 text-sm mt-1">Tất cả hóa đơn đã thanh toán</p>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/tenant/bills"
          className="flex flex-col items-center gap-2 rounded-xl bg-white border border-slate-200 p-4 shadow-sm active:bg-slate-50"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">Xem hóa đơn</span>
        </Link>

        <Link
          href="/tenant/payments"
          className="flex flex-col items-center gap-2 rounded-xl bg-white border border-slate-200 p-4 shadow-sm active:bg-slate-50"
        >
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">Lịch sử thanh toán</span>
        </Link>
      </div>

      {/* Unpaid bills alert */}
      {unpaidBills.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm font-semibold text-red-700">Hóa đơn cần thanh toán</p>
          </div>
          {unpaidBills.slice(0, 3).map((bill) => (
            <Link
              key={bill._id}
              href={`/tenant/bills/${bill._id}`}
              className="flex items-center justify-between py-2 border-t border-red-100 active:opacity-70"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Tháng {bill.month}/{bill.year}
                </p>
                <p className="text-xs text-slate-500">
                  Còn lại: {formatCurrency(bill.totalAmount - bill.paidAmount)}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                bill.status === BillStatus.OVERDUE
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {bill.status === BillStatus.OVERDUE ? 'Quá hạn' : 'Chưa TT'}
              </span>
            </Link>
          ))}
          {unpaidBills.length > 3 && (
            <Link href="/tenant/bills" className="block text-center text-xs text-indigo-600 font-medium pt-1">
              Xem thêm {unpaidBills.length - 3} hóa đơn →
            </Link>
          )}
        </div>
      )}

      {/* Latest bill summary */}
      {latestBill && unpaidBills.length === 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-700">Đã thanh toán đầy đủ</p>
            <p className="text-xs text-slate-500">
              Hóa đơn gần nhất: Tháng {latestBill.month}/{latestBill.year}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
