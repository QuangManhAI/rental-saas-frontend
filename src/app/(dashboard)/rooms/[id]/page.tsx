'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRoom, useDeleteRoom } from '@/hooks/use-rooms';
import { PageHeader, LoadingSkeleton, StatusBadge, ConfirmDialog } from '@/components/shared';
import { ROUTES } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useRoom(id);
  const deleteMut = useDeleteRoom();
  const router = useRouter();

  if (isLoading) return <LoadingSkeleton />;
  if (!data) return <p className="p-6">Không tìm thấy phòng.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title={data.name}>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={ROUTES.ROOM_EDIT(id)}>
              <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
            </Link>
          </Button>
          <ConfirmDialog
            onConfirm={() => {
              deleteMut.mutate(id, {
                onSuccess: () => router.push(ROUTES.ROOMS),
              });
            }}
            loading={deleteMut.isPending}
          />
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin phòng</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tên phòng</p>
            <p className="font-medium">{data.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trạng thái</p>
            <StatusBadge status={data.status} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Giá thuê</p>
            <p className="font-medium">{formatCurrency(data.price)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Diện tích</p>
            <p className="font-medium">{data.area ? `${data.area} m²` : '—'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Mô tả</p>
            <p className="font-medium">{data.description || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày tạo</p>
            <p className="font-medium">{formatDate(data.createdAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
