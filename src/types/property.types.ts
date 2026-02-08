export interface Property {
  _id: string;
  name: string;
  address: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  name: string;
  address: string;
  description?: string;
}

export type UpdatePropertyRequest = Partial<CreatePropertyRequest>;
