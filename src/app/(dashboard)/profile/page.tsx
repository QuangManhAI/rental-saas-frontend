'use client';

import { useProfile } from '@/hooks/use-auth';
import { PageHeader, LoadingSkeleton } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Role } from '@/types/enums';

export default function ProfilePage() {
  const { data, isLoading } = useProfile();

  if (isLoading) return <LoadingSkeleton />;
  if (!data) return <p className="p-6">Không tìm thấy thông tin.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title="Hồ sơ cá nhân" />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Họ tên</p>
              <p className="font-medium">{data.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{data.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Số điện thoại</p>
              <p className="font-medium">{data.phone || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vai trò</p>
              <Badge variant={data.role === Role.OWNER ? 'default' : 'secondary'}>
                {data.role === Role.OWNER ? 'Chủ nhà' : 'Nhân viên'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày tạo</p>
              <p className="font-medium">{formatDate(data.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
