import { RoomStatus } from './enums';

export interface Room {
  _id: string;
  name: string;
  price: number;
  area?: number;
  status: RoomStatus;
  description?: string;
  propertyId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomRequest {
  name: string;
  price: number;
  area?: number;
  propertyId: string;
  description?: string;
  status?: RoomStatus;
}

export type UpdateRoomRequest = Partial<CreateRoomRequest>;
