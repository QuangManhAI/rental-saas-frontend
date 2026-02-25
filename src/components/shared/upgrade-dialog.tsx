'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Global upgrade dialog shown when any request returns HTTP 402. */

// Simple pub/sub so the axios interceptor can trigger this from outside React.
type Listener = (message: string) => void;
const listeners: Set<Listener> = new Set();

export function triggerUpgradeDialog(message = 'Vui lòng nâng cấp gói để tiếp tục.') {
  listeners.forEach((fn) => fn(message));
}

export function UpgradeDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handler: Listener = (msg) => {
      setMessage(msg);
      setOpen(true);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
            <Crown className="w-7 h-7 text-indigo-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">Nâng cấp gói dịch vụ</h2>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Để sau
            </Button>
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                setOpen(false);
                router.push('/subscription');
              }}
            >
              Xem gói
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
