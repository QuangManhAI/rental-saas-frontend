'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { paymentSchema, type PaymentFormValues } from '@/lib/validators';
import { PaymentMethod } from '@/types/enums';
import { Loader2 } from 'lucide-react';

interface PaymentFormProps {
  defaultBillId?: string;
  onSubmit: (data: PaymentFormValues) => void;
  loading?: boolean;
}

export function PaymentForm({
  defaultBillId,
  onSubmit,
  loading,
}: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      billId: defaultBillId ?? '',
      amount: 0,
      method: PaymentMethod.CASH,
      note: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        {!defaultBillId && (
          <FormField
            control={form.control}
            name="billId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã hoá đơn</FormLabel>
                <FormControl>
                  <Input placeholder="ID hoá đơn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền (₫)</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phương thức</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PaymentMethod.CASH}>Tiền mặt</SelectItem>
                  <SelectItem value={PaymentMethod.TRANSFER}>Chuyển khoản</SelectItem>
                  <SelectItem value={PaymentMethod.OTHER}>Khác</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Ghi chú thêm..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Thanh toán
        </Button>
      </form>
    </Form>
  );
}
