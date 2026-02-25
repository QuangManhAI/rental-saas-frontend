'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';
import { useSidebarStore } from '@/stores/sidebar.store';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PlanBadge } from './plan-badge';

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { collapsed, toggle } = useSidebarStore();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out z-20',
          collapsed ? 'lg:w-16' : 'lg:w-64',
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex h-16 items-center gap-3 px-4 border-b border-slate-100 shrink-0 overflow-hidden hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-sm shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
              Rental SaaS
            </span>
          )}
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            const linkEl = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out',
                  collapsed ? 'justify-center' : '',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive
                      ? 'text-indigo-600'
                      : 'text-slate-400 group-hover:text-slate-600',
                  )}
                />
                {!collapsed && item.label}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return linkEl;
          })}
        </nav>

        {/* Bottom: user profile + plan — combined */}
        <div className="border-t border-slate-100 pt-2 shrink-0">
          <PlanBadge />
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={toggle}
          className="absolute top-[72px] -right-3 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors hover:bg-slate-50"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  );
}
