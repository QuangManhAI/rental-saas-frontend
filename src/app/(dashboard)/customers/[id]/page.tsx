'use client';

import { use } from 'react';
import Link from 'next/link';
import { useCustomer, useDeleteCustomer } from '@/hooks/use-customers';
import { PageHeader, LoadingSkeleton, ConfirmDialog } from '@/components/shared';
import { ROUTES } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useCustomer(id);
  const deleteMut = useDeleteCustomer();
  const router = useRouter();

  const handleSendTelegram = () => {
    // Open Telegram bot link in new tab - NO API call, NO async
    window.open(`https://t.me/quangManhAI_bot?start=${id}`, '_blank');
  };

  if (isLoading) return <LoadingSkeleton />;
  if (!data) return <p className="p-6">Không tìm thấy khách hàng.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title={data.name}>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSendTelegram}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Telegram
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.CUSTOMER_EDIT(id)}>
              <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
            </Link>
          </Button>
          <ConfirmDialog
            onConfirm={() => {
              deleteMut.mutate(id, {
                onSuccess: () => router.push(ROUTES.CUSTOMERS),
              });
            }}
            loading={deleteMut.isPending}
          />
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Họ tên</p>
              <p className="font-medium">{data.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{data.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày tạo</p>
              <p className="font-medium">{formatDate(data.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Telegram Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <div className="flex items-center gap-2">
                {data.telegramChatId ? (
                  <Badge variant="secondary" className="text-green-600">
                    ✓ Connected
                  </Badge>
                ) : (
                  <Badge variant="outline">Not connected</Badge>
                )}
              </div>
            </div>
            {!data.telegramChatId && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Hành động</p>
                <Button onClick={handleSendTelegram} className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Telegram Link
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Click to send invitation link via Telegram bot
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}