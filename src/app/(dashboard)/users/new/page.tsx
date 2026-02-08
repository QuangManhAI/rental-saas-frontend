'use client';

import { useCreateUser } from '@/hooks/use-users';
import { PageHeader } from '@/components/shared';
import { RoleGuard } from '@/components/shared';
import { UserForm } from '@/components/forms';
import { Role } from '@/types/enums';

export default function NewUserPage() {
  const create = useCreateUser();

  return (
    <RoleGuard roles={[Role.OWNER]}>
      <div className="space-y-6">
        <PageHeader title="Thêm nhân viên" />
        <UserForm
          onSubmit={(d) => create.mutate(d)}
          loading={create.isPending}
          submitLabel="Tạo nhân viên"
        />
      </div>
    </RoleGuard>
  );
}
