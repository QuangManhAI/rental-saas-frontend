import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  Users,
  FileText,
  Receipt,
  CreditCard,
  UserCog,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';
import { Role } from '@/types/enums';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** If set, only these roles can see this item */
  roles?: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Nhà trọ',
    href: ROUTES.PROPERTIES,
    icon: Building2,
  },
  {
    label: 'Phòng',
    href: ROUTES.ROOMS,
    icon: DoorOpen,
  },
  {
    label: 'Khách thuê',
    href: ROUTES.TENANTS,
    icon: Users,
  },
  {
    label: 'Khách hàng',
    href: ROUTES.CUSTOMERS,
    icon: UserCheck,
  },
  {
    label: 'Hợp đồng',
    href: ROUTES.CONTRACTS,
    icon: FileText,
  },
  {
    label: 'Hoá đơn',
    href: ROUTES.BILLS,
    icon: Receipt,
  },
  {
    label: 'Thanh toán',
    href: ROUTES.PAYMENT_NEW,
    icon: CreditCard,
  },
  {
    label: 'Nhân viên',
    href: ROUTES.USERS,
    icon: UserCog,
    roles: [Role.OWNER],
  },
];
