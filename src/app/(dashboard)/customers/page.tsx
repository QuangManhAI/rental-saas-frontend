'use client';

import Link from 'next/link';
import { useCustomers, useDeleteCustomer } from '@/hooks/use-customers';
import { PageHeader, EmptyState, LoadingSkeleton, ConfirmDialog } from '@/components/shared';
import { ROUTES } from '@/constants';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, MessageCircle } from 'lucide-react';

export default function CustomersPage() {
  const { data, isLoading } = useCustomers();
  const deleteMut = useDeleteCustomer();

  const handleSendTelegram = (customerId: string) => {
    // Open Telegram bot link in new tab - NO API call, NO async
    window.open(`https://t.me/quangManhAI_bot?start=${customerId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Khách hàng"
        description="Quản lý danh sách khách hàng"
        actionLabel="Thêm khách hàng"
        actionHref={ROUTES.CUSTOMER_NEW}
        actionIcon={Plus}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : !data?.length ? (
        <EmptyState description="Chưa có khách hàng nào." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telegram</TableHead>
                <TableHead className="w-[120px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {customer.telegramChatId ? (
                      <Badge variant="secondary" className="text-green-600">
                        ✓ Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not connected</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSendTelegram(customer._id)}
                        title="Send Telegram link"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.CUSTOMER_DETAIL(customer._id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.CUSTOMER_EDIT(customer._id)}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        onConfirm={() => deleteMut.mutate(customer._id)}
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