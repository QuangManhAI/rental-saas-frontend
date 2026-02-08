import { BillStatus } from './enums';

export interface Bill {
  _id: string;
  contractId: string;
  roomId: string;
  month: number;
  year: number;
  electricOldIndex: number;
  electricNewIndex: number;
  electricRate: number;
  electricCost: number;
  waterOldIndex: number;
  waterNewIndex: number;
  waterRate: number;
  waterCost: number;
  roomPrice: number;
  otherFee: number;
  totalAmount: number;
  paidAmount: number;
  status: BillStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillRequest {
  contractId: string;
  month: number;
  year: number;
  electricOldIndex: number;
  electricNewIndex: number;
  electricRate: number;
  waterOldIndex: number;
  waterNewIndex: number;
  waterRate: number;
  otherFee?: number;
}
