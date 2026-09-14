// ──────────────────────────────────────────────
// Enums — mirrored from backend
// ──────────────────────────────────────────────

export enum Role {
  OWNER = 'owner',
  STAFF = 'staff',
  ADMIN = 'admin',
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
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum NotificationType {
  INFO = 'INFO',
  NEW_BILL = 'NEW_BILL',
  BILL_DUE = 'BILL_DUE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  CONTRACT_EXPIRING = 'CONTRACT_EXPIRING',
}

