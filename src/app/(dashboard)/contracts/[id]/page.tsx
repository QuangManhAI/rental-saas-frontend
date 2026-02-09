'use client';

import { use } from 'react';
import { useContract, useTerminateContract } from '@/hooks/use-contracts';
import { PageHeader, LoadingSkeleton, StatusBadge, ConfirmDialog } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
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
            <p className="text-sm text-muted-foreground">Phòng</p>
            <p className="font-medium">
              {typeof data.roomId === 'object' ? data.roomId.name : data.roomId}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Khách thuê</p>
            <p className="font-medium">
              {typeof data.tenantId === 'object' ? data.tenantId.fullName : data.tenantId}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày tạo</p>
            <p className="font-medium">{formatDate(data.createdAt)}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Kết nối Telegram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Chia sẻ liên kết này cho khách thuê để nhận thông báo hóa đơn và thanh toán online:
            </p>
            {data.telegramLink ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-muted rounded-md border text-sm font-mono break-all">
                  {data.telegramLink}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(data.telegramLink!);
                    toast.success('Đã sao chép liên kết');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-yellow-600">
                Không có liên kết Telegram.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
