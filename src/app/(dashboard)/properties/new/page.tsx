'use client';

import { PageHeader } from '@/components/shared';
import { PropertyForm } from '@/components/forms';
import { useCreateProperty } from '@/hooks/use-properties';

export default function NewPropertyPage() {
  const create = useCreateProperty();

  return (
    <div className="space-y-6">
      <PageHeader title="Thêm nhà trọ" />
      <PropertyForm
        onSubmit={(data) => create.mutate(data)}
        loading={create.isPending}
        submitLabel="Tạo nhà trọ"
      />
    </div>
  );
}
