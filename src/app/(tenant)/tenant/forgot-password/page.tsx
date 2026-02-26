'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { tenantAuthService } from '@/services/tenant-portal.service';

type Step = 'email' | 'otp' | 'success';

export default function TenantForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await tenantAuthService.requestForgotPasswordOtp(email);
      setStep('otp');
      setCountdown(60);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Không thể gửi mã OTP. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (countdown > 0) return;
    setError('');
    try {
      await tenantAuthService.requestForgotPasswordOtp(email);
      setCountdown(60);
      setOtpCode(['', '', '', '', '', '']);
    } catch {
      setError('Không thể gửi lại mã OTP.');
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtpCode(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const code = otpCode.join('');
    if (code.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await tenantAuthService.verifyForgotPasswordOtp(email, code, newPassword);
      setStep('success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-indigo-700">Cổng Thuê Trọ</h1>
          <p className="text-sm text-slate-500">
            {step === 'email' && 'Nhập email để đặt lại mật khẩu'}
            {step === 'otp' && 'Nhập mã OTP và mật khẩu mới'}
            {step === 'success' && 'Đặt lại mật khẩu thành công'}
          </p>
        </div>

        <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-6 space-y-5">
          {/* Step 1: Enter email */}
          {step === 'email' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
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
                Gửi mã OTP
              </button>
            </form>
          )}

          {/* Step 2: OTP + new password */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mã OTP (đã gửi đến {email})
                </label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otpCode.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-12 text-center text-lg font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ))}
                </div>
                <div className="text-center mt-2">
                  {countdown > 0 ? (
                    <p className="text-xs text-slate-400">Gửi lại sau {countdown}s</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Gửi lại mã OTP
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
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
                Đặt lại mật khẩu
              </button>

              <button
                type="button"
                onClick={() => { setStep('email'); setError(''); }}
                className="w-full text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Quay lại
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-slate-700 font-semibold">Đặt lại mật khẩu thành công!</p>
              <p className="text-sm text-slate-500">
                Bạn có thể đăng nhập bằng mật khẩu mới.
              </p>
              <Link
                href="/tenant/login"
                className="inline-block w-full rounded-lg bg-indigo-600 text-white font-medium py-2.5 text-sm hover:bg-indigo-700 transition-colors text-center"
              >
                Đăng nhập
              </Link>
            </div>
          )}

          {step !== 'success' && (
            <div className="text-center">
              <Link
                href="/tenant/login"
                className="text-sm text-indigo-600 hover:underline"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
