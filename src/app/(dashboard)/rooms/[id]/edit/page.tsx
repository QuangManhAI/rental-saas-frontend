'use client';

import { use } from 'react';
import { useRoom, useUpdateRoom } from '@/hooks/use-rooms';
import { useProperties } from '@/hooks/use-properties';
import { PageHeader, LoadingSkeleton } from '@/components/shared';
import { RoomForm } from '@/components/forms';

export default function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useRoom(id);
  const { data: properties, isLoading: propsLoading } = useProperties();
  const update = useUpdateRoom(id);

  if (isLoading || propsLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Chỉnh sửa phòng" />
      <RoomForm
        properties={properties ?? []}
        defaultValues={{
          name: data?.name,
          price: data?.price,
          area: data?.area,
          propertyId: data?.propertyId,
          description: data?.description ?? '',
          status: data?.status,
        }}
        onSubmit={(d) => update.mutate(d)}
        loading={update.isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
