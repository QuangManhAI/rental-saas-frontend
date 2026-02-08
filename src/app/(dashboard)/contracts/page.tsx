'use client';

import Link from 'next/link';
import { useContracts, useTerminateContract } from '@/hooks/use-contracts';
import { PageHeader, EmptyState, LoadingSkeleton, StatusBadge, ConfirmDialog } from '@/components/shared';
import { ROUTES } from '@/constants';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ContractsPage() {
  const { data, isLoading } = useContracts();
  const terminateMut = useTerminateContract();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hợp đồng"
        description="Quản lý danh sách hợp đồng thuê"
        actionLabel="Tạo hợp đồng"
        actionHref={ROUTES.CONTRACT_NEW}
        actionIcon={Plus}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : !data?.length ? (
        <EmptyState description="Chưa có hợp đồng nào." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HĐ</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Giá thuê</TableHead>
                <TableHead>Đặt cọc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[120px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className="font-mono text-sm">
                    #{c._id.slice(-6)}
                  </TableCell>
                  <TableCell>{formatDate(c.startDate)}</TableCell>
                  <TableCell>{formatDate(c.endDate)}</TableCell>
                  <TableCell>{formatCurrency(c.rentPrice)}</TableCell>
                  <TableCell>{formatCurrency(c.deposit)}</TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.CONTRACT_DETAIL(c._id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {c.status === 'ACTIVE' && (
                        <ConfirmDialog
                          title="Thanh lý hợp đồng?"
                          description="Hợp đồng sẽ được chuyển sang trạng thái đã thanh lý. Phòng sẽ được trả về trạng thái trống."
                          onConfirm={() => terminateMut.mutate(c._id)}
                          loading={terminateMut.isPending}
                        />
                      )}
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
