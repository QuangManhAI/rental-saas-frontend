'use client';

import { useProperties } from '@/hooks/use-properties';
import { useCreateRoom } from '@/hooks/use-rooms';
import { PageHeader, LoadingSkeleton } from '@/components/shared';
import { RoomForm } from '@/components/forms';

export default function NewRoomPage() {
  const { data: properties, isLoading } = useProperties();
  const create = useCreateRoom();

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Thêm phòng" />
      <RoomForm
        properties={properties ?? []}
        onSubmit={(d) => create.mutate(d)}
        loading={create.isPending}
        submitLabel="Tạo phòng"
      />
    </div>
  );
}
