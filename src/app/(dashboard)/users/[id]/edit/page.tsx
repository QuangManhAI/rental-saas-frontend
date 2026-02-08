'use client';

import { use } from 'react';
import { useUser, useUpdateUser } from '@/hooks/use-users';
import { PageHeader, LoadingSkeleton } from '@/components/shared';
import { RoleGuard } from '@/components/shared';
import { UserForm } from '@/components/forms';
import { Role } from '@/types/enums';

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useUser(id);
  const update = useUpdateUser(id);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <RoleGuard roles={[Role.OWNER]}>
      <div className="space-y-6">
        <PageHeader title="Chỉnh sửa nhân viên" />
        <UserForm
          isEdit
          defaultValues={{
            email: data?.email,
            fullName: data?.fullName,
            phone: data?.phone ?? '',
            password: '',
          }}
          onSubmit={(d) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { email, password, ...rest } = d;
            update.mutate(password ? { ...rest, password } : rest);
          }}
          loading={update.isPending}
          submitLabel="Cập nhật"
        />
      </div>
    </RoleGuard>
  );
}
