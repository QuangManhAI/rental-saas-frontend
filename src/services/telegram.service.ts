import api from '@/lib/axios';

export interface TelegramStatus {
    connected: boolean;
    chatId: string | null;
}

export interface TelegramLinkUrl {
    url: string;
    ownerId: string;
}

export const telegramService = {
    /** Get current owner's Telegram connection status */
    getStatus: () => api.get<TelegramStatus>('/telegram/status').then((r) => r.data),

    /** Get Telegram link URL for owner to connect */
    getLinkUrl: () => api.get<TelegramLinkUrl>('/telegram/link-url').then((r) => r.data),
};
