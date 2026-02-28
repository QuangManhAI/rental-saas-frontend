'use client';

import { useState, useEffect } from 'react';
import { useAiChat } from '@/hooks/use-ai-chat';
import { useAuthStore } from '@/stores/auth.store';
import { AiAgentDesktop } from '@/components/ai-agent/views/ai-agent-desktop';
import { AiAgentMobile } from '@/components/ai-agent/views/ai-agent-mobile';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'sáng';
  if (h < 13) return 'trưa';
  if (h < 18) return 'chiều';
  return 'tối';
}

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

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ai-dark-mode');
    if (saved === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-dark-mode', String(darkMode));
  }, [darkMode]);

  // Hide sidebar on mobile by default
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const greeting = getGreeting();
  const firstName = user?.fullName?.split(' ').pop() || 'bạn';

  const sharedProps = {
    user,
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
    darkMode,
    setDarkMode,
    sidebarOpen,
    setSidebarOpen,
    greeting,
    firstName,
  };

  return (
    <>
      <AiAgentDesktop {...sharedProps} />
      <AiAgentMobile {...sharedProps} />
    </>
  );
}
