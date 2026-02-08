'use client';

import { use } from 'react';
import { useContract, useTerminateContract } from '@/hooks/use-contracts';
import { PageHeader, LoadingSkeleton, StatusBadge, ConfirmDialog } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useContract(id);
  const terminateMut = useTerminateContract();

  if (isLoading) return <LoadingSkeleton />;
  if (!data) return <p className="p-6">Không tìm thấy hợp đồng.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title={`Hợp đồng #${data._id.slice(-6)}`}>
        {data.status === 'ACTIVE' && (
          <ConfirmDialog
            title="Thanh lý hợp đồng?"
            description="Hợp đồng sẽ được chuyển sang trạng thái đã thanh lý. Phòng sẽ được trả về trạng thái trống."
            onConfirm={() => terminateMut.mutate(id)}
            loading={terminateMut.isPending}
          />
        )}
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin hợp đồng</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Trạng thái</p>
            <StatusBadge status={data.status} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Giá thuê</p>
            <p className="font-medium">{formatCurrency(data.rentPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tiền đặt cọc</p>
            <p className="font-medium">{formatCurrency(data.deposit)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
            <p className="font-medium">{formatDate(data.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
            <p className="font-medium">{formatDate(data.endDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mã phòng</p>
            <p className="font-mono text-sm">{data.roomId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mã khách thuê</p>
            <p className="font-mono text-sm">{data.tenantId}</p>
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
