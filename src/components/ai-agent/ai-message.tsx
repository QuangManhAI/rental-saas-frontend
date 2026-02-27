'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiMessageProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        responseTimeMs: number;
        quota: { used: number; limit: number };
    };
}

export function AiMessage({ role, content, timestamp, usage }: AiMessageProps) {
    const isUser = role === 'user';

    return (
        <div className={cn('flex gap-3 mb-4', isUser && 'flex-row-reverse')}>
            {/* Avatar */}
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

            {/* Message bubble */}
            <div className={cn('max-w-[80%] space-y-1', isUser && 'items-end')}>
                <div
                    className={cn(
                        'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                        isUser
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md',
                    )}
                >
                    {content}
                </div>
                <div
                    className={cn(
                        'flex items-center gap-2 text-[11px] text-muted-foreground px-1',
                        isUser && 'justify-end',
                    )}
                >
                    <span>{format(timestamp, 'HH:mm', { locale: vi })}</span>
                    {usage && (
                        <span className="opacity-60">
                            · {(usage.responseTimeMs / 1000).toFixed(1)}s
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
