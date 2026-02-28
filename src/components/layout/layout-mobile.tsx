'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';
import { useI18nStore } from '@/stores/i18n.store';
import { useTranslation } from '@/hooks/use-translation';
import { useLogout } from '@/hooks/use-auth';
import { Building2, X, Menu, Globe, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/mobile-nav';
import { AiChatButton } from '@/components/ai-agent/ai-chat-button';
import { NotificationBell } from '@/components/layout/notification-bell';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ROUTES } from '@/constants';

export function LayoutMobile({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const user = useAuthStore((s) => s.user);
    const logout = useLogout();
    const { t } = useTranslation();
    const { locale, setLocale } = useI18nStore();
    const isAiAgent = pathname.startsWith('/ai-agent');

    // Close sidebar on route change
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const visibleItems = NAV_ITEMS.filter(
        (item) => !item.roles || (user && item.roles.includes(user.role)),
    );

    const initials = user?.fullName
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className={cn(
            'flex flex-col bg-slate-50',
            isAiAgent ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'
        )}>
            {/* Mobile Topbar - Solid white, no blur */}
            <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="-ml-2">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="font-semibold text-slate-900 truncate">
                        {NAV_ITEMS.find((i) => pathname === i.href || (i.href !== '/' && pathname.startsWith(i.href)))?.label ?? 'Rental SaaS'}
                    </span>
                </div>

                <div className="flex items-center gap-1">
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

                    <NotificationBell />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-1 md:ml-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xs">
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
                </div>
            </header>

            {/* Main Content */}
            <main className={cn('flex-1 w-full flex flex-col', isAiAgent ? 'p-0 pb-0' : 'p-4 pb-20')}>
                <div className={cn('mx-auto w-full max-w-7xl flex-1 flex flex-col', isAiAgent && 'max-w-none')}>
                    {children}
                </div>
            </main>

            {/* Bottom Nav & Chat */}
            <BottomNav />
            {/* We use standard relative fixed AiChatButton or layout renders it, it's global inside the layout */}
            <AiChatButton />

            {/* CSS-Only Sidebar & Overlay */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-slate-900/50 transition-opacity duration-300',
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={() => setOpen(false)}
            />

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shrink-0">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">Rental SaaS</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5 text-slate-500" />
                    </Button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {visibleItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-slate-600 hover:bg-slate-50'
                                )}
                            >
                                <item.icon className={cn('h-5 w-5', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </div>
    );
}
