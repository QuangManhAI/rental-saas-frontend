'use client';

import { use } from 'react';
import { useProperty, useUpdateProperty } from '@/hooks/use-properties';
import { PageHeader, LoadingSkeleton } from '@/components/shared';
import { PropertyForm } from '@/components/forms';

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useProperty(id);
  const update = useUpdateProperty(id);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Chỉnh sửa nhà trọ" />
      <PropertyForm
        defaultValues={{
          name: data?.name,
          address: data?.address,
          description: data?.description ?? '',
        }}
        onSubmit={(d) => update.mutate(d)}
        loading={update.isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
