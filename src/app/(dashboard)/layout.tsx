'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/shared/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav, BottomNav } from '@/components/layout/mobile-nav';
import { AiChatButton } from '@/components/ai-agent/ai-chat-button';
import { useSidebarStore } from '@/stores/sidebar.store';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = useSidebarStore((s) => s.collapsed);
  const pathname = usePathname();
  const isAiAgent = pathname === '/ai-agent';

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Sidebar />
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <BottomNav />
        <AiChatButton />

        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            collapsed ? 'lg:pl-16' : 'lg:pl-64',
          )}
        >
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className={cn('p-4 lg:pb-6 lg:p-6', isAiAgent ? 'pb-4' : 'pb-20')}>
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
