import { z } from 'zod';
import { RoomStatus, PaymentMethod, NotificationType } from '@/types/enums';

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  phone: z.string().optional(),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

// ──────────────────────────────────────────────
// Properties
// ──────────────────────────────────────────────

export const propertySchema = z.object({
  name: z.string().min(1, 'Tên nhà trọ là bắt buộc').max(100),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  description: z.string().optional(),
});
export type PropertyFormValues = z.infer<typeof propertySchema>;

// ──────────────────────────────────────────────
// Rooms
// ──────────────────────────────────────────────

export const roomSchema = z.object({
  name: z.string().min(1, 'Tên phòng là bắt buộc'),
  price: z.coerce.number().min(0, 'Giá phải >= 0'),
  area: z.coerce.number().min(0).optional(),
  propertyId: z.string().min(1, 'Chọn nhà trọ'),
  description: z.string().optional(),
  status: z.nativeEnum(RoomStatus).optional(),
});
export type RoomFormValues = z.infer<typeof roomSchema>;

// ──────────────────────────────────────────────
// Tenants
// ──────────────────────────────────────────────

export const tenantSchema = z.object({
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  phone: z.string().regex(/^[0-9]{9,15}$/, 'SĐT phải từ 9-15 chữ số'),
  identityCard: z.string().min(9, 'CCCD/CMND ít nhất 9 ký tự'),
  address: z.string().optional(),
  dob: z.string().optional(),
});
export type TenantFormValues = z.infer<typeof tenantSchema>;

// ──────────────────────────────────────────────
// Contracts
// ──────────────────────────────────────────────

export const contractSchema = z.object({
  roomId: z.string().min(1, 'Chọn phòng'),
  tenantId: z.string().min(1, 'Chọn khách thuê'),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
  deposit: z.coerce.number().min(0).optional(),
  rentPrice: z.coerce.number().min(0, 'Giá thuê phải >= 0'),
});
export type ContractFormValues = z.infer<typeof contractSchema>;

// ──────────────────────────────────────────────
// Bills
// ──────────────────────────────────────────────

export const billSchema = z.object({
  contractId: z.string().min(1, 'Chọn hợp đồng'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020),
  electricOldIndex: z.coerce.number().min(0),
  electricNewIndex: z.coerce.number().min(0),
  electricRate: z.coerce.number().min(0),
  waterOldIndex: z.coerce.number().min(0),
  waterNewIndex: z.coerce.number().min(0),
  waterRate: z.coerce.number().min(0),
  otherFee: z.coerce.number().min(0).optional(),
});
export type BillFormValues = z.infer<typeof billSchema>;

// ──────────────────────────────────────────────
// Payments
// ──────────────────────────────────────────────

export const paymentSchema = z.object({
  billId: z.string().min(1, 'Chọn hoá đơn'),
  amount: z.coerce.number().min(1, 'Số tiền tối thiểu là 1'),
  method: z.nativeEnum(PaymentMethod).optional(),
  note: z.string().optional(),
});
export type PaymentFormValues = z.infer<typeof paymentSchema>;

// ──────────────────────────────────────────────
// Users (Staff)
// ──────────────────────────────────────────────

export const userSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  phone: z.string().optional(),
});
export type UserFormValues = z.infer<typeof userSchema>;

export const userUpdateSchema = userSchema.partial().omit({ email: true });
export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;

// ──────────────────────────────────────────────
// Notifications
// ──────────────────────────────────────────────

export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Tiêu đề thông báo là bắt buộc').max(150, 'Tiêu đề tối đa 150 ký tự'),
  message: z.string().min(1, 'Nội dung thông báo là bắt buộc').max(2000, 'Nội dung tối đa 2000 ký tự'),
  type: z.nativeEnum(NotificationType),
  link: z.string().optional().or(z.literal('')),
});
export type CreateNotificationFormValues = z.infer<typeof createNotificationSchema>;
