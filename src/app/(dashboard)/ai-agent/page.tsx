'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Send,
  Square,
  Moon,
  Sun,
  UserPlus,
  FileText,
  CreditCard,
  BarChart3,
  MessageCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
  Trash2,
  Plus,
  Bot,
  User,
  Keyboard,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAiChat } from '@/hooks/use-ai-chat';
import { useAuthStore } from '@/stores/auth.store';

// ─── Greeting by time of day ─────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'sáng';
  if (h < 13) return 'trưa';
  if (h < 18) return 'chiều';
  return 'tối';
}

// ─── Quick Actions ───────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: UserPlus, label: 'Thêm khách mới', prompt: 'Tôi muốn thêm khách thuê mới' },
  { icon: FileText, label: 'Tạo hoá đơn', prompt: 'Tạo hoá đơn tháng này' },
  { icon: CreditCard, label: 'Ghi nhận thanh toán', prompt: 'Ghi nhận thanh toán cho khách' },
  { icon: BarChart3, label: 'Xem báo cáo', prompt: 'Báo cáo doanh thu tháng này' },
];

// ─── Suggested prompts ──────────────────────────────────
const SUGGESTIONS = [
  'Phòng nào đang trống?',
  'Ai chưa thanh toán tháng này?',
  'Tổng doanh thu tháng này bao nhiêu?',
  'Hợp đồng nào sắp hết hạn?',
];

export default function AiAgentPage() {
  const user = useAuthStore((s) => s.user);
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
    streamingText,
    statusText,
    stopStreaming,
  } = useAiChat();

  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Init dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-dark-mode');
    if (saved === 'true') {
      setDarkMode(true);
    }
  }, []);

  // Toggle dark class on the page wrapper
  useEffect(() => {
    localStorage.setItem('ai-dark-mode', String(darkMode));
  }, [darkMode]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Recent conversations (last 3)
  const recentConversations = useMemo(
    () => conversations.slice(0, 3),
    [conversations],
  );

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

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const greeting = getGreeting();
  const firstName = user?.fullName?.split(' ').pop() || 'bạn';

  return (
    <div className={cn(darkMode && 'dark')}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

          {/* ══════════════ HEADER ══════════════ */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Trợ lý AI
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Chào buổi {greeting}, <span className="font-medium text-slate-700 dark:text-slate-300">{firstName}</span>!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Usage badge */}
              {usage && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700">
                  <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
                    {usage.plan === 'free' ? 'FREE' : usage.plan.toUpperCase()}
                  </span>
                  <span className="text-xs text-violet-500 dark:text-violet-400">
                    {usage.requests.used}/{usage.requests.limit} lượt
                  </span>
                </div>
              )}

              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
                title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* ══════════════ QUICK ACTIONS ══════════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.prompt)}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md hover:shadow-violet-500/5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/50 group-hover:scale-110 transition-all duration-200">
                  <action.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          {/* ══════════════ CHAT AREA ══════════════ */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {conversationId ? 'Đang trò chuyện' : 'Cuộc trò chuyện mới'}
                </span>
                {isLoading && (
                  <span className="flex items-center gap-1 text-xs text-violet-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Đang xử lý...
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
                onClick={startNewConversation}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Mới
              </Button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="h-[400px] sm:h-[450px] overflow-y-auto px-4 py-4 space-y-1"
            >
              {/* Empty state */}
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      Xin chào, {firstName}!
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                      Tôi là trợ lý AI quản lý nhà trọ. Hỏi tôi về phòng, khách thuê, hợp đồng, hoá đơn hoặc doanh thu!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {SUGGESTIONS.map((q) => (
                      <button
                        key={q}
                        className="text-xs px-3 py-2 rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-300 dark:hover:border-violet-600 text-slate-600 dark:text-slate-300 transition-all duration-200"
                        onClick={() => sendMessage(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages list */}
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={cn('flex gap-3 mb-4', isUser && 'flex-row-reverse')}>
                    <div
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white',
                      )}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={cn('max-w-[80%] space-y-1', isUser && 'items-end')}>
                      <div
                        className={cn(
                          'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                          isUser
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-md',
                        )}
                      >
                        {msg.content}
                      </div>
                      <div
                        className={cn(
                          'flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 px-1',
                          isUser && 'justify-end',
                        )}
                      >
                        <span>{format(msg.timestamp, 'HH:mm', { locale: vi })}</span>
                        {msg.usage && (
                          <span className="opacity-60">
                            · {(msg.usage.responseTimeMs / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Streaming / loading indicators */}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="max-w-[80%] space-y-1">
                    {statusText && !streamingText && (
                      <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-slate-100 dark:bg-slate-700">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                          <span className="animate-pulse">{statusText}</span>
                        </div>
                      </div>
                    )}
                    {streamingText && (
                      <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-slate-100 dark:bg-slate-700 text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-100">
                        {streamingText}
                        <span className="inline-block w-[2px] h-[1em] bg-violet-500 ml-0.5 align-text-bottom animate-blink" />
                      </div>
                    )}
                    {!statusText && !streamingText && (
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

            {/* Usage bar */}
            {usage && (
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {usage.plan === 'free' ? 'Miễn phí' : usage.plan.toUpperCase()} · {usage.requests.used}/{usage.requests.limit} lượt
                  </span>
                  <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((usage.requests.used / usage.requests.limit) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════ CHAT INPUT ══════════════ */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50">
              <div className="flex items-end gap-2">
                <div className="relative flex-1">
                  <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hỏi gì đó..."
                    rows={1}
                    className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent max-h-24 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>
                {isLoading ? (
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-red-500 hover:bg-red-600 flex-shrink-0 transition-colors shadow-sm"
                    onClick={stopStreaming}
                    title="Dừng phản hồi"
                  >
                    <Square className="w-4 h-4 fill-white" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-violet-600 hover:bg-violet-700 flex-shrink-0 shadow-sm shadow-violet-500/20"
                    onClick={handleSend}
                    disabled={!input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ══════════════ RECENT CHAT HISTORY ══════════════ */}
          {recentConversations.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden">
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Lịch sử chat gần đây
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    ({recentConversations.length})
                  </span>
                </div>
                {historyOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {historyOpen && (
                <div className="border-t border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
                  {recentConversations.map((conv) => (
                    <div
                      key={conv._id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MessageCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-slate-700 dark:text-slate-200 truncate">
                            {conv.title}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {format(new Date(conv.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 text-slate-400 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conv._id);
                          }}
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                          onClick={() => switchConversation(conv._id)}
                        >
                          Tiếp tục
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
