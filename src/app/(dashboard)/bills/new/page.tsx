'use client';

import { useContracts } from '@/hooks/use-contracts';
import { useCreateBill } from '@/hooks/use-bills';
import { PageHeader, LoadingSkeleton } from '@/components/shared';
import { BillForm } from '@/components/forms';
import { ContractStatus } from '@/types/enums';

export default function NewBillPage() {
  const { data: contracts, isLoading } = useContracts();
  const create = useCreateBill();

  if (isLoading) return <LoadingSkeleton />;

  // Only show active contracts
  const activeContracts = (contracts ?? []).filter(
    (c) => c.status === ContractStatus.ACTIVE,
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Tạo hoá đơn" />
      <BillForm
        contracts={activeContracts}
        onSubmit={(d) => create.mutate(d)}
        loading={create.isPending}
      />
    </div>
  );
}
