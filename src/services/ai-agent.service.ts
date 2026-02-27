import api from '@/lib/axios';

// ─── Types ──────────────────────────────────────────
export interface AiConversation {
    _id: string;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface AiMessage {
    _id: string;
    conversationId: string;
    role: 'user' | 'assistant' | 'tool';
    content: string;
    createdAt: string;
}

export interface AiSendResponse {
    reply: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        responseTimeMs: number;
        quota: { used: number; limit: number };
    };
}

export interface AiUsage {
    plan: string;
    period: string;
    requests: { used: number; limit: number };
    tokens: { prompt: number; completion: number };
    estimatedCostUsd: number;
    toolCallCount: number;
}

interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

// ─── Service ────────────────────────────────────────
const BASE = '/agent';

export const aiAgentService = {
    createConversation: (title?: string) =>
        api
            .post<ApiResponse<AiConversation>>(`${BASE}/conversations`, {
                title: title || 'Cuộc hội thoại mới',
            })
            .then((r) => r.data.data),

    getConversations: () =>
        api
            .get<ApiResponse<AiConversation[]>>(`${BASE}/conversations`)
            .then((r) => r.data.data),

    deleteConversation: (id: string) =>
        api.delete(`${BASE}/conversations/${id}`).then((r) => r.data),

    sendMessage: (conversationId: string, message: string) =>
        api
            .post<ApiResponse<AiSendResponse>>(
                `${BASE}/conversations/${conversationId}/messages`,
                { message },
                { timeout: 60_000 },
            )
            .then((r) => r.data.data),

    getMessages: (conversationId: string) =>
        api
            .get<ApiResponse<AiMessage[]>>(
                `${BASE}/conversations/${conversationId}/messages`,
            )
            .then((r) => r.data.data),

    getUsage: () =>
        api.get<ApiResponse<AiUsage>>(`${BASE}/usage`).then((r) => r.data.data),
};
