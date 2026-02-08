'use client';

import { use } from 'react';
import { useTenant, useUpdateTenant } from '@/hooks/use-tenants';
import { PageHeader, LoadingSkeleton } from '@/components/shared';
import { TenantForm } from '@/components/forms';

export default function EditTenantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useTenant(id);
  const update = useUpdateTenant(id);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Chỉnh sửa khách thuê" />
      <TenantForm
        defaultValues={{
          fullName: data?.fullName,
          email: data?.email ?? '',
          phone: data?.phone,
          identityCard: data?.identityCard,
          address: data?.address ?? '',
          dob: data?.dob ?? '',
        }}
        onSubmit={(d) => update.mutate(d)}
        loading={update.isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
