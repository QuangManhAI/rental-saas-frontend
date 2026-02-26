'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useTenantAuthStore } from '@/stores/tenant-auth.store';
import { tenantAuthService } from '@/services/tenant-portal.service';

export default function TenantActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useTenantAuthStore((s) => s.setAuth);

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!token) {
      setError('Liên kết kích hoạt không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const { accessToken, tenant } = await tenantAuthService.activate(token, password);
      setAuth(accessToken, tenant);
      setSuccess(true);
      setTimeout(() => router.replace('/tenant'), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Kích hoạt thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-indigo-700">Cổng Thuê Trọ</h1>
          </div>
          <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <p className="text-slate-700 font-semibold">Liên kết không hợp lệ</p>
            <p className="text-sm text-slate-500">
              Vui lòng kiểm tra lại email từ chủ trọ hoặc liên hệ để nhận liên kết mới.
            </p>
            <Link
              href="/tenant/login"
              className="inline-block mt-2 text-sm text-indigo-600 font-medium hover:underline"
            >
              Về trang đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-indigo-700">Cổng Thuê Trọ</h1>
          </div>
          <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-8 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <p className="text-slate-700 font-semibold">Kích hoạt thành công!</p>
            <p className="text-sm text-slate-500">Đang chuyển đến cổng thuê trọ...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-indigo-700">Cổng Thuê Trọ</h1>
          <p className="text-sm text-slate-500">Tạo mật khẩu để kích hoạt tài khoản</p>
        </div>

        <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-6 space-y-5">
          <div className="flex items-center gap-3 bg-indigo-50 rounded-lg p-3">
            <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
            <p className="text-xs text-slate-600">
              Tạo mật khẩu để đăng nhập vào cổng thuê trọ. Mật khẩu cần ít nhất 6 ký tự.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 text-white font-medium py-2.5 text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Kích hoạt tài khoản
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/tenant/login"
              className="text-sm text-indigo-600 hover:underline"
            >
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
