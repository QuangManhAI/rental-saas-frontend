'use client';

import Link from 'next/link';
import { useRooms, useDeleteRoom } from '@/hooks/use-rooms';
import { useProperties } from '@/hooks/use-properties';
import { PageHeader, EmptyState, LoadingSkeleton, ConfirmDialog, StatusBadge } from '@/components/shared';
import { ROUTES } from '@/constants';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Eye, Pencil } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function RoomsPage() {
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const { data: properties } = useProperties();
  const { data, isLoading } = useRooms(propertyFilter === 'all' ? undefined : propertyFilter);
  const deleteMut = useDeleteRoom();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phòng"
        description="Quản lý danh sách phòng trọ"
        actionLabel="Thêm phòng"
        actionHref={ROUTES.ROOM_NEW}
        actionIcon={Plus}
      />

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Lọc theo nhà trọ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nhà trọ</SelectItem>
            {properties?.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : !data?.length ? (
        <EmptyState description="Chưa có phòng nào. Hãy thêm phòng đầu tiên." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên phòng</TableHead>
                <TableHead>Giá thuê</TableHead>
                <TableHead>Diện tích</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[120px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{formatCurrency(r.price)}</TableCell>
                  <TableCell>{r.area ? `${r.area} m²` : '—'}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.ROOM_DETAIL(r._id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.ROOM_EDIT(r._id)}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        onConfirm={() => deleteMut.mutate(r._id)}
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
