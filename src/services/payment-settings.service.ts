import api from '@/lib/axios';

export interface PaymentSettings {
    _id: string;
    ownerId: string;
    provider: 'MOMO' | 'VNPAY';
    momoPartnerCode?: string;
    momoAccessKey?: string;
    momoSecretKey?: string;
    vnpayTmnCode?: string;
    vnpayHashSecret?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpsertPaymentSettingsDto {
    provider?: 'MOMO' | 'VNPAY';
    momoPartnerCode?: string;
    momoAccessKey?: string;
    momoSecretKey?: string;
    vnpayTmnCode?: string;
    vnpayHashSecret?: string;
    isActive?: boolean;
}

export const paymentSettingsService = {
    get: () =>
        api.get<PaymentSettings>('/payment-settings').then((r) => r.data),

    upsert: (dto: UpsertPaymentSettingsDto) =>
        api.put<PaymentSettings>('/payment-settings', dto).then((r) => r.data),
};

