'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { NAV_ITEMS } from '@/constants';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/layout/notification-bell';
import { AiChatButton } from '@/components/ai-agent/ai-chat-button';
import {
  Building2, Menu, X, LogOut, User, Globe,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Bottom nav: first 5 items
const BOTTOM_NAV_ITEMS = NAV_ITEMS.slice(0, 5);

// ─── Mobile Topbar ───────────────────────────────────────────────────────────
// Solid bg, no backdrop-blur (expensive on mobile GPUs).

function MobileTopbar({ onMenuToggle, menuOpen }: { onMenuToggle: () => void; menuOpen: boolean }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-3">
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-1 rounded-lg active:bg-slate-100"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-sm text-slate-900">Rental SaaS</span>
      </Link>

      <div className="flex-1" />

      <NotificationBell />

      <MobileUserMenu />
    </header>
  );
}

// ─── Mobile User Menu ────────────────────────────────────────────────────────

function MobileUserMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  const initials = user?.fullName
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xs">
            {initials ?? 'U'}
          </AvatarFallback>
        </Avatar>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 active:bg-slate-50">
              <User className="w-4 h-4" /> Hồ sơ
            </Link>
            <button onClick={() => { logout.mutate(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 active:bg-red-50">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Mobile Sidebar (CSS slide, no Sheet/framer-motion) ──────────────────────

function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/30 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <nav
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center gap-2 px-4 border-b border-slate-100 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-slate-900">Rental SaaS</span>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 rounded-l-none'
                    : 'text-slate-600 active:bg-slate-50 border-l-4 border-transparent',
                )}
              >
                <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

// ─── Mobile Bottom Nav ───────────────────────────────────────────────────────

function MobileBottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  if (pathname.startsWith('/ai-agent')) return null;

  const visibleItems = BOTTOM_NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white h-16 px-2">
      {visibleItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[52px]',
              isActive ? 'text-indigo-600' : 'text-slate-500',
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ─── Mobile Dashboard Layout ─────────────────────────────────────────────────
// Pure CSS transitions, no framer-motion, no backdrop-blur.

export function DashboardLayoutMobile({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isAiAgent = pathname.startsWith('/ai-agent');

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen bg-white">
      <MobileSidebar open={sidebarOpen} onClose={closeSidebar} />
      <MobileBottomNav />
      <AiChatButton />

      <MobileTopbar onMenuToggle={toggleSidebar} menuOpen={sidebarOpen} />

      <main className={cn('p-4', isAiAgent ? 'pb-4' : 'pb-20')}>
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
