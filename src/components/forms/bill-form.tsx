'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { billSchema, type BillFormValues } from '@/lib/validators';
import { Contract } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface BillFormProps {
  contracts: Contract[];
  onSubmit: (data: BillFormValues) => void;
  loading?: boolean;
}

export function BillForm({ contracts, onSubmit, loading }: BillFormProps) {
  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      contractId: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      electricOldIndex: 0,
      electricNewIndex: 0,
      electricRate: 0,
      waterOldIndex: 0,
      waterNewIndex: 0,
      waterRate: 0,
      otherFee: 0,
    },
  });

  const watched = useWatch({ control: form.control });
  const selectedContract = contracts.find((c) => c._id === watched.contractId);

  const electricCost =
    ((watched.electricNewIndex ?? 0) - (watched.electricOldIndex ?? 0)) *
    (watched.electricRate ?? 0);
  const waterCost =
    ((watched.waterNewIndex ?? 0) - (watched.waterOldIndex ?? 0)) *
    (watched.waterRate ?? 0);
  const roomPrice = selectedContract?.rentPrice ?? 0;
  const total = roomPrice + electricCost + waterCost + (watched.otherFee ?? 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="contractId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hợp đồng (đang hoạt động)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hợp đồng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contracts.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      #{c._id.slice(-6)} — {formatCurrency(c.rentPrice)}/tháng
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tháng</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={12} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm</FormLabel>
                <FormControl>
                  <Input type="number" min={2020} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Electric */}
        <div className="rounded-md border p-4 space-y-3">
          <h3 className="font-semibold">Tiền điện</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormField control={form.control} name="electricOldIndex" render={({ field }) => (
              <FormItem>
                <FormLabel>Chỉ số cũ</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="electricNewIndex" render={({ field }) => (
              <FormItem>
                <FormLabel>Chỉ số mới</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="electricRate" render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn giá (₫/kWh)</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <p className="text-sm text-muted-foreground">
            Thành tiền: <strong>{formatCurrency(electricCost)}</strong>
          </p>
        </div>

        {/* Water */}
        <div className="rounded-md border p-4 space-y-3">
          <h3 className="font-semibold">Tiền nước</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormField control={form.control} name="waterOldIndex" render={({ field }) => (
              <FormItem>
                <FormLabel>Chỉ số cũ</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="waterNewIndex" render={({ field }) => (
              <FormItem>
                <FormLabel>Chỉ số mới</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="waterRate" render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn giá (₫/m³)</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <p className="text-sm text-muted-foreground">
            Thành tiền: <strong>{formatCurrency(waterCost)}</strong>
          </p>
        </div>

        <FormField control={form.control} name="otherFee" render={({ field }) => (
          <FormItem>
            <FormLabel>Phí khác (₫)</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Preview */}
        <div className="rounded-md bg-muted p-4">
          <p className="text-sm">Tiền phòng: <strong>{formatCurrency(roomPrice)}</strong></p>
          <p className="text-sm">Tiền điện: <strong>{formatCurrency(electricCost)}</strong></p>
          <p className="text-sm">Tiền nước: <strong>{formatCurrency(waterCost)}</strong></p>
          <p className="text-sm">Phí khác: <strong>{formatCurrency(watched.otherFee ?? 0)}</strong></p>
          <hr className="my-2" />
          <p className="text-lg font-bold">Tổng cộng: {formatCurrency(total)}</p>
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Tạo hoá đơn
        </Button>
      </form>
    </Form>
  );
}
