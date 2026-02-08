'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTenant, useDeleteTenant } from '@/hooks/use-tenants';
import { PageHeader, LoadingSkeleton, ConfirmDialog } from '@/components/shared';
import { ROUTES } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useTenant(id);
  const deleteMut = useDeleteTenant();
  const router = useRouter();

  if (isLoading) return <LoadingSkeleton />;
  if (!data) return <p className="p-6">Không tìm thấy khách thuê.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title={data.fullName}>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={ROUTES.TENANT_EDIT(id)}>
              <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
            </Link>
          </Button>
          <ConfirmDialog
            onConfirm={() => {
              deleteMut.mutate(id, {
                onSuccess: () => router.push(ROUTES.TENANTS),
              });
            }}
            loading={deleteMut.isPending}
          />
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin khách thuê</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Họ tên</p>
            <p className="font-medium">{data.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Số điện thoại</p>
            <p className="font-medium">{data.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CCCD/CMND</p>
            <p className="font-medium">{data.identityCard}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{data.email || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Địa chỉ</p>
            <p className="font-medium">{data.address || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày sinh</p>
            <p className="font-medium">{data.dob ? formatDate(data.dob) : '—'}</p>
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
