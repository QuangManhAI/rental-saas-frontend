'use client';

import Link from 'next/link';
import { useUsers, useDeleteUser } from '@/hooks/use-users';
import { PageHeader, EmptyState, LoadingSkeleton, ConfirmDialog } from '@/components/shared';
import { RoleGuard } from '@/components/shared';
import { ROUTES } from '@/constants';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Role } from '@/types/enums';

export default function UsersPage() {
  const { data, isLoading } = useUsers();
  const deleteMut = useDeleteUser();

  return (
    <RoleGuard roles={[Role.OWNER]}>
      <div className="space-y-6">
        <PageHeader
          title="Nhân viên"
          description="Quản lý tài khoản nhân viên"
          actionLabel="Thêm nhân viên"
          actionHref={ROUTES.USER_NEW}
          actionIcon={Plus}
        />

        {isLoading ? (
          <LoadingSkeleton />
        ) : !data?.length ? (
          <EmptyState description="Chưa có nhân viên nào." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="w-[100px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === Role.OWNER ? 'default' : 'secondary'}>
                        {u.role === Role.OWNER ? 'Chủ nhà' : 'Nhân viên'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.isActive ? 'default' : 'destructive'}>
                        {u.isActive ? 'Hoạt động' : 'Bị khoá'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(u.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={ROUTES.USER_EDIT(u._id)}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <ConfirmDialog
                          onConfirm={() => deleteMut.mutate(u._id)}
                          loading={deleteMut.isPending}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
