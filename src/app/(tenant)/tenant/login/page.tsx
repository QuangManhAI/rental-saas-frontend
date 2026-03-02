'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useTenantAuthStore } from '@/stores/tenant-auth.store';
import { tenantAuthService } from '@/services/tenant-portal.service';

export default function TenantLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useTenantAuthStore((s) => s.setAuth);
  const isAuthenticated = useTenantAuthStore((s) => s.isAuthenticated);

  // Magic-link verification state (backward compat)
  const [magicStatus, setMagicStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [magicError, setMagicError] = useState('');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const code = searchParams.get('code');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/tenant');
      return;
    }

    // If magic-link code is present, auto-verify it
    if (code) {
      setMagicStatus('loading');
      tenantAuthService
        .verify(code)
        .then(({ accessToken, tenant }) => {
          setAuth(accessToken, tenant);
          setMagicStatus('success');
          setTimeout(() => router.replace('/tenant'), 1000);
        })
        .catch((err) => {
          const msg =
            err?.response?.data?.message ||
            'Liên kết đã hết hạn hoặc đã được sử dụng.';
          setMagicError(msg);
          setMagicStatus('error');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const { accessToken, tenant, mustChangePassword } = await tenantAuthService.login(email, password);
      setAuth(accessToken, tenant, mustChangePassword);
      if (mustChangePassword) {
        router.replace('/tenant/change-password');
      } else {
        router.replace('/tenant');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  }

  // If magic-link code is present, show verification UI
  if (code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-indigo-700">Cổng Thuê Trọ</h1>
            <p className="text-sm text-slate-500">Xem hóa đơn và thanh toán dễ dàng</p>
          </div>

          <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-8 space-y-4">
            {magicStatus === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto" />
                <p className="text-slate-600 font-medium">Đang xác thực liên kết...</p>
              </>
            )}
            {magicStatus === 'success' && (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-slate-700 font-semibold">Đăng nhập thành công!</p>
                <p className="text-sm text-slate-500">Đang chuyển hướng...</p>
              </>
            )}
            {magicStatus === 'error' && (
              <>
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
                <p className="text-slate-700 font-semibold">Không thể đăng nhập</p>
                <p className="text-sm text-slate-500 leading-relaxed">{magicError}</p>
                <Link
                  href="/tenant/login"
                  className="inline-block mt-2 text-sm text-indigo-600 font-medium hover:underline"
                >
                  Đăng nhập bằng mật khẩu
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: email + password login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-indigo-700">Cổng Thuê Trọ</h1>
          <p className="text-sm text-slate-500">Đăng nhập để xem hóa đơn và thanh toán</p>
        </div>

        <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-6 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-lg bg-indigo-600 text-white font-medium py-2.5 text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Đăng nhập
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/tenant/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
