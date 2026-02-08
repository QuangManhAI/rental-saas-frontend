// ──────────────────────────────────────────────
// Enums — mirrored from backend
// ──────────────────────────────────────────────

export enum Role {
  OWNER = 'owner',
  STAFF = 'staff',
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
}

export enum BillStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  OTHER = 'OTHER',
}
