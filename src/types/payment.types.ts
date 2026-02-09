import { PaymentMethod, PaymentStatus } from './enums';

export interface Payment {
  _id: string;
  billId: string | { _id: string; month: number; year: number };
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  status?: PaymentStatus;
  note?: string;
  ownerId: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  billId: string;
  amount: number;
  method?: PaymentMethod;
  note?: string;
}

