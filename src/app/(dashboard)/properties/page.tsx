'use client';

import Link from 'next/link';
import { useProperties, useDeleteProperty } from '@/hooks/use-properties';
import { PageHeader, EmptyState, LoadingSkeleton, ConfirmDialog, StatusBadge } from '@/components/shared';
import { ROUTES } from '@/constants';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function PropertiesPage() {
  const { data, isLoading } = useProperties();
  const deleteMut = useDeleteProperty();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhà trọ"
        description="Quản lý danh sách nhà trọ"
        actionLabel="Thêm nhà trọ"
        actionHref={ROUTES.PROPERTY_NEW}
        actionIcon={Plus}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : !data?.length ? (
        <EmptyState description="Chưa có nhà trọ nào. Hãy thêm nhà trọ đầu tiên." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="w-[120px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.address}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {p.description || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.PROPERTY_DETAIL(p._id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.PROPERTY_EDIT(p._id)}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        onConfirm={() => deleteMut.mutate(p._id)}
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
