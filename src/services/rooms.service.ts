import api from '@/lib/axios';
import { ApiResponse, Room, CreateRoomRequest, UpdateRoomRequest } from '@/types';

const BASE = '/rooms';

export const roomsService = {
  create: (data: CreateRoomRequest) =>
    api.post<ApiResponse<Room>>(BASE, data).then((r) => r.data.data),

  findAll: (propertyId?: string) =>
    api
      .get<ApiResponse<Room[]>>(BASE, {
        params: propertyId ? { propertyId } : undefined,
      })
      .then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<ApiResponse<Room>>(`${BASE}/${id}`).then((r) => r.data.data),

  update: (id: string, data: UpdateRoomRequest) =>
    api.patch<ApiResponse<Room>>(`${BASE}/${id}`, data).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete<ApiResponse<Room>>(`${BASE}/${id}`).then((r) => r.data.data),
};
