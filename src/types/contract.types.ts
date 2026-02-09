import { Room } from './room.types';
import { Tenant } from './tenant.types';
import { ContractStatus } from './enums';

export interface Contract {
  _id: string;
  roomId: string | Room;
  tenantId: string | Tenant;
  startDate: string;
  endDate: string;
  deposit: number;
  rentPrice: number;
  status: ContractStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  telegramLink?: string;
}

export interface CreateContractRequest {
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  deposit?: number;
  rentPrice: number;
}
