'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, CreditCard } from 'lucide-react';
import { tenantPortalService } from '@/services/tenant-portal.service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const METHOD_LABEL: Record<string, string> = {
  CASH: 'Tiền mặt',
  TRANSFER: 'Chuyển khoản',
  MOMO: 'MoMo',
  VNPAY: 'VNPay',
  OTHER: 'Khác',
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function TenantPaymentsPage() {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['tenant-payments'],
    queryFn: tenantPortalService.getPayments,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-slate-800">Lịch sử thanh toán</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
          <CreditCard className="h-10 w-10" />
          <p className="text-sm">Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => {
            const billRef = typeof payment.billId === 'object' ? payment.billId : null;
            const date = payment.paidAt || payment.createdAt;
            return (
              <div
                key={payment._id}
                className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 p-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">
                    {billRef
                      ? `Tháng ${billRef.month}/${billRef.year}`
                      : 'Thanh toán hóa đơn'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {METHOD_LABEL[payment.method] ?? payment.method}
                    {' · '}
                    {format(new Date(date), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
                <p className="text-sm font-bold text-green-600 shrink-0">
                  +{formatCurrency(payment.amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
