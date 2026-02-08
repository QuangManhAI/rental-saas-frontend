import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <h2 className="text-2xl font-bold">404 — Không tìm thấy</h2>
      <p className="text-muted-foreground">
        Trang bạn tìm kiếm không tồn tại.
      </p>
      <Button asChild>
        <Link href="/">Về trang chủ</Link>
      </Button>
    </div>
  );
}
