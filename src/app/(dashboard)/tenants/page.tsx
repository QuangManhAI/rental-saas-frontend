'use client';

import Link from 'next/link';
import { useTenants, useDeleteTenant } from '@/hooks/use-tenants';
import { PageHeader, EmptyState, LoadingSkeleton, ConfirmDialog } from '@/components/shared';
import { ROUTES } from '@/constants';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function TenantsPage() {
  const { data, isLoading } = useTenants();
  const deleteMut = useDeleteTenant();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Khách thuê"
        description="Quản lý danh sách khách thuê"
        actionLabel="Thêm khách thuê"
        actionHref={ROUTES.TENANT_NEW}
        actionIcon={Plus}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : !data?.length ? (
        <EmptyState description="Chưa có khách thuê nào." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Điện thoại</TableHead>
                <TableHead>CCCD</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[120px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="font-medium">{t.fullName}</TableCell>
                  <TableCell>{t.phone}</TableCell>
                  <TableCell>{t.identityCard}</TableCell>
                  <TableCell>{t.email || '—'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.TENANT_DETAIL(t._id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.TENANT_EDIT(t._id)}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        onConfirm={() => deleteMut.mutate(t._id)}
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
  );
}
