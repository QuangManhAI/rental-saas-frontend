import { ContractStatus } from './enums';

export interface Contract {
  _id: string;
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  deposit: number;
  rentPrice: number;
  status: ContractStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractRequest {
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  deposit?: number;
  rentPrice: number;
}
