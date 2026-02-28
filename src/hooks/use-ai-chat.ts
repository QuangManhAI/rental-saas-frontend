'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    aiAgentService,
    AiConversation,
    AiMessage,
    AiSendResponse,
} from '@/services/ai-agent.service';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    usage?: AiSendResponse['usage'];
}

export function useAiChat() {
    const queryClient = useQueryClient();
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // ─── Streaming state ────────────────────────────────────────
    const [streamingText, setStreamingText] = useState('');
    const [statusText, setStatusText] = useState('');
    const abortRef = useRef<AbortController | null>(null);

    // ─── Typewriter buffer ───────────────────────────────────────
    // Tokens arrive in bursts from SSE. We buffer them and reveal
    // characters smoothly via requestAnimationFrame for a ChatGPT-like feel.
    const bufferRef = useRef('');           // queued text not yet displayed
    const displayedRef = useRef('');        // what's currently shown
    const rafRef = useRef<number | null>(null);
    const lastFrameRef = useRef(0);

    const CHARS_PER_FRAME = 1;  // characters to reveal per frame
    const MIN_FRAME_MS = 25;    // minimum ms between reveals (~40 chars/sec)

    const tickTypewriter = useCallback(() => {
        const now = performance.now();
        if (now - lastFrameRef.current < MIN_FRAME_MS) {
            rafRef.current = requestAnimationFrame(tickTypewriter);
            return;
        }
        lastFrameRef.current = now;

        if (bufferRef.current.length > 0) {
            // Reveal a few chars from the buffer
            const chunk = bufferRef.current.slice(0, CHARS_PER_FRAME);
            bufferRef.current = bufferRef.current.slice(CHARS_PER_FRAME);
            displayedRef.current += chunk;
            setStreamingText(displayedRef.current);
            rafRef.current = requestAnimationFrame(tickTypewriter);
        } else {
            // Buffer empty — stop the loop, it'll restart when new tokens arrive
            rafRef.current = null;
        }
    }, []);

    const enqueueTokens = useCallback((text: string) => {
        bufferRef.current += text;
        // Start the typewriter loop if not already running
        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(tickTypewriter);
        }
    }, [tickTypewriter]);

    // Flush remaining buffer instantly (used on done/stop)
    const flushBuffer = useCallback(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        if (bufferRef.current.length > 0) {
            displayedRef.current += bufferRef.current;
            bufferRef.current = '';
        }
    }, []);

    const resetTypewriter = useCallback(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        bufferRef.current = '';
        displayedRef.current = '';
        setStreamingText('');
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new messages or streaming text changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, streamingText, statusText]);

    // Get conversation list
    const { data: conversations = [], refetch: refetchConversations } = useQuery({
        queryKey: ['ai-conversations'],
        queryFn: aiAgentService.getConversations,
        staleTime: 30_000,
    });

    // Get usage
    const { data: usage, refetch: refetchUsage } = useQuery({
        queryKey: ['ai-usage'],
        queryFn: aiAgentService.getUsage,
        staleTime: 60_000,
    });

    // Load messages when conversation changes
    const loadMessages = useCallback(async (convId: string) => {
        try {
            const msgs = await aiAgentService.getMessages(convId);
            setMessages(
                msgs
                    .filter((m: AiMessage) => m.role === 'user' || m.role === 'assistant')
                    .map((m: AiMessage) => ({
                        id: m._id,
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                        timestamp: new Date(m.createdAt),
                    })),
            );
        } catch {
            setMessages([]);
        }
    }, []);

    // Switch conversation
    const switchConversation = useCallback(
        async (convId: string) => {
            setConversationId(convId);
            await loadMessages(convId);
        },
        [loadMessages],
    );

    // Start new conversation
    const startNewConversation = useCallback(async () => {
        setConversationId(null);
        setMessages([]);
        resetTypewriter();
        setStatusText('');
    }, [resetTypewriter]);

    // ─── Stop streaming ────────────────────────────────────────
    const stopStreaming = useCallback(() => {
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }

        // Flush remaining buffer so we capture all received text
        flushBuffer();
        const fullText = displayedRef.current;
        if (fullText.trim()) {
            const partialMsg: ChatMessage = {
                id: `ai-partial-${Date.now()}`,
                role: 'assistant',
                content: fullText + ' ⏹',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, partialMsg]);
        }
        resetTypewriter();

        setStatusText('');
        setIsLoading(false);
    }, [flushBuffer, resetTypewriter]);

    // ─── Send message (streaming) ──────────────────────────────
    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || isLoading) return;

            setIsLoading(true);
            resetTypewriter();
            setStatusText('');

            // Add user message immediately
            const userMsg: ChatMessage = {
                id: `user-${Date.now()}`,
                role: 'user',
                content: text.trim(),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMsg]);

            try {
                // Create conversation if needed
                let convId = conversationId;
                if (!convId) {
                    const conv = await aiAgentService.createConversation(text.trim());
                    convId = conv._id;
                    setConversationId(convId);
                    refetchConversations();
                }

                // Stream the response
                const controller = aiAgentService.sendMessageStream(
                    convId,
                    text.trim(),
                    {
                        onStatus: (statusMsg) => {
                            setStatusText(statusMsg);
                        },
                        onToken: (tokenText) => {
                            setStatusText(''); // Clear status when tokens start
                            enqueueTokens(tokenText);
                        },
                        onDone: (data) => {
                            // Flush any remaining buffered chars instantly
                            flushBuffer();
                            // Finalise: add the full message and clear streaming state
                            const aiMsg: ChatMessage = {
                                id: `ai-${Date.now()}`,
                                role: 'assistant',
                                content: data.reply,
                                timestamp: new Date(),
                                usage: data.usage,
                            };
                            setMessages((prev) => [...prev, aiMsg]);
                            resetTypewriter();
                            setStatusText('');
                            setIsLoading(false);
                            abortRef.current = null;
                            refetchUsage();
                        },
                        onError: (errMsg) => {
                            const errorAiMsg: ChatMessage = {
                                id: `error-${Date.now()}`,
                                role: 'assistant',
                                content: `❌ ${errMsg}`,
                                timestamp: new Date(),
                            };
                            setMessages((prev) => [...prev, errorAiMsg]);
                            resetTypewriter();
                            setStatusText('');
                            setIsLoading(false);
                            abortRef.current = null;
                        },
                        onComplete: () => {
                            // Fallback: if done wasn't received but stream ended
                            flushBuffer();
                            const fullText = displayedRef.current;
                            if (fullText.trim() && abortRef.current) {
                                const partialMsg: ChatMessage = {
                                    id: `ai-${Date.now()}`,
                                    role: 'assistant',
                                    content: fullText,
                                    timestamp: new Date(),
                                };
                                setMessages((prev) => [...prev, partialMsg]);
                            }
                            resetTypewriter();
                            setStatusText('');
                            setIsLoading(false);
                            abortRef.current = null;
                        },
                    },
                );

                abortRef.current = controller;
            } catch (error: unknown) {
                const errMsg =
                    error instanceof Error ? error.message : 'Có lỗi xảy ra';
                const errorAiMsg: ChatMessage = {
                    id: `error-${Date.now()}`,
                    role: 'assistant',
                    content: `❌ ${errMsg}`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorAiMsg]);
                setIsLoading(false);
            }
        },
        [conversationId, isLoading, refetchConversations, refetchUsage, enqueueTokens, flushBuffer, resetTypewriter],
    );

    // Delete conversation
    const deleteConversation = useCallback(
        async (convId: string) => {
            await aiAgentService.deleteConversation(convId);
            if (convId === conversationId) {
                setConversationId(null);
                setMessages([]);
            }
            refetchConversations();
        },
        [conversationId, refetchConversations],
    );

    return {
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
        // ─── New streaming state ────────────────────────────────
        streamingText,
        statusText,
        stopStreaming,
    };
}
