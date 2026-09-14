'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Send, Copy, Check, Globe, Smartphone, HelpCircle } from 'lucide-react';

interface TelegramLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId?: string;
  botUsername?: string;
}

export function TelegramLinkDialog({
  open,
  onOpenChange,
  ownerId,
  botUsername = 'quangManhAI_bot',
}: TelegramLinkDialogProps) {
  const [copied, setCopied] = useState(false);

  const startCommand = ownerId ? `/start owner_${ownerId}` : `/start`;
  const appUrl = ownerId
    ? `https://t.me/${botUsername}?start=owner_${ownerId}`
    : `https://t.me/${botUsername}`;
  
  // Telegram Web URL with tgaddr parameter for browser-based linking without app scheme redirect
  const webUrl = ownerId
    ? `https://web.telegram.org/a/#?tgaddr=${encodeURIComponent(`tg://resolve?domain=${botUsername}&start=owner_${ownerId}`)}`
    : `https://web.telegram.org/k/#@${botUsername}`;

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(startCommand);
      setCopied(true);
      toast.success('Đã sao chép lệnh liên kết!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Không thể sao chép lệnh vào clipboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-2">
            <Send className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            Kết nối Bot Telegram
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-slate-500">
            Liên kết với bot <b className="text-slate-800">@{botUsername}</b> để nhận báo cáo doanh thu và thông báo tự động.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Option 1: Open App */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <Smartphone className="h-4 w-4 text-blue-600" />
              Cách 1: Mở trực tiếp ứng dụng Telegram
            </div>
            <p className="text-xs text-slate-500">
              Dành cho thiết bị đã cài ứng dụng Telegram.
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm" size="sm">
              <a href={appUrl} target="_blank" rel="noopener noreferrer">
                <Send className="mr-2 h-4 w-4" /> Mở trong ứng dụng Telegram
              </a>
            </Button>
          </div>

          {/* Option 2: Open Telegram Web */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <Globe className="h-4 w-4 text-blue-600" />
              Cách 2: Mở qua Telegram Web (Trình duyệt Safari / Chrome)
            </div>
            <p className="text-xs text-slate-500">
              Tránh lỗi &quot;Địa chỉ không hợp lệ&quot; trên Safari khi máy chưa cài app.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              <a href={webUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" /> Mở Telegram Web trên trình duyệt
              </a>
            </Button>
          </div>

          {/* Option 3: Manual Command */}
          <div className="rounded-xl border border-slate-200 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-slate-800">
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-slate-500" />
                Cách 3: Gửi tin nhắn thủ công
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Mở Telegram, tìm <b>@{botUsername}</b> và gửi đoạn mã bên dưới:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-mono text-slate-800 select-all break-all">
                {startCommand}
              </code>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleCopyCommand}
                className="shrink-0 h-8 px-2.5"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Sao chép</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
