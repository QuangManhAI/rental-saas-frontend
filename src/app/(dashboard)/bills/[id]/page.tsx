'use client';

import { use, useState } from 'react';
import { useBill } from '@/hooks/use-bills';
import { usePaymentsByBill, useCreatePayment, useDeletePayment } from '@/hooks/use-payments';
import { PageHeader, LoadingSkeleton, StatusBadge, ConfirmDialog, EmptyState } from '@/components/shared';
import { PaymentForm } from '@/components/forms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus } from 'lucide-react';

export default function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: bill, isLoading } = useBill(id);
  const { data: payments, isLoading: paymentsLoading } = usePaymentsByBill(id);
  const createPayment = useCreatePayment();
  const deletePayment = useDeletePayment(id);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  if (isLoading) return <LoadingSkeleton />;
  if (!bill) return <p className="p-6">Không tìm thấy hoá đơn.</p>;

  const remaining = bill.totalAmount - bill.paidAmount;

  return (
    <div className="space-y-6">
      <PageHeader title={`Hoá đơn #${bill._id.slice(-6)}`}>
        <StatusBadge status={bill.status} />
      </PageHeader>

      {/* Bill Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng cộng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(bill.totalAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã trả</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(bill.paidAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Còn lại</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(remaining)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kỳ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{`${String(bill.month).padStart(2, '0')}/${bill.year}`}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bill Details */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết hoá đơn</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tiền phòng</p>
            <p className="font-medium">{formatCurrency(bill.roomPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tiền điện</p>
            <p className="font-medium">
              {formatCurrency(bill.electricCost)}{' '}
              <span className="text-sm text-muted-foreground">
                ({bill.electricNewIndex - bill.electricOldIndex} kWh × {formatCurrency(bill.electricRate)})
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tiền nước</p>
            <p className="font-medium">
              {formatCurrency(bill.waterCost)}{' '}
              <span className="text-sm text-muted-foreground">
                ({bill.waterNewIndex - bill.waterOldIndex} m³ × {formatCurrency(bill.waterRate)})
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phí khác</p>
            <p className="font-medium">{formatCurrency(bill.otherFee)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày tạo</p>
            <p className="font-medium">{formatDate(bill.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch sử thanh toán</CardTitle>
          {remaining > 0 && (
            <Button
              size="sm"
              onClick={() => setShowPaymentForm(!showPaymentForm)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thanh toán
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {showPaymentForm && (
            <div className="rounded-md border p-4">
              <PaymentForm
                defaultBillId={id}
                onSubmit={(d) => {
                  createPayment.mutate(d, {
                    onSuccess: () => setShowPaymentForm(false),
                  });
                }}
                loading={createPayment.isPending}
              />
            </div>
          )}

          {paymentsLoading ? (
            <LoadingSkeleton rows={2} />
          ) : !payments?.length ? (
            <EmptyState description="Chưa có lần thanh toán nào." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{formatDate(p.createdAt)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(p.amount)}
                    </TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell>{p.note || '—'}</TableCell>
                    <TableCell>
                      <ConfirmDialog
                        onConfirm={() => deletePayment.mutate(p._id)}
                        loading={deletePayment.isPending}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
