'use client';

import { useCreatePayment } from '@/hooks/use-payments';
import { useBills } from '@/hooks/use-bills';
import { PageHeader, LoadingSkeleton } from '@/components/shared';
import { PaymentForm } from '@/components/forms';
import { BillStatus } from '@/types/enums';

export default function NewPaymentPage() {
  const { data: bills, isLoading } = useBills();
  const create = useCreatePayment();

  if (isLoading) return <LoadingSkeleton />;

  // Only show unpaid/partial bills
  const unpaidBills = (bills ?? []).filter(
    (b) => b.status === BillStatus.UNPAID || b.status === BillStatus.PARTIAL || b.status === BillStatus.OVERDUE,
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Thanh toán" description="Ghi nhận thanh toán cho hoá đơn" />
      {unpaidBills.length === 0 ? (
        <p className="text-muted-foreground">Không có hoá đơn cần thanh toán.</p>
      ) : (
        <PaymentForm
          onSubmit={(d) => create.mutate(d)}
          loading={create.isPending}
        />
      )}
    </div>
  );
}
