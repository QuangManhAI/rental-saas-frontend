import {
    Sparkles,
    Moon,
    Sun,
    MessageCircle,
    Loader2,
    Trash2,
    Plus,
    Bot,
    User,
    PanelLeftClose,
    PanelLeftOpen,
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

export interface AiAgentViewProps {
    user: any;
    messages: any[];
    conversations: any[];
    conversationId: string | null;
    isLoading: boolean;
    usage: any;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    sendMessage: (text: string) => Promise<void>;
    switchConversation: (id: string) => Promise<void>;
    startNewConversation: () => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    streamingText: string;
    statusText: string;
    stopStreaming: () => void;
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (val: boolean) => void;
    greeting: string;
    firstName: string;
}

const SUGGESTIONS: { icon: LucideIcon; label: string }[] = [
    { icon: UserPlus, label: 'Thêm khách thuê mới' },
    { icon: FileText, label: 'Tạo hoá đơn tháng này' },
    { icon: CreditCard, label: 'Ghi nhận thanh toán' },
    { icon: BarChart3, label: 'Báo cáo doanh thu tháng này' },
    { icon: DoorOpen, label: 'Phòng nào đang trống?' },
    { icon: AlertCircle, label: 'Ai chưa thanh toán tháng này?' },
    { icon: CalendarClock, label: 'Hợp đồng nào sắp hết hạn?' },
];

const TYPEWRITER_GREETINGS = [
    'Hỏi tôi về phòng, khách thuê, hợp đồng...',
    'Tạo hoá đơn, ghi nhận thanh toán...',
    'Xem báo cáo doanh thu, phân tích dữ liệu...',
    'Quản lý nhà trọ thông minh hơn!',
];

export function AiAgentDesktop({
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
    sidebarOpen,
    setSidebarOpen,
    greeting,
    firstName,
}: AiAgentViewProps) {
    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;
        await sendMessage(text);
    };

    return (
        <div className={cn(darkMode && 'dark')}>
            {/* Desktop: fill remaining viewport */}
            <div className="hidden md:flex h-[calc(100dvh-64px-48px)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-200">
                {/* ══════════════ LEFT SIDEBAR — Conversations ══════════════ */}
                <div
                    className={cn(
                        'flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col transition-all duration-300 overflow-hidden',
                        sidebarOpen ? 'w-64' : 'w-0',
                    )}
                >
                    <div className="flex items-center justify-between px-3 h-11 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                            Hội thoại
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:text-violet-600 dark:text-slate-400"
                            onClick={startNewConversation}
                            title="Cuộc trò chuyện mới"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
                        {conversations.map((conv) => (
                            <div
                                key={conv._id}
                                className={cn(
                                    'flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm cursor-pointer transition-all group',
                                    conversationId === conv._id
                                        ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50',
                                )}
                                onClick={() => switchConversation(conv._id)}
                            >
                                <MessageCircle className="w-3.5 h-3.5 flex-shrink-0 opacity-50" />
                                <span className="truncate flex-1 text-xs">{conv.title}</span>
                                <button
                                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-red-500 transition-all flex-shrink-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteConversation(conv._id);
                                    }}
                                    title="Xóa"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {conversations.length === 0 && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">
                                Chưa có hội thoại
                            </p>
                        )}
                    </div>
                </div>

                {/* ══════════════ MAIN CHAT AREA ══════════════ */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* ── Header ──────────────────────────────── */}
                    <div className="flex items-center justify-between px-3 h-11 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                                title={sidebarOpen ? 'Ẩn sidebar' : 'Hiện sidebar'}
                            >
                                {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                            </button>

                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="hidden sm:block leading-tight">
                                <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100">RenTaff</h1>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500">Chào buổi {greeting}, {firstName}!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {usage && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700">
                                    <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                                        {usage.plan === 'free' ? 'FREE' : usage.plan.toUpperCase()}
                                    </span>
                                    <span className="hidden sm:inline text-[11px] text-violet-500 dark:text-violet-400">
                                        {usage.requests.used}/{usage.requests.limit}
                                    </span>
                                    <div className="w-10 h-1 bg-violet-200 dark:bg-violet-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-violet-500 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((usage.requests.used / usage.requests.limit) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-500 hover:text-violet-600 dark:text-slate-400"
                                onClick={startNewConversation}
                                title="Mới"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                            >
                                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
                            </button>
                        </div>
                    </div>

                    {/* ── Messages ────────────────────────────── */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                        {messages.length === 0 && !isLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <GooeyText
                                    texts={["Hello!", "I'm RenTaff", 'Your AI Agent']}
                                    morphTime={1.5}
                                    cooldownTime={1.5}
                                    className="h-12 w-full mt-5"
                                    textClassName="text-2xl md:text-3xl font-bold whitespace-nowrap text-slate-800 dark:text-slate-100"
                                />
                                <TypewriterText
                                    words={TYPEWRITER_GREETINGS}
                                    className="text-sm text-slate-500 dark:text-slate-400 max-w-xs"
                                    typingSpeed={60}
                                    deletingSpeed={30}
                                    pauseDuration={2000}
                                    cursorClassName="bg-violet-500"
                                />
                                <div className="flex flex-wrap gap-2 justify-center max-w-lg mt-2">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s.label}
                                            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-300 dark:hover:border-violet-600 text-slate-600 dark:text-slate-300 transition-all duration-200"
                                            onClick={() => sendMessage(s.label)}
                                        >
                                            <s.icon className="w-3.5 h-3.5 text-violet-500" />
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg) => {
                            const isUser = msg.role === 'user';
                            return (
                                <div key={msg.id} className={cn('flex gap-3 mb-4', isUser && 'flex-row-reverse')}>
                                    <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', isUser ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white')}>
                                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={cn('max-w-[80%] space-y-1', isUser && 'items-end')}>
                                        <div className={cn('px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap', isUser ? 'bg-blue-600 text-white rounded-br-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-md')}>
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
                                        <div className={cn('flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 px-1', isUser && 'justify-end')}>
                                            <span>{format(msg.timestamp, 'HH:mm', { locale: vi })}</span>
                                            {msg.usage && <span className="opacity-60">· {(msg.usage.responseTimeMs / 1000).toFixed(1)}s</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="max-w-[80%] space-y-1">
                                    {statusText && (
                                        <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-slate-100 dark:bg-slate-700">
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                                                <span className="animate-pulse">{statusText}</span>
                                            </div>
                                        </div>
                                    )}

                                    {!statusText && (
                                        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-slate-100 dark:bg-slate-700">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-slate-400/40 rounded-full animate-bounce [animation-delay:0ms]" />
                                                <span className="w-2 h-2 bg-slate-400/40 rounded-full animate-bounce [animation-delay:150ms]" />
                                                <span className="w-2 h-2 bg-slate-400/40 rounded-full animate-bounce [animation-delay:300ms]" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
                        <PromptInputBox
                            onSend={(message) => handleSend(message)}
                            isLoading={isLoading}
                            onStop={stopStreaming}
                            placeholder={`Hỏi RenTaff bất kỳ điều gì...`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
