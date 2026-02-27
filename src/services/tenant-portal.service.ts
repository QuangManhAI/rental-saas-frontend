import tenantApi from '@/lib/tenant-api';
import api from '@/lib/axios';
import type { Bill } from '@/types';

export interface TenantBill extends Bill {
  roomName?: string;
}

export interface TenantPayment {
  _id: string;
  billId: string | { _id: string; month: number; year: number };
  amount: number;
  method: string;
  transactionId?: string;
  status?: string;
  note?: string;
  paidAt?: string;
  createdAt: string;
}

export interface TenantProfile {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  identityCard?: string;
  address?: string;
  dob?: string;
  telegramChatId?: string;
}

export interface VerifyTokenResponse {
  accessToken: string;
  tenant: {
    fullName: string;
    email?: string;
    phone?: string;
  };
}

export interface LoginResponse {
  accessToken: string;
  tenant: {
    fullName: string;
    email?: string;
    phone?: string;
  };
}

export const tenantAuthService = {
  /** @deprecated Verify magic-link token */
  verify: (token: string): Promise<VerifyTokenResponse> =>
    api.post<{ data: VerifyTokenResponse }>('/tenant-auth/verify', { token }).then((r) => r.data.data),

  /** Activate account with token + password */
  activate: (token: string, password: string): Promise<LoginResponse> =>
    api.post<{ data: LoginResponse }>('/tenant-auth/activate', { token, password }).then((r) => r.data.data),

  /** Login with email + password */
  login: (email: string, password: string): Promise<LoginResponse> =>
    api.post<{ data: LoginResponse }>('/tenant-auth/login', { email, password }).then((r) => r.data.data),

  /** Request forgot-password OTP */
  requestForgotPasswordOtp: (email: string): Promise<{ message: string }> =>
    api.post<{ data: { message: string } }>('/tenant-auth/forgot-password/request-otp', { email }).then((r) => r.data.data),

  /** Verify OTP and set new password */
  verifyForgotPasswordOtp: (email: string, code: string, newPassword: string): Promise<{ message: string }> =>
    api.post<{ data: { message: string } }>('/tenant-auth/forgot-password/verify-otp', { email, code, newPassword }).then((r) => r.data.data),

  /** Get tenant profile using tenant JWT */
  getProfile: (): Promise<TenantProfile> =>
    tenantApi.get<{ data: TenantProfile }>('/tenant-auth/profile').then((r) => r.data.data),

  /** Refresh tenant JWT */
  refresh: (): Promise<{ accessToken: string }> =>
    tenantApi.post<{ data: { accessToken: string } }>('/tenant-auth/refresh').then((r) => r.data.data),
};

export const tenantPortalService = {
  /**
   * Get all bills for the authenticated tenant (via active contracts).
   */
  getBills: (): Promise<TenantBill[]> =>
    tenantApi.get<{ data: TenantBill[] }>('/tenant-portal/bills').then((r) => r.data.data),

  /**
   * Get one bill detail.
   */
  getBill: (id: string): Promise<TenantBill> =>
    tenantApi.get<{ data: TenantBill }>(`/tenant-portal/bills/${id}`).then((r) => r.data.data),

  /**
   * Get payment history for the tenant.
   */
  getPayments: (): Promise<TenantPayment[]> =>
    tenantApi.get<{ data: TenantPayment[] }>('/tenant-portal/payments').then((r) => r.data.data),

  /**
   * Get the VietQR code URL for a bill (tenant endpoint).
   */
  getBillQr: (billId: string): Promise<{ qrDataUrl: string; amount: number }> =>
    tenantApi.get<{ data: { qrDataUrl: string; amount: number } }>(`/bills/${billId}/qr/tenant`).then((r) => r.data.data),

  /**
   * Create MoMo payment for a bill.
   */
  createMomoPayment: (billId: string): Promise<{ payUrl: string; orderId: string; qrCodeUrl?: string }> =>
    tenantApi.post<{ data: { payUrl: string; orderId: string; qrCodeUrl?: string } }>('/tenant-portal/pay/momo', { billId }).then((r) => r.data.data),

  /**
   * Create VNPay payment for a bill.
   */
  createVnpayPayment: (billId: string): Promise<{ paymentUrl: string; txnRef: string }> =>
    tenantApi.post<{ data: { paymentUrl: string; txnRef: string } }>('/tenant-portal/pay/vnpay', { billId }).then((r) => r.data.data),

  /**
   * Get available payment methods for this tenant's owner.
   */
  getPaymentMethods: (): Promise<{ id: string; name: string; available: boolean }[]> =>
    tenantApi.get<{ data: { id: string; name: string; available: boolean }[] }>('/tenant-portal/payment-methods').then((r) => r.data.data),
};
