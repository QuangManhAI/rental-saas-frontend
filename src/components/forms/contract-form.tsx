'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { contractSchema, type ContractFormValues } from '@/lib/validators';
import { Room, Tenant } from '@/types';
import { Loader2 } from 'lucide-react';

interface ContractFormProps {
  rooms: Room[];
  tenants: Tenant[];
  defaultValues?: Partial<ContractFormValues>;
  onSubmit: (data: ContractFormValues) => void;
  loading?: boolean;
}

export function ContractForm({
  rooms,
  tenants,
  defaultValues,
  onSubmit,
  loading,
}: ContractFormProps) {
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema) as any,
    defaultValues: {
      roomId: '',
      tenantId: '',
      startDate: '',
      endDate: '',
      deposit: 0,
      rentPrice: 0,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
        {/* Room Selection */}
        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng (chỉ phòng trống)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={rooms.length === 0}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={rooms.length === 0 ? "Không có phòng trống" : "Chọn phòng"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r._id} value={r._id}>
                      {r.name} — {r.price.toLocaleString('vi-VN')} ₫
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tenant Selection */}
        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khách thuê</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={tenants.length === 0}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={tenants.length === 0 ? "Không có khách thuê" : "Chọn khách thuê"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.fullName} — {t.phone}
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <DatePickerField value={field.value} onChange={field.onChange} placeholder="Chọn ngày" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <DatePickerField value={field.value} onChange={field.onChange} placeholder="Chọn ngày" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá thuê (₫/tháng)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiền cọc (₫)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Tạo hợp đồng
        </Button>
      </form>
    </Form>
  );
}
