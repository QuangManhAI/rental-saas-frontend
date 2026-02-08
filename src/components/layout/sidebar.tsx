'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';
import { Building2 } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <Building2 className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">Rental SaaS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div className="border-t px-4 py-3">
          <p className="text-sm font-medium truncate">{user.fullName}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      )}
    </aside>
  );
}
