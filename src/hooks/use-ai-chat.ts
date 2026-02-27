'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

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
    }, []);

    // Send message
    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || isLoading) return;

            setIsLoading(true);

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

                // Send message and wait for response
                const response = await aiAgentService.sendMessage(convId, text.trim());

                // Add AI response
                const aiMsg: ChatMessage = {
                    id: `ai-${Date.now()}`,
                    role: 'assistant',
                    content: response.reply,
                    timestamp: new Date(),
                    usage: response.usage,
                };
                setMessages((prev) => [...prev, aiMsg]);

                // Refresh usage
                refetchUsage();
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
            } finally {
                setIsLoading(false);
            }
        },
        [conversationId, isLoading, refetchConversations, refetchUsage],
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
    };
}
