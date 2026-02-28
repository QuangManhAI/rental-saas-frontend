'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';
import { Building2 } from 'lucide-react';

// Bottom nav shows the first 5 items
const BOTTOM_NAV_ITEMS = NAV_ITEMS.slice(0, 5);

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/** Sheet drawer — triggered by hamburger button in topbar */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="flex flex-row h-16 items-center gap-2 px-6 border-b">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Building2 className="h-6 w-6 text-primary" />
            <SheetTitle className="text-lg font-bold">Rental SaaS</SheetTitle>
          </Link>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
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
                  'flex items-center gap-3 rounded-r-md rounded-l-none px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border-l-4 border-transparent',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

/** Bottom navigation bar — only visible on mobile (<lg), hidden on AI agent page */
export function BottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  // Hide BottomNav on AI agent page — it uses full viewport
  if (pathname === '/ai-agent') return null;

  const visibleItems = BOTTOM_NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t bg-background h-16 px-2">
      {visibleItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[52px]',
              isActive
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-900',
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
