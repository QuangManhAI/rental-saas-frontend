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
import { motion, AnimatePresence } from 'framer-motion';

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
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl transition-all duration-300 ease-in-out z-20',
          collapsed ? 'lg:w-16' : 'lg:w-64',
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex h-16 items-center gap-3 px-4 border-b border-slate-100 shrink-0 overflow-hidden hover:bg-slate-50/80 transition-all duration-200 group">
          <motion.div
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200 shrink-0"
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Building2 className="h-5 w-5" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap"
              >
                Rental SaaS
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            const linkEl = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out',
                  collapsed ? 'justify-center' : '',
                  isActive
                    ? 'text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-indigo-50 rounded-xl ring-1 ring-indigo-200/60 shadow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Hover background */}
                {!isActive && (
                  <span className="absolute inset-0 rounded-xl bg-slate-100/0 transition-colors duration-200 group-hover:bg-slate-50" />
                )}

                <item.icon
                  className={cn(
                    'relative z-10 h-5 w-5 shrink-0 transition-colors duration-200',
                    isActive
                      ? 'text-indigo-600'
                      : 'text-slate-400 group-hover:text-slate-600',
                  )}
                />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
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
        <motion.button
          onClick={toggle}
          className="absolute top-[72px] -right-3 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
          whileHover={{ scale: 1.15, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          </motion.div>
        </motion.button>
      </aside>
    </TooltipProvider>
  );
}
