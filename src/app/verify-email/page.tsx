'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants';

type Status = 'loading' | 'success' | 'error' | 'no-token';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>(token ? 'loading' : 'no-token');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) return;

    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        const msg = err?.response?.data?.message ?? 'Token không hợp lệ hoặc đã hết hạn.';
        setErrorMsg(msg);
        setStatus('error');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">

        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900">Đang xác thực email…</h1>
            <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Email đã xác thực!</h1>
            <p className="text-gray-600 mt-3 mb-6">
              Tài khoản của bạn đã được xác thực thành công. Hãy tiếp tục thiết lập hệ thống quản lý của bạn.
            </p>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push(ROUTES.DASHBOARD)}>
              Vào Dashboard
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Xác thực thất bại</h1>
            <p className="text-gray-600 mt-3 mb-6">{errorMsg}</p>
            <div className="space-y-3">
              <Link href={ROUTES.DASHBOARD}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Quay về Dashboard</Button>
              </Link>
            </div>
          </>
        )}

        {status === 'no-token' && (
          <>
            <Mail className="w-14 h-14 text-indigo-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Kiểm tra email của bạn</h1>
            <p className="text-gray-600 mt-3 mb-6">
              Chúng tôi đã gửi email xác thực đến địa chỉ bạn đăng ký.
              Hãy kiểm tra hộp thư (kể cả thư mục Spam) và nhấn vào liên kết xác thực.
            </p>
            <Link href={ROUTES.DASHBOARD}>
              <Button variant="outline" className="w-full">Bỏ qua, tiếp tục sau</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
