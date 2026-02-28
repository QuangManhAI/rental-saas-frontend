'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useI18nStore } from '@/stores/i18n.store';
import { useLogout } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Menu, Globe } from 'lucide-react';
import Link from 'next/link';
import { ROUTES, NAV_ITEMS } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NotificationBell } from './notification-bell';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { t } = useTranslation();
  const { locale, setLocale } = useI18nStore();
  const pathname = usePathname();

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Breadcrumb: find active nav item
  const activeItem = NAV_ITEMS.find(
    (item) =>
      pathname === item.href ||
      (item.href !== '/' && pathname.startsWith(item.href)),
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl px-4 lg:px-6 transition-all duration-300">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Rental SaaS</span>
        {activeItem && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">
              {activeItem.label}
            </span>
          </>
        )}
      </div>

      <div className="flex-1" />

      {/* Language switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            onClick={() => setLocale('vi')}
            className={cn(locale === 'vi' && 'font-semibold text-indigo-600')}
          >
            🇻🇳 Tiếng Việt
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setLocale('en')}
            className={cn(locale === 'en' && 'font-semibold text-indigo-600')}
          >
            🇬🇧 English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notification bell */}
      <NotificationBell />

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                {initials ?? 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={ROUTES.PROFILE}>
              <User className="mr-2 h-4 w-4" />
              {t('common.profile')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout.mutate()}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('common.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
