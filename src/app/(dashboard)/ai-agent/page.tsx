'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Square,
  Moon,
  Sun,
  MessageCircle,
  Loader2,
  Trash2,
  Plus,
  Bot,
  User,
  Keyboard,
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
import { useAiChat } from '@/hooks/use-ai-chat';
import { useAuthStore } from '@/stores/auth.store';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'sáng';
  if (h < 13) return 'trưa';
  if (h < 18) return 'chiều';
  return 'tối';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ai-dark-mode');
    if (saved === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-dark-mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Hide sidebar on mobile by default
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

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

  const greeting = getGreeting();
  const firstName = user?.fullName?.split(' ').pop() || 'bạn';

  return (
    <div className={cn(darkMode && 'dark')}>
      {/* Fill remaining viewport: topbar=64px, main padding=16px*2 on mobile, 24px*2 on lg, bottom-nav=80px on mobile */}
      <div className="h-[calc(100vh-64px-32px-80px)] lg:h-[calc(100vh-64px-48px)] flex rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors duration-300">

        {/* ══════════════ LEFT SIDEBAR — Conversations ══════════════ */}
        <div
          className={cn(
            'flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col transition-all duration-300 overflow-hidden',
            sidebarOpen ? 'w-56 md:w-64' : 'w-0',
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
                <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100">Trợ lý AI</h1>
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
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">Xin chào, {firstName}!</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                    Hỏi tôi về phòng, khách thuê, hợp đồng, hoá đơn hoặc doanh thu!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
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
                      {msg.content}
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

          {/* ── Input ───────────────────────────────── */}
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
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
      </div>
    </div>
  );
}
