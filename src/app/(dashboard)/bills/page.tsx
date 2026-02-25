'use client';

import Link from 'next/link';
import { useBills, useDeleteBill } from '@/hooks/use-bills';
import { PageHeader, EmptyState, LoadingSkeleton, ConfirmDialog } from '@/components/shared';
import { ROUTES } from '@/constants';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Wand2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { BillStatus } from '@/types/enums';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { Bill } from '@/types';

type StatusTab = 'all' | BillStatus;

const STATUS_TABS: { key: StatusTab; labelKey: string }[] = [
  { key: 'all', labelKey: 'bills.statusAll' },
  { key: BillStatus.UNPAID, labelKey: 'bills.statusUnpaid' },
  { key: BillStatus.PARTIAL, labelKey: 'bills.statusPartial' },
  { key: BillStatus.PAID, labelKey: 'bills.statusPaid' },
  { key: BillStatus.OVERDUE, labelKey: 'bills.statusOverdue' },
];

const STATUS_BADGE_CLASS: Record<BillStatus, string> = {
  [BillStatus.UNPAID]: 'bg-red-100 text-red-700',
  [BillStatus.PARTIAL]: 'bg-yellow-100 text-yellow-700',
  [BillStatus.PAID]: 'bg-green-100 text-green-700',
  [BillStatus.OVERDUE]: 'bg-orange-100 text-orange-700',
};

const STATUS_LABEL: Record<BillStatus, string> = {
  [BillStatus.UNPAID]: 'Chưa thu',
  [BillStatus.PARTIAL]: 'Thu một phần',
  [BillStatus.PAID]: 'Đã thu',
  [BillStatus.OVERDUE]: 'Quá hạn',
};

export default function BillsPage() {
  const { data, isLoading } = useBills();
  const deleteMut = useDeleteBill();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<StatusTab>('all');

  const allBills: Bill[] = data ?? [];

  const filteredBills =
    activeTab === 'all'
      ? allBills
      : allBills.filter((b) => b.status === activeTab);

  const tabCounts = STATUS_TABS.reduce(
    (acc, tab) => {
      acc[tab.key] =
        tab.key === 'all'
          ? allBills.length
          : allBills.filter((b) => b.status === tab.key).length;
      return acc;
    },
    {} as Record<StatusTab, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('bills.title')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('bills.description')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.BILL_BULK}>
              <Wand2 className="mr-2 h-4 w-4" />
              {t('bills.bulkCreate')}
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={ROUTES.BILL_NEW}>
              <Plus className="mr-2 h-4 w-4" />
              {t('bills.createBill')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px',
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900',
            )}
          >
            {t(tab.labelKey)}
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-full text-xs px-1.5 py-0.5 min-w-[20px]',
                activeTab === tab.key
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-500',
              )}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : !filteredBills.length ? (
        <EmptyState description={t('bills.noBills')} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('bills.billCode')}</TableHead>
                <TableHead>{t('bills.monthYear')}</TableHead>
                <TableHead>{t('bills.roomRent')}</TableHead>
                <TableHead>{t('bills.electricCost')}</TableHead>
                <TableHead>{t('bills.waterCost')}</TableHead>
                <TableHead>{t('bills.totalAmount')}</TableHead>
                <TableHead>{t('bills.paidAmount')}</TableHead>
                <TableHead>{t('bills.status')}</TableHead>
                <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((b) => (
                <TableRow key={b._id}>
                  <TableCell className="font-mono text-sm">
                    #{b._id.slice(-6)}
                  </TableCell>
                  <TableCell>
                    {`${String(b.month).padStart(2, '0')}/${b.year}`}
                  </TableCell>
                  <TableCell>{formatCurrency(b.roomPrice)}</TableCell>
                  <TableCell>{formatCurrency(b.electricCost)}</TableCell>
                  <TableCell>{formatCurrency(b.waterCost)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(b.totalAmount)}
                  </TableCell>
                  <TableCell>{formatCurrency(b.paidAmount)}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex text-xs font-medium px-2 py-0.5 rounded-full',
                        STATUS_BADGE_CLASS[b.status],
                      )}
                    >
                      {STATUS_LABEL[b.status]}
                    </span>
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
