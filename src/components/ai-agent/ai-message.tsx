'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TextMorph } from '@/components/ui/text-morph';

interface AiMessageProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        responseTimeMs: number;
        quota: { used: number; limit: number };
    };
}

export function AiMessage({ role, content, timestamp, isStreaming, usage }: AiMessageProps) {
    const isUser = role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn('flex gap-3 mb-4', isUser && 'flex-row-reverse')}
        >
            {/* Avatar */}
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                    isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-purple-200/50',
                )}
            >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </motion.div>

            {/* Message bubble */}
            <div className={cn('max-w-[80%] space-y-1', isUser && 'items-end')}>
                <div
                    className={cn(
                        'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                        isUser
                            ? 'bg-blue-600 text-white rounded-br-md shadow-sm shadow-blue-200/40'
                            : 'bg-muted text-foreground rounded-bl-md',
                    )}
                >
                    {!isUser && isStreaming ? (
                        <>
                            <TextMorph charDuration={20} staggerDelay={0.5}>
                                {content}
                            </TextMorph>
                            <span className="inline-block w-[2px] h-[1em] bg-violet-500 ml-0.5 align-text-bottom animate-blink" />
                        </>
                    ) : (
                        <>
                            {content}
                            {isStreaming && (
                                <span className="inline-block w-[2px] h-[1em] bg-violet-500 ml-0.5 align-text-bottom animate-blink" />
                            )}
                        </>
                    )}
                </div>
                <div
                    className={cn(
                        'flex items-center gap-2 text-[11px] text-muted-foreground px-1',
                        isUser && 'justify-end',
                    )}
                >
                    {!isStreaming && (
                        <span>{format(timestamp, 'HH:mm', { locale: vi })}</span>
                    )}
                    {usage && (
                        <span className="opacity-60">
                            · {(usage.responseTimeMs / 1000).toFixed(1)}s
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
