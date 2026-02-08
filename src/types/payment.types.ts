import { PaymentMethod } from './enums';

export interface Payment {
  _id: string;
  billId: string;
  amount: number;
  method: PaymentMethod;
  note?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  billId: string;
  amount: number;
  method?: PaymentMethod;
  note?: string;
}
