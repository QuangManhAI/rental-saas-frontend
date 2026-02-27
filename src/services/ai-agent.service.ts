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

    /**
     * SSE streaming message — uses fetch() (not axios) for streaming support.
     * Returns AbortController so the caller can cancel/stop the stream.
     */
    sendMessageStream: (
        conversationId: string,
        message: string,
        callbacks: StreamCallbacks,
    ): AbortController => {
        const controller = new AbortController();

        // Get auth token from localStorage (same pattern as axios interceptor)
        let token = '';
        try {
            const stored = localStorage.getItem('auth-storage');
            if (stored) {
                const parsed = JSON.parse(stored);
                token = parsed?.state?.accessToken || '';
            }
        } catch { /* noop */ }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

        fetch(`${apiUrl}${BASE}/conversations/${conversationId}/messages/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ message }),
            signal: controller.signal,
        })
            .then(async (res) => {
                if (!res.ok) {
                    callbacks.onError?.(`Lỗi ${res.status}: ${res.statusText}`);
                    return;
                }

                const reader = res.body?.getReader();
                if (!reader) {
                    callbacks.onError?.('Không thể đọc stream.');
                    return;
                }

                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    // Parse SSE lines: "data: {...}\n\n"
                    const lines = buffer.split('\n\n');
                    buffer = lines.pop() || ''; // Keep incomplete chunk in buffer

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed || !trimmed.startsWith('data: ')) continue;

                        try {
                            const payload = JSON.parse(trimmed.slice(6));
                            const event = payload.event as string;
                            const data = payload.data;

                            if (event === 'status') {
                                callbacks.onStatus?.(data.text);
                            } else if (event === 'token') {
                                callbacks.onToken?.(data.text);
                            } else if (event === 'done') {
                                callbacks.onDone?.(data);
                            } else if (event === 'error') {
                                callbacks.onError?.(data.message);
                            }
                        } catch {
                            // Skip malformed SSE lines
                        }
                    }
                }

                // If stream ends without a done event, signal completion
                callbacks.onComplete?.();
            })
            .catch((err) => {
                if (err.name === 'AbortError') {
                    // User cancelled — this is expected
                    callbacks.onComplete?.();
                    return;
                }
                callbacks.onError?.(err.message || 'Lỗi kết nối.');
            });

        return controller;
    },
};

/** Callbacks for streaming events */
export interface StreamCallbacks {
    onStatus?: (text: string) => void;
    onToken?: (text: string) => void;
    onDone?: (data: { reply: string; usage: AiSendResponse['usage'] }) => void;
    onError?: (message: string) => void;
    onComplete?: () => void;
}
