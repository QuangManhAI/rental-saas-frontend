'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Role } from '@/types/enums';

interface RoleGuardProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);

  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
