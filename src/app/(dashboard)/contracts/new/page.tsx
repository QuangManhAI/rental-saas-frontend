'use client';

import { useRooms } from '@/hooks/use-rooms';
import { useTenants } from '@/hooks/use-tenants';
import { useCreateContract } from '@/hooks/use-contracts';
import { PageHeader, LoadingSkeleton } from '@/components/shared';
import { ContractForm } from '@/components/forms';
import { RoomStatus } from '@/types/enums';

export default function NewContractPage() {
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const { data: tenants, isLoading: tenantsLoading } = useTenants();
  const create = useCreateContract();

  if (roomsLoading || tenantsLoading) return <LoadingSkeleton />;

  // Only show available rooms
  const availableRooms = (rooms ?? []).filter(
    (r) => r.status === RoomStatus.AVAILABLE,
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Tạo hợp đồng" />
      <ContractForm
        rooms={availableRooms}
        tenants={tenants ?? []}
        onSubmit={(d) => create.mutate(d)}
        loading={create.isPending}
      />
    </div>
  );
}
