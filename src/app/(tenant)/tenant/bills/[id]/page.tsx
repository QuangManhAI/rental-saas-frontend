'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Download, QrCode } from 'lucide-react';
import { tenantPortalService } from '@/services/tenant-portal.service';
import { BillStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<BillStatus, { badge: string; label: string }> = {
  [BillStatus.UNPAID]: { badge: 'bg-yellow-100 text-yellow-700', label: 'Chưa thanh toán' },
  [BillStatus.PARTIAL]: { badge: 'bg-blue-100 text-blue-700', label: 'Thanh toán một phần' },
  [BillStatus.PAID]: { badge: 'bg-green-100 text-green-700', label: 'Đã thanh toán' },
  [BillStatus.OVERDUE]: { badge: 'bg-red-100 text-red-700', label: 'Quá hạn' },
};

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={cn('text-sm font-medium', highlight ? 'text-indigo-700 text-base font-bold' : 'text-slate-800')}>
        {value}
      </span>
    </div>
  );
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function TenantBillDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: bill, isLoading } = useQuery({
    queryKey: ['tenant-bill', id],
    queryFn: () => tenantPortalService.getBill(id),
    enabled: !!id,
  });

  const { data: qrData } = useQuery({
    queryKey: ['tenant-bill-qr', id],
    queryFn: () => tenantPortalService.getBillQr(id),
    enabled: !!id && !!bill && bill.status !== BillStatus.PAID,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>Không tìm thấy hóa đơn</p>
        <Link href="/tenant/bills" className="text-indigo-600 text-sm mt-2 inline-block">
          ← Quay lại
        </Link>
      </div>
    );
  }

  const style = STATUS_STYLE[bill.status] ?? { badge: 'bg-slate-100 text-slate-600', label: bill.status };
  const remaining = bill.totalAmount - bill.paidAmount;
  const isPaid = bill.status === BillStatus.PAID;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/tenant/bills" className="p-1.5 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-slate-800">
            Hóa đơn Tháng {bill.month}/{bill.year}
          </h1>
          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', style.badge)}>
            {style.label}
          </span>
        </div>
      </div>

      {/* Bill breakdown */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Chi tiết hóa đơn</p>
        <Row label="Tiền phòng" value={formatCurrency(bill.roomPrice)} />
        <Row
          label={`Điện (${bill.electricNewIndex - bill.electricOldIndex} kWh × ${formatCurrency(bill.electricRate)})`}
          value={formatCurrency(bill.electricCost)}
        />
        <Row
          label={`Nước (${bill.waterNewIndex - bill.waterOldIndex} m³ × ${formatCurrency(bill.waterRate)})`}
          value={formatCurrency(bill.waterCost)}
        />
        {bill.otherFee > 0 && <Row label="Phí khác" value={formatCurrency(bill.otherFee)} />}
        <Row label="Tổng cộng" value={formatCurrency(bill.totalAmount)} />
        {bill.paidAmount > 0 && <Row label="Đã thanh toán" value={formatCurrency(bill.paidAmount)} />}
        {!isPaid && remaining > 0 && (
          <Row label="Còn lại" value={formatCurrency(remaining)} highlight />
        )}
      </div>

      {/* Meter readings */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Chỉ số đồng hồ</p>
        <Row label="Điện cũ" value={`${bill.electricOldIndex} kWh`} />
        <Row label="Điện mới" value={`${bill.electricNewIndex} kWh`} />
        <Row label="Nước cũ" value={`${bill.waterOldIndex} m³`} />
        <Row label="Nước mới" value={`${bill.waterNewIndex} m³`} />
      </div>

      {/* QR Code for payment */}
      {!isPaid && qrData && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <QrCode className="h-4 w-4 text-indigo-600" />
            <p className="text-sm font-semibold text-slate-700">Quét để chuyển khoản</p>
          </div>
          <img
            src={qrData.qrDataUrl}
            alt="VietQR payment QR code"
            className="w-48 h-48 mx-auto rounded-lg border border-slate-100"
          />
          <p className="text-sm font-bold text-indigo-700">{formatCurrency(qrData.amount)}</p>
          <p className="text-xs text-slate-400">VietQR — Chuyển khoản ngân hàng nhanh</p>
        </div>
      )}

      {/* Download invoice */}
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3000'}/api/v1/bills/${id}/invoice`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 font-medium text-sm py-3 active:bg-indigo-100"
      >
        <Download className="h-4 w-4" />
        Tải hóa đơn PDF
      </a>
    </div>
  );
}
