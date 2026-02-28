'use client';

import { useState } from 'react';
import { usePayments } from '@/hooks/use-payments';
import { PageHeader, LoadingSkeleton, EmptyState } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditCard, Search, Filter, RotateCcw } from 'lucide-react';
import { PaymentMethod, PaymentStatus } from '@/types/enums';
import type { PaymentFilters } from '@/services/payments.service';

const METHOD_LABELS: Record<string, string> = {
    [PaymentMethod.CASH]: 'Tiền mặt',
    [PaymentMethod.TRANSFER]: 'Chuyển khoản',
    [PaymentMethod.MOMO]: 'MoMo',
    [PaymentMethod.VNPAY]: 'VNPay',
    [PaymentMethod.OTHER]: 'Khác',
};

const STATUS_COLORS: Record<string, string> = {
    [PaymentStatus.SUCCESS]: 'text-green-600',
    [PaymentStatus.PENDING]: 'text-yellow-600',
    [PaymentStatus.FAILED]: 'text-red-600',
};

export default function PaymentsPage() {
    const [filters, setFilters] = useState<PaymentFilters>({});
    const [method, setMethod] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { data: payments, isLoading, refetch } = usePayments(filters);

    const handleSearch = () => {
        setFilters({
            method: method || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        });
    };

    const handleReset = () => {
        setMethod('');
        setStartDate('');
        setEndDate('');
        setFilters({});
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Lịch sử giao dịch"
                description="Xem tất cả các giao dịch thanh toán"
            >
                <CreditCard className="h-6 w-6 text-muted-foreground" />
            </PageHeader>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Bộ lọc
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">
                                Phương thức
                            </label>
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Tất cả" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tất cả</SelectItem>
                                    <SelectItem value={PaymentMethod.CASH}>Tiền mặt</SelectItem>
                                    <SelectItem value={PaymentMethod.TRANSFER}>Chuyển khoản</SelectItem>
                                    <SelectItem value={PaymentMethod.MOMO}>MoMo</SelectItem>
                                    <SelectItem value={PaymentMethod.VNPAY}>VNPay</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">Từ ngày</label>
                            <DatePickerField
                                value={startDate}
                                onChange={setStartDate}
                                placeholder="Chọn ngày"
                                className="w-[160px]"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">Đến ngày</label>
                            <DatePickerField
                                value={endDate}
                                onChange={setEndDate}
                                placeholder="Chọn ngày"
                                className="w-[160px]"
                            />
                        </div>

                        <Button onClick={handleSearch} size="sm">
                            <Search className="mr-2 h-4 w-4" />
                            Tìm kiếm
                        </Button>

                        <Button variant="outline" size="sm" onClick={handleReset}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Đặt lại
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách giao dịch</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <LoadingSkeleton rows={5} />
                    ) : !payments?.length ? (
                        <EmptyState
                            title="Chưa có giao dịch"
                            description="Các giao dịch thanh toán sẽ xuất hiện ở đây"
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ngày</TableHead>
                                    <TableHead>Hoá đơn</TableHead>
                                    <TableHead>Số tiền</TableHead>
                                    <TableHead>Phương thức</TableHead>
                                    <TableHead>Mã GD</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Ghi chú</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment._id}>
                                        <TableCell>{formatDate(payment.createdAt)}</TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {payment.billId ? (
                                                <a
                                                    href={`/bills/${typeof payment.billId === 'string' ? payment.billId : payment.billId._id}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    #{(typeof payment.billId === 'string' ? payment.billId : payment.billId._id)?.slice(-6)}
                                                </a>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium text-green-600">
                                            +{formatCurrency(payment.amount)}
                                        </TableCell>
                                        <TableCell>
                                            {METHOD_LABELS[payment.method] || payment.method}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-muted-foreground">
                                            {payment.transactionId || '—'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={STATUS_COLORS[payment.status || 'SUCCESS'] || ''}>
                                                {payment.status || 'SUCCESS'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {payment.note || '—'}
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
