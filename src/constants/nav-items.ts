import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  Users,
  FileText,
  Receipt,
  CreditCard,
  UserCog,
  Settings,
  Sparkles,
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
    label: 'Giao dịch',
    href: ROUTES.PAYMENTS,
    icon: CreditCard,
  },
  {
    label: 'Trợ lý AI',
    href: ROUTES.AI_AGENT,
    icon: Sparkles,
  },
  {
    label: 'Cài đặt TT',
    href: ROUTES.PAYMENT_SETTINGS,
    icon: Settings,
    roles: [Role.OWNER],
  },
  {
    label: 'Nhân viên',
    href: ROUTES.USERS,
    icon: UserCog,
    roles: [Role.OWNER],
  },
];

