'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AiChatButton } from '@/components/ai-agent/ai-chat-button';
import { useSidebarStore } from '@/stores/sidebar.store';
import { cn } from '@/lib/utils';

export function LayoutDesktop({ children }: { children: React.ReactNode }) {
    const collapsed = useSidebarStore((s) => s.collapsed);
    const pathname = usePathname();
    const isAiAgent = pathname.startsWith('/ai-agent');

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Sidebar />
            <AiChatButton />
            <div
                className={cn(
                    'transition-all duration-300 ease-in-out',
                    collapsed ? 'pl-16' : 'pl-64',
                )}
            >
                <Topbar onMenuClick={() => { }} />
                <main className={cn('p-6', isAiAgent ? 'pb-4' : 'pb-8')}>
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
