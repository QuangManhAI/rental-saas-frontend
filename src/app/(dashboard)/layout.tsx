'use client';


import { AuthGuard } from '@/components/shared/auth-guard';
import { LayoutMobile } from '@/components/layout/layout-mobile';
import { LayoutDesktop } from '@/components/layout/layout-desktop';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="lg:hidden">
        <LayoutMobile>{children}</LayoutMobile>
      </div>
      <div className="hidden lg:block">
        <LayoutDesktop>{children}</LayoutDesktop>
      </div>
    </AuthGuard>
  );
}
