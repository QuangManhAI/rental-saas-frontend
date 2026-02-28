import {
    Sparkles,
    MessageCircle,
    Loader2,
    Trash2,
    Plus,
    Bot,
    User,
    PanelLeft,
    UserPlus,
    FileText,
    CreditCard,
    BarChart3,
    DoorOpen,
    AlertCircle,
    CalendarClock,
    type LucideIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import { TypewriterText } from '@/components/ui/typewriter-text';
import { PromptInputBox } from '@/components/ui/prompt-input-box';
import { TypewriterReveal } from '@/components/ui/typewriter-reveal';
import { AiAgentViewProps } from './ai-agent-desktop';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const SUGGESTIONS: { icon: LucideIcon; label: string }[] = [
    { icon: UserPlus, label: 'Thêm khách thuê' },
    { icon: FileText, label: 'Tạo hoá đơn' },
    { icon: BarChart3, label: 'Báo cáo doanh thu' },
    { icon: DoorOpen, label: 'Phòng trống?' },
];

const TYPEWRITER_GREETINGS = [
    'Hỏi tôi về phòng, khách thuê, hợp đồng...',
    'Tạo hoá đơn, ghi nhận thanh toán...',
    'Xem báo cáo doanh thu...',
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
    greeting,
    firstName,
}: AiAgentViewProps) {
    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;
        await sendMessage(text);
    };

    return (
        <div className={cn(darkMode && 'dark', 'md:hidden')}>
            {/* Mobile: full height up to padding. */}
            <div className="flex h-[calc(100dvh-64px-32px)] flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

                {/* ── Header ──────────────────────────────── */}
                <div className="flex items-center justify-between px-3 h-12 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button
                                    className="p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                                    title="Danh sách hội thoại"
                                >
                                    <PanelLeft className="w-5 h-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
                                <SheetHeader className="p-4 border-b border-slate-100 dark:border-slate-800 text-left">
                                    <SheetTitle className="text-base">Lịch sử trò chuyện</SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
                                    {conversations.map((conv) => (
                                        <div
                                            key={conv._id}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                                                conversationId === conv._id
                                                    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
                                            )}
                                            onClick={() => switchConversation(conv._id)}
                                        >
                                            <MessageCircle className="w-4 h-4 opacity-50 flex-shrink-0" />
                                            <span className="truncate flex-1">{conv.title}</span>
                                            <button
                                                className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteConversation(conv._id);
                                                }}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {conversations.length === 0 && (
                                        <p className="text-sm text-slate-400 text-center py-8">Chưa có hội thoại</p>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-[13px] font-bold text-slate-800 dark:text-slate-100">RenTaff</h1>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">Chào {greeting}, {firstName}!</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-violet-600 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-full"
                            onClick={startNewConversation}
                            title="Mới"
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* ── Messages ────────────────────────────── */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
                    {messages.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3 pb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <GooeyText
                                texts={["Hello!", "I'm RenTaff", 'AI Agent']}
                                morphTime={1.5}
                                cooldownTime={1.5}
                                className="h-10 w-full mt-3"
                                textClassName="text-xl font-bold whitespace-nowrap text-slate-800 dark:text-slate-100"
                            />
                            <TypewriterText
                                words={TYPEWRITER_GREETINGS}
                                className="text-xs text-slate-500 dark:text-slate-400 max-w-xs"
                                typingSpeed={60}
                                deletingSpeed={30}
                                pauseDuration={2000}
                                cursorClassName="bg-violet-500"
                            />
                            <div className="flex flex-wrap gap-2 justify-center max-w-[280px] mt-4">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s.label}
                                        className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm text-slate-600 dark:text-slate-300 transition-all active:scale-95"
                                        onClick={() => sendMessage(s.label)}
                                    >
                                        <s.icon className="w-3 h-3 text-violet-500" />
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Rendered messages ─── */}
                    {messages.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                            <div key={msg.id} className={cn('flex gap-2.5 mb-5', isUser && 'flex-row-reverse')}>
                                <div className={cn('flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5', isUser ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm')}>
                                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                </div>
                                <div className={cn('max-w-[85%] space-y-1', isUser && 'items-end')}>
                                    <div className={cn('px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap shadow-sm', isUser ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm')}>
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
                                    <div className={cn('flex flex-wrap items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 px-1', isUser && 'justify-end')}>
                                        <span>{format(msg.timestamp, 'HH:mm', { locale: vi })}</span>
                                        {msg.usage && <span className="opacity-60">· {(msg.usage.responseTimeMs / 1000).toFixed(1)}s</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* ── Streaming indicator ─── */}
                    {isLoading && (
                        <div className="flex gap-2.5 mb-5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="max-w-[85%] space-y-1">
                                {statusText ? (
                                    <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                                            <span className="animate-pulse">{statusText}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <div className="flex gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:0ms]" />
                                            <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:150ms]" />
                                            <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:300ms]" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Input — PromptInputBox ───────────────── */}
                <div className="px-2 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
                    <PromptInputBox
                        onSend={(message) => handleSend(message)}
                        isLoading={isLoading}
                        onStop={stopStreaming}
                        placeholder={`Hỏi gì đó...`}
                    />
                </div>
            </div>
        </div>
    );
}
