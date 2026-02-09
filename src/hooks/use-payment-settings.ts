'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import {
    paymentSettingsService,
    UpsertPaymentSettingsDto,
} from '@/services/payment-settings.service';
import { toast } from 'sonner';

export function usePaymentSettings() {
    return useQuery({
        queryKey: queryKeys.paymentSettings.current,
        queryFn: () => paymentSettingsService.get(),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useUpsertPaymentSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: UpsertPaymentSettingsDto) =>
            paymentSettingsService.upsert(dto),
        onSuccess: (data) => {
            // Optimistically update the cache with the returned data
            queryClient.setQueryData(queryKeys.paymentSettings.current, data);
            toast.success('Cài đặt thanh toán đã được lưu');
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || 'Lưu cài đặt thất bại'
            );
        },
    });
}
