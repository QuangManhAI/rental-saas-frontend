'use client';

import { useCreateTenant } from '@/hooks/use-tenants';
import { PageHeader } from '@/components/shared';
import { TenantForm } from '@/components/forms';

export default function NewTenantPage() {
  const create = useCreateTenant();

  return (
    <div className="space-y-6">
      <PageHeader title="Thêm khách thuê" />
      <TenantForm
        onSubmit={(d) => create.mutate(d)}
        loading={create.isPending}
        submitLabel="Tạo khách thuê"
      />
    </div>
  );
}
