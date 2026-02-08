'use client';

import { use } from 'react';
import { useProperty } from '@/hooks/use-properties';
import { useRooms } from '@/hooks/use-rooms';
import { PageHeader, LoadingSkeleton, StatusBadge, EmptyState } from '@/components/shared';
import { ROUTES } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: property, isLoading } = useProperty(id);
  const { data: rooms, isLoading: roomsLoading } = useRooms(id);

  if (isLoading) return <LoadingSkeleton />;
  if (!property) return <EmptyState title="Không tìm thấy nhà trọ" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={property.name}
        description={property.address}
        actionLabel="Chỉnh sửa"
        actionHref={ROUTES.PROPERTY_EDIT(id)}
      />

      {property.description && (
        <Card>
          <CardHeader><CardTitle>Mô tả</CardTitle></CardHeader>
          <CardContent><p>{property.description}</p></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng</CardTitle>
        </CardHeader>
        <CardContent>
          {roomsLoading ? (
            <LoadingSkeleton rows={3} columns={4} />
          ) : !rooms?.length ? (
            <EmptyState description="Chưa có phòng nào trong nhà trọ này." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phòng</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{formatCurrency(r.price)}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.ROOM_DETAIL(r._id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
