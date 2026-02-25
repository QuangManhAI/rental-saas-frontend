'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, FileText, CreditCard, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenantAuthStore } from '@/stores/tenant-auth.store';

const NAV_ITEMS = [
  { href: '/tenant', icon: Home, label: 'Trang chủ' },
  { href: '/tenant/bills', icon: FileText, label: 'Hóa đơn' },
  { href: '/tenant/payments', icon: CreditCard, label: 'Thanh toán' },
  { href: '/tenant/profile', icon: User, label: 'Hồ sơ' },
];

function TenantBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-stretch">
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = href === '/tenant' ? pathname === '/tenant' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors',
              isActive ? 'text-indigo-600' : 'text-slate-500',
            )}
          >
            <Icon className={cn('h-5 w-5', isActive && 'text-indigo-600')} />
            <span className="leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useTenantAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/tenant/login') {
      router.replace('/tenant/login');
    }
  }, [isAuthenticated, pathname, router]);

  // Show login page without the layout shell
  if (pathname === '/tenant/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-semibold text-indigo-700">Cổng thông tin thuê trọ</p>
      </header>

      {/* Page content */}
      <main className="pb-20 max-w-lg mx-auto px-4 py-4">
        {children}
      </main>

      <TenantBottomNav />
    </div>
  );
}
