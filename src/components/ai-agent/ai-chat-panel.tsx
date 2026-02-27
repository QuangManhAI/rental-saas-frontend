'use client';

import { useState, useRef, useEffect } from 'react';
import {
    X,
    Send,
    Plus,
    MessageCircle,
    Trash2,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAiChat } from '@/hooks/use-ai-chat';
import { AiMessage } from './ai-message';

export function AiChatPanel({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const {
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
    } = useAiChat();

    const [input, setInput] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus input when panel opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [open]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const text = input;
        setInput('');
        await sendMessage(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 lg:inset-auto lg:bottom-6 lg:right-6 lg:w-[420px] lg:h-[600px] flex flex-col bg-background lg:rounded-2xl lg:shadow-2xl lg:border border-border overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* ── Header ─────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="lg:hidden p-1 rounded hover:bg-white/20 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-semibold text-sm">Trợ lý AI</h3>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 h-8 w-8"
                        onClick={startNewConversation}
                        title="Cuộc hội thoại mới"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 h-8 w-8"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* ── Sidebar (conversation list) ─── */}
                {showSidebar && (
                    <div className="w-56 border-r bg-muted/30 flex flex-col overflow-y-auto">
                        <div className="p-2 space-y-1">
                            {conversations.map((conv) => (
                                <div
                                    key={conv._id}
                                    className={cn(
                                        'flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs cursor-pointer hover:bg-muted transition group',
                                        conversationId === conv._id && 'bg-muted font-medium',
                                    )}
                                    onClick={() => {
                                        switchConversation(conv._id);
                                        setShowSidebar(false);
                                    }}
                                >
                                    <MessageCircle className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
                                    <span className="truncate flex-1">{conv.title}</span>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteConversation(conv._id);
                                        }}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {conversations.length === 0 && (
                                <p className="text-xs text-muted-foreground px-2 py-4 text-center">
                                    Chưa có hội thoại
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Messages ──────────────────── */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
                    >
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                    <Sparkles className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Xin chào! 👋</p>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                                        Tôi là trợ lý AI quản lý nhà trọ. Hỏi tôi về phòng, khách
                                        thuê, hợp đồng, hoá đơn, hoặc doanh thu!
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                                    {[
                                        'Phòng nào đang trống?',
                                        'Tháng này doanh thu bao nhiêu?',
                                        'Ai chưa thanh toán?',
                                    ].map((q) => (
                                        <button
                                            key={q}
                                            className="text-[11px] px-3 py-1.5 rounded-full border border-border hover:bg-muted transition text-muted-foreground"
                                            onClick={() => sendMessage(q)}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <AiMessage
                                key={msg.id}
                                role={msg.role}
                                content={msg.content}
                                timestamp={msg.timestamp}
                                usage={msg.usage}
                            />
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-muted">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Quota bar ─────────────────── */}
                    {usage && (
                        <div className="px-4 py-1.5 border-t bg-muted/30">
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                <span>
                                    {usage.plan === 'free' ? 'Miễn phí' : usage.plan.toUpperCase()} ·{' '}
                                    {usage.requests.used}/{usage.requests.limit} lượt
                                </span>
                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-violet-500 rounded-full transition-all"
                                        style={{
                                            width: `${Math.min(
                                                (usage.requests.used / usage.requests.limit) * 100,
                                                100,
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Input ──────────────────── */}
                    <div className="px-3 py-3 border-t bg-background">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Hỏi gì đó..."
                                rows={1}
                                className="flex-1 resize-none rounded-xl border bg-muted/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 max-h-24"
                                disabled={isLoading}
                            />
                            <Button
                                size="icon"
                                className="h-10 w-10 rounded-xl bg-violet-600 hover:bg-violet-700 flex-shrink-0"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
