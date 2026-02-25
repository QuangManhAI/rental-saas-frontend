'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/shared/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav, BottomNav } from '@/components/layout/mobile-nav';
import { useSidebarStore } from '@/stores/sidebar.store';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = useSidebarStore((s) => s.collapsed);

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Sidebar />
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <BottomNav />

        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            collapsed ? 'lg:pl-16' : 'lg:pl-64',
          )}
        >
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="p-4 pb-20 lg:pb-6 lg:p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
