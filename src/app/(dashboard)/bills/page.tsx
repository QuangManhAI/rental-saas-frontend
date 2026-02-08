'use client';

import Link from 'next/link';
import { useBills, useDeleteBill } from '@/hooks/use-bills';
import { PageHeader, EmptyState, LoadingSkeleton, StatusBadge, ConfirmDialog } from '@/components/shared';
import { ROUTES } from '@/constants';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function BillsPage() {
  const { data, isLoading } = useBills();
  const deleteMut = useDeleteBill();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hoá đơn"
        description="Quản lý hoá đơn hàng tháng"
        actionLabel="Tạo hoá đơn"
        actionHref={ROUTES.BILL_NEW}
        actionIcon={Plus}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : !data?.length ? (
        <EmptyState description="Chưa có hoá đơn nào." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HĐ</TableHead>
                <TableHead>Tháng/Năm</TableHead>
                <TableHead>Tiền phòng</TableHead>
                <TableHead>Tiền điện</TableHead>
                <TableHead>Tiền nước</TableHead>
                <TableHead>Tổng cộng</TableHead>
                <TableHead>Đã trả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[100px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((b) => (
                <TableRow key={b._id}>
                  <TableCell className="font-mono text-sm">
                    #{b._id.slice(-6)}
                  </TableCell>
                  <TableCell>{`${String(b.month).padStart(2, '0')}/${b.year}`}</TableCell>
                  <TableCell>{formatCurrency(b.roomPrice)}</TableCell>
                  <TableCell>{formatCurrency(b.electricCost)}</TableCell>
                  <TableCell>{formatCurrency(b.waterCost)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(b.totalAmount)}
                  </TableCell>
                  <TableCell>{formatCurrency(b.paidAmount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.BILL_DETAIL(b._id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        onConfirm={() => deleteMut.mutate(b._id)}
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
