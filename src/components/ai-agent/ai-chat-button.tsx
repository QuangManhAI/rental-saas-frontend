'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { AiChatPanel } from './ai-chat-panel';

export function AiChatButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Floating bubble */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center group"
                    title="Mở trợ lý AI"
                >
                    <MessageCircle className="w-6 h-6 group-hover:scale-110 transition" />
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-20" />
                </button>
            )}

            {/* Chat panel */}
            <AiChatPanel open={open} onClose={() => setOpen(false)} />
        </>
    );
}
