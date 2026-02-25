'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTenantAuthStore } from '@/stores/tenant-auth.store';
import { tenantAuthService } from '@/services/tenant-portal.service';

export default function TenantLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useTenantAuthStore((s) => s.setAuth);
  const isAuthenticated = useTenantAuthStore((s) => s.isAuthenticated);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    // Already logged in → go to portal home
    if (isAuthenticated) {
      router.replace('/tenant');
      return;
    }

    const code = searchParams.get('code');
    if (!code) {
      setStatus('error');
      setError('Liên kết không hợp lệ. Vui lòng yêu cầu chủ trọ gửi lại liên kết đăng nhập.');
      return;
    }

    setStatus('loading');
    tenantAuthService
      .verify(code)
      .then(({ accessToken, tenant }) => {
        setAuth(accessToken, tenant);
        setStatus('success');
        setTimeout(() => router.replace('/tenant'), 1000);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          'Liên kết đã hết hạn hoặc đã được sử dụng. Vui lòng yêu cầu chủ trọ gửi liên kết mới.';
        setError(msg);
        setStatus('error');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Logo / Brand */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-indigo-700">Cổng Thuê Trọ</h1>
          <p className="text-sm text-slate-500">Xem hóa đơn và thanh toán dễ dàng</p>
        </div>

        {/* Status card */}
        <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-8 space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto" />
              <p className="text-slate-600 font-medium">Đang xác thực liên kết...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-slate-700 font-semibold">Đăng nhập thành công!</p>
              <p className="text-sm text-slate-500">Đang chuyển hướng...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
              <p className="text-slate-700 font-semibold">Không thể đăng nhập</p>
              <p className="text-sm text-slate-500 leading-relaxed">{error}</p>
              <p className="text-xs text-slate-400 pt-2">
                Liên hệ chủ trọ để nhận liên kết đăng nhập mới.
              </p>
            </>
          )}

          {status === 'idle' && (
            <p className="text-slate-500 text-sm">Đang khởi động...</p>
          )}
        </div>
      </div>
    </div>
  );
}
