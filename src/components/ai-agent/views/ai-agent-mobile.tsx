'use client';

import { useState } from 'react';
import {
    Sparkles,
    MessageCircle,
    Loader2,
    Trash2,
    Plus,
    Bot,
    User,
    ChevronLeft,
    UserPlus,
    FileText,
    CreditCard,
    BarChart3,
    DoorOpen,
    AlertCircle,
    CalendarClock,
    Moon,
    Sun,
    type LucideIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PromptInputBox } from '@/components/ui/prompt-input-box';
import { TypewriterReveal } from '@/components/ui/typewriter-reveal';
import { AiAgentViewProps } from './ai-agent-desktop';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const SUGGESTIONS: { icon: LucideIcon; label: string; color: string }[] = [
    { icon: UserPlus, label: 'Thêm khách thuê', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { icon: FileText, label: 'Tạo hoá đơn', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    { icon: CreditCard, label: 'Ghi nhận thanh toán', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    { icon: BarChart3, label: 'Báo cáo doanh thu', color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40' },
    { icon: DoorOpen, label: 'Phòng trống?', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
    { icon: AlertCircle, label: 'Ai chưa thanh toán?', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40' },
    { icon: CalendarClock, label: 'HĐ sắp hết hạn?', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40' },
];

export function AiAgentMobile({
    messages,
    conversations,
    conversationId,
    isLoading,
    usage,
    scrollRef,
    sendMessage,
    switchConversation,
    startNewConversation,
    deleteConversation,
    statusText,
    stopStreaming,
    darkMode,
    setDarkMode,
    greeting,
    firstName,
}: AiAgentViewProps) {
    const router = useRouter();
    const [sheetOpen, setSheetOpen] = useState(false);
    const hasMessages = messages.length > 0;

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;
        await sendMessage(text);
    };

    return (
        <div className={cn(darkMode && 'dark', 'lg:hidden')}>
            <div className="flex flex-col h-[calc(100dvh-64px-32px)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">

                {/* ═══ Header ═══ */}
                <div className="flex items-center justify-between px-2 h-11 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex-shrink-0">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => router.back()}
                            className="p-1.5 -ml-0.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Conversation history sheet */}
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="text-left leading-tight">
                                        <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">RenTaff</p>
                                        <p className="text-[10px] text-slate-400">{conversations.length} hội thoại</p>
                                    </div>
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
                                <SheetHeader className="p-4 border-b border-slate-100 dark:border-slate-800 text-left">
                                    <SheetTitle className="text-base flex items-center justify-between">
                                        Lịch sử trò chuyện
                                        <button
                                            onClick={() => { startNewConversation(); setSheetOpen(false); }}
                                            className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
                                    {conversations.map((conv) => (
                                        <div
                                            key={conv._id}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                                                conversationId === conv._id
                                                    ? 'bg-violet-50 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium'
                                                    : 'text-slate-600 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800',
                                            )}
                                            onClick={() => { switchConversation(conv._id); setSheetOpen(false); }}
                                        >
                                            <MessageCircle className="w-4 h-4 opacity-40 flex-shrink-0" />
                                            <span className="truncate flex-1">{conv.title}</span>
                                            <button
                                                className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                onClick={(e) => { e.stopPropagation(); deleteConversation(conv._id); }}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {conversations.length === 0 && (
                                        <div className="flex flex-col items-center py-12 text-slate-400">
                                            <MessageCircle className="w-8 h-8 mb-2 opacity-30" />
                                            <p className="text-sm">Chưa có hội thoại</p>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Usage badge */}
                        {usage && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/30 border border-violet-200/60 dark:border-violet-700/40">
                                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">
                                    {usage.requests.used}/{usage.requests.limit}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={startNewConversation}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ═══ Messages / Empty State ═══ */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                    {!hasMessages && !isLoading ? (
                        /* ── Empty state ── */
                        <div className="flex flex-col items-center px-4 pt-8 pb-4">
                            {/* Avatar + Greeting */}
                            <div className="relative mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                            </div>

                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-0.5">
                                Chào buổi {greeting}, {firstName}!
                            </h2>
                            <p className="text-[13px] text-slate-400 dark:text-slate-500 mb-5">
                                Tôi có thể giúp gì cho bạn?
                            </p>

                            {/* Suggestion chips — 2-column grid */}
                            <div className="w-full grid grid-cols-2 gap-2 max-w-sm">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s.label}
                                        className={cn(
                                            'flex items-center gap-2 text-left text-[12px] font-medium px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 transition-all active:scale-[0.97]',
                                            'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300',
                                            'shadow-sm hover:shadow-md',
                                        )}
                                        onClick={() => sendMessage(s.label)}
                                    >
                                        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', s.color)}>
                                            <s.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="line-clamp-2 leading-tight">{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* ── Chat messages ── */
                        <div className="px-3 py-3 space-y-1">
                            {messages.map((msg) => {
                                const isUser = msg.role === 'user';
                                return (
                                    <div key={msg.id} className={cn('flex gap-2 mb-4', isUser && 'flex-row-reverse')}>
                                        <div className={cn(
                                            'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5',
                                            isUser
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm',
                                        )}>
                                            {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className={cn('max-w-[82%] space-y-0.5', isUser && 'items-end')}>
                                            <div className={cn(
                                                'px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap',
                                                isUser
                                                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
                                                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 rounded-tl-sm',
                                            )}>
                                                {isUser ? (
                                                    msg.content
                                                ) : (
                                                    <TypewriterReveal
                                                        text={msg.content}
                                                        speed={2}
                                                        intervalMs={15}
                                                        cursorClassName="bg-violet-500"
                                                    />
                                                )}
                                            </div>
                                            <div className={cn(
                                                'flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 px-1',
                                                isUser && 'justify-end',
                                            )}>
                                                <span>{format(msg.timestamp, 'HH:mm', { locale: vi })}</span>
                                                {msg.usage && (
                                                    <span className="opacity-50">· {(msg.usage.responseTimeMs / 1000).toFixed(1)}s</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Streaming indicator */}
                            {isLoading && (
                                <div className="flex gap-2 mb-4">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="max-w-[82%]">
                                        {statusText ? (
                                            <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 border border-slate-50 dark:border-slate-700/50">
                                                <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                                                    <span className="animate-pulse">{statusText}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 border border-slate-50 dark:border-slate-700/50">
                                                <div className="flex gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
                                                    <span className="w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
                                                    <span className="w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ═══ Input ═══ */}
                <div className="px-2 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
                    <PromptInputBox
                        onSend={(message) => handleSend(message)}
                        isLoading={isLoading}
                        onStop={stopStreaming}
                        placeholder="Hỏi gì đó..."
                    />
                </div>
            </div>
        </div>
    );
}
