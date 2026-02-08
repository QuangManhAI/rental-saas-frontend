'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <h2 className="text-2xl font-bold">Đã xảy ra lỗi!</h2>
      <p className="text-muted-foreground max-w-md text-center">
        {error.message || 'Một lỗi không xác định đã xảy ra. Vui lòng thử lại.'}
      </p>
      <Button onClick={reset}>Thử lại</Button>
    </div>
  );
}
