'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/shared/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Sidebar />
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="lg:pl-64">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
