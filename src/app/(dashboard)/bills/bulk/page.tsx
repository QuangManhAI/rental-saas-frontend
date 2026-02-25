'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContracts } from '@/hooks/use-contracts';
import { useQueryClient } from '@tanstack/react-query';
import { billsService } from '@/services/bills.service';
import { queryKeys } from '@/constants';
import { LoadingSkeleton } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContractStatus } from '@/types/enums';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Zap, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import type { Contract } from '@/types';

interface MeterEntry {
  contractId: string;
  roomName: string;
  rentPrice: number;
  electricOldIndex: number;
  electricNewIndex: number;
  waterOldIndex: number;
  waterNewIndex: number;
}

const STEPS = [
  { id: 1, label: 'Tháng/Năm & Đơn giá' },
  { id: 2, label: 'Chọn phòng' },
  { id: 3, label: 'Nhập chỉ số' },
  { id: 4, label: 'Xác nhận' },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, idx) => (
        <div key={step.id} className="flex items-center gap-2 flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors',
                step.id < current
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : step.id === current
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-slate-300 text-slate-400',
              )}
            >
              {step.id < current ? <CheckCircle2 className="h-4 w-4" /> : step.id}
            </div>
            <span
              className={cn(
                'text-xs hidden sm:block',
                step.id === current ? 'text-indigo-600 font-medium' : 'text-slate-400',
              )}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={cn(
                'h-px flex-1 mt-[-16px]',
                step.id < current ? 'bg-indigo-600' : 'bg-slate-200',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function getRoomName(contract: Contract): string {
  if (typeof contract.roomId === 'object' && contract.roomId !== null) {
    return (contract.roomId as { name?: string }).name ?? 'Phòng không tên';
  }
  return `Phòng ${contract.roomId}`;
}

export default function BulkBillPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: contracts, isLoading } = useContracts();
  const qc = useQueryClient();

  const [step, setStep] = useState(1);
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [electricRate, setElectricRate] = useState(3500);
  const [waterRate, setWaterRate] = useState(10000);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [meters, setMeters] = useState<Record<string, MeterEntry>>({});
  const [submitting, setSubmitting] = useState(false);

  const activeContracts = (contracts ?? []).filter(
    (c) => c.status === ContractStatus.ACTIVE,
  );

  const selectedContracts = activeContracts.filter((c) =>
    selectedIds.has(c._id),
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // init meter entry if not present
        const contract = activeContracts.find((c) => c._id === id);
        if (contract && !meters[id]) {
          setMeters((m) => ({
            ...m,
            [id]: {
              contractId: id,
              roomName: getRoomName(contract),
              rentPrice: contract.rentPrice,
              electricOldIndex: 0,
              electricNewIndex: 0,
              waterOldIndex: 0,
              waterNewIndex: 0,
            },
          }));
        }
      }
      return next;
    });
  }

  function updateMeter(
    id: string,
    field: keyof Omit<MeterEntry, 'contractId' | 'roomName' | 'rentPrice'>,
    value: number,
  ) {
    setMeters((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  function calcBillTotal(entry: MeterEntry) {
    const elec = Math.max(0, entry.electricNewIndex - entry.electricOldIndex) * electricRate;
    const water = Math.max(0, entry.waterNewIndex - entry.waterOldIndex) * waterRate;
    return entry.rentPrice + elec + water;
  }

  async function handleSubmit() {
    setSubmitting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      const entry = meters[id];
      if (!entry) continue;
      try {
        await billsService.create({
          contractId: id,
          month,
          year,
          electricOldIndex: entry.electricOldIndex,
          electricNewIndex: entry.electricNewIndex,
          electricRate,
          waterOldIndex: entry.waterOldIndex,
          waterNewIndex: entry.waterNewIndex,
          waterRate,
        });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    setSubmitting(false);
    if (successCount > 0) {
      await qc.invalidateQueries({ queryKey: queryKeys.bills.all });
      toast.success(`Đã tạo ${successCount} hoá đơn thành công`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} hoá đơn tạo thất bại`);
    }
    router.push(ROUTES.BILLS);
  }

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {t('bills.wizardTitle')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tạo hoá đơn cho nhiều phòng cùng lúc
        </p>
      </div>

      <StepIndicator current={step} />

      {/* STEP 1: Month/Year + Rates */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('bills.wizardStep1')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('common.month')}</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('common.year')}</Label>
                <Input
                  type="number"
                  min={2020}
                  max={2100}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-yellow-500" />
                  Đơn giá điện (đ/kWh)
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={electricRate}
                  onChange={(e) => setElectricRate(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Droplets className="h-3.5 w-3.5 text-blue-500" />
                  Đơn giá nước (đ/m³)
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={waterRate}
                  onChange={(e) => setWaterRate(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              {t('common.cancel')}
            </Button>
            <Button onClick={() => setStep(2)}>
              {t('common.next')} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: Select rooms */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t('bills.wizardStep2')} — {selectedIds.size} đã chọn
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeContracts.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                Không có hợp đồng đang hoạt động
              </p>
            ) : (
              <div className="space-y-2">
                {activeContracts.map((c) => {
                  const isSelected = selectedIds.has(c._id);
                  const roomName = getRoomName(c);
                  return (
                    <div
                      key={c._id}
                      onClick={() => toggleSelect(c._id)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300',
                      )}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{roomName}</p>
                        <p className="text-xs text-slate-500">
                          {formatCurrency(c.rentPrice)}/tháng
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> {t('common.previous')}
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={selectedIds.size === 0}
            >
              {t('common.next')} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: Enter meter readings */}
      {step === 3 && (
        <div className="space-y-4">
          {selectedContracts.map((c) => {
            const entry = meters[c._id];
            if (!entry) return null;
            const roomName = getRoomName(c);
            return (
              <Card key={c._id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-800">
                    {roomName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-xs">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      {t('bills.electricOld')}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={entry.electricOldIndex}
                      onChange={(e) =>
                        updateMeter(c._id, 'electricOldIndex', Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-xs">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      {t('bills.electricNew')}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={entry.electricNewIndex}
                      onChange={(e) =>
                        updateMeter(c._id, 'electricNewIndex', Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-xs">
                      <Droplets className="h-3 w-3 text-blue-500" />
                      {t('bills.waterOld')}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={entry.waterOldIndex}
                      onChange={(e) =>
                        updateMeter(c._id, 'waterOldIndex', Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-xs">
                      <Droplets className="h-3 w-3 text-blue-500" />
                      {t('bills.waterNew')}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={entry.waterNewIndex}
                      onChange={(e) =>
                        updateMeter(c._id, 'waterNewIndex', Number(e.target.value))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> {t('common.previous')}
            </Button>
            <Button onClick={() => setStep(4)}>
              {t('common.next')} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & confirm */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('bills.wizardStep4')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 mb-4">
              Tháng <strong>{month}/{year}</strong> — {selectedIds.size} phòng
            </div>
            <div className="space-y-3">
              {selectedContracts.map((c) => {
                const entry = meters[c._id];
                if (!entry) return null;
                const total = calcBillTotal(entry);
                const elecUsage = Math.max(0, entry.electricNewIndex - entry.electricOldIndex);
                const waterUsage = Math.max(0, entry.waterNewIndex - entry.waterOldIndex);
                return (
                  <div
                    key={c._id}
                    className="flex items-start justify-between p-3 rounded-lg border border-slate-200"
                  >
                    <div>
                      <p className="font-medium text-sm">{entry.roomName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Điện: {elecUsage} kWh × {formatCurrency(electricRate)} |
                        Nước: {waterUsage} m³ × {formatCurrency(waterRate)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Tiền phòng: {formatCurrency(entry.rentPrice)}
                      </p>
                    </div>
                    <p className="font-bold text-indigo-600 text-sm shrink-0">
                      {formatCurrency(total)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <span className="font-semibold text-slate-700">Tổng cộng</span>
              <span className="text-lg font-bold text-indigo-700">
                {formatCurrency(
                  selectedContracts.reduce((sum, c) => {
                    const entry = meters[c._id];
                    return sum + (entry ? calcBillTotal(entry) : 0);
                  }, 0),
                )}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> {t('common.previous')}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Đang tạo...' : t('common.finish')}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
