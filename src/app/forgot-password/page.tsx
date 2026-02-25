'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Mail, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants';
import { toast } from 'sonner';

type Step = 'email' | 'otp' | 'new-password' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-white selection:bg-indigo-100 selection:text-indigo-900">

      {/* Left Panel — Image */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-indigo-950">
        <img
          src="/hd.jpg"
          alt="Rental property"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 via-indigo-800/50 to-indigo-900/60 mix-blend-multiply" />

        <div className="absolute bottom-20 left-20 z-20 max-w-xl">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight drop-shadow-md">
            "Quản lý nhà trọ dễ dàng hơn bao giờ hết."
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-1 bg-white/30 rounded-full" />
            <p className="text-indigo-100 font-medium drop-shadow-sm">Rental SaaS Platform</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center p-8 relative">

        <Link
          href={ROUTES.LOGIN}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Đăng nhập
        </Link>

        <div className="absolute -top-[100px] -right-[50px] w-[300px] h-[300px] bg-[#4F46E5] rounded-full blur-[80px] opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[80%] border border-slate-900/75 rounded-[2rem] pointer-events-none hidden md:block scale-95" />

        <div className="relative w-full max-w-[420px]">
          {step === 'email' && (
            <EmailStep
              isPending={isPending}
              onSubmit={async (emailValue) => {
                setIsPending(true);
                try {
                  await authService.requestForgotPasswordOtp({ email: emailValue });
                  setEmail(emailValue);
                  setStep('otp');
                  toast.success('Mã OTP đã được gửi đến email');
                } catch (error: any) {
                  toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
                } finally {
                  setIsPending(false);
                }
              }}
            />
          )}

          {step === 'otp' && (
            <OtpStep
              email={email}
              isPending={isPending}
              onVerify={(code) => {
                setOtpCode(code);
                setStep('new-password');
              }}
              onResend={async () => {
                setIsPending(true);
                try {
                  await authService.requestForgotPasswordOtp({ email });
                  toast.success('Đã gửi lại mã OTP');
                } catch {
                  toast.error('Không thể gửi lại mã OTP');
                } finally {
                  setIsPending(false);
                }
              }}
              onBack={() => setStep('email')}
            />
          )}

          {step === 'new-password' && (
            <NewPasswordStep
              isPending={isPending}
              onSubmit={async (newPassword) => {
                setIsPending(true);
                try {
                  await authService.verifyForgotPasswordOtp({
                    email,
                    code: otpCode,
                    newPassword,
                  });
                  setStep('success');
                  toast.success('Đặt lại mật khẩu thành công');
                } catch (error: any) {
                  const msg = error?.response?.data?.message || 'Có lỗi xảy ra';
                  toast.error(msg);
                  // If OTP expired/invalid, go back to OTP step
                  if (msg.includes('OTP')) {
                    setStep('otp');
                  }
                } finally {
                  setIsPending(false);
                }
              }}
              onBack={() => setStep('otp')}
            />
          )}

          {step === 'success' && (
            <SuccessStep />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Email ──────────────────────────────────────────────────────────

function EmailStep({
  isPending,
  onSubmit,
}: {
  isPending: boolean;
  onSubmit: (email: string) => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    defaultValues: { email: '' },
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-left">
        <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
          <Mail className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-[28px] leading-tight font-bold text-slate-900 tracking-tight">
          Quên mật khẩu?
        </h1>
        <p className="text-slate-500">
          Nhập email để nhận mã OTP đặt lại mật khẩu
        </p>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data.email))} className="space-y-4">
        <div className="space-y-2">
          <Input
            {...register('email', {
              required: 'Email là bắt buộc',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' },
            })}
            type="email"
            autoComplete="email"
            placeholder="Email của bạn"
            className="h-12 text-base bg-white shadow-sm border-slate-200"
          />
          {errors.email && <p className="text-sm text-red-500 ml-1">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full h-12 text-base font-semibold rounded-xl shadow-indigo-500/20 shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gửi mã OTP'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Nhớ mật khẩu?{' '}
        <Link href={ROUTES.LOGIN} className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}

// ─── Step 2: OTP ────────────────────────────────────────────────────────────

function OtpStep({
  email,
  isPending,
  onVerify,
  onResend,
  onBack,
}: {
  email: string;
  isPending: boolean;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    if (value.length > 1) {
      const digits = value.slice(0, 6).split('');
      digits.forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d; });
      setOtp(newOtp);
      inputRefs.current[Math.min(index + digits.length, 5)]?.focus();
      if (newOtp.every((d) => d !== '')) onVerify(newOtp.join(''));
      return;
    }
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newOtp.every((d) => d !== '')) onVerify(newOtp.join(''));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-left">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
          <Mail className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-[28px] leading-tight font-bold text-slate-900 tracking-tight">Nhập mã OTP</h1>
        <p className="text-slate-500">
          Mã 6 số đã gửi đến <span className="font-medium text-slate-700">{email}</span>
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            disabled={isPending}
          />
        ))}
      </div>

      <div className="text-center space-y-4">
        <Button
          onClick={() => onVerify(otp.join(''))}
          disabled={isPending || otp.some((d) => !d)}
          size="lg"
          className="w-full h-12 text-base font-semibold rounded-xl"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Tiếp tục'}
        </Button>
        <p className="text-sm text-slate-500">
          Chưa nhận được mã?{' '}
          {canResend ? (
            <button onClick={() => { setCanResend(false); setCountdown(60); setOtp(['', '', '', '', '', '']); onResend(); }} className="font-medium text-indigo-600 hover:text-indigo-700" disabled={isPending}>
              Gửi lại
            </button>
          ) : (
            <span className="text-slate-400">Gửi lại sau {countdown}s</span>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Step 3: New Password ───────────────────────────────────────────────────

function NewPasswordStep({
  isPending,
  onSubmit,
  onBack,
}: {
  isPending: boolean;
  onSubmit: (newPassword: string) => void;
  onBack: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<{
    newPassword: string;
    confirmPassword: string;
  }>();

  const newPassword = watch('newPassword');

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-left">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
          <KeyRound className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-[28px] leading-tight font-bold text-slate-900 tracking-tight">Đặt mật khẩu mới</h1>
        <p className="text-slate-500">Nhập mật khẩu mới cho tài khoản của bạn</p>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data.newPassword))} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Input
              {...register('newPassword', {
                required: 'Mật khẩu là bắt buộc',
                minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
              })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu mới"
              className="h-12 text-base bg-white shadow-sm border-slate-200 pr-12"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-sm text-red-500 ml-1">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              {...register('confirmPassword', {
                required: 'Xác nhận mật khẩu là bắt buộc',
                validate: (value) => value === newPassword || 'Mật khẩu không khớp',
              })}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Xác nhận mật khẩu mới"
              className="h-12 text-base bg-white shadow-sm border-slate-200 pr-12"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full h-12 text-base font-semibold rounded-xl shadow-indigo-500/20 shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đặt lại mật khẩu'}
        </Button>
      </form>
    </div>
  );
}

// ─── Step 4: Success ────────────────────────────────────────────────────────

function SuccessStep() {
  return (
    <div className="space-y-8 text-center">
      <div className="flex items-center justify-center w-20 h-20 bg-green-50 rounded-2xl mx-auto">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <div className="space-y-2">
        <h1 className="text-[28px] leading-tight font-bold text-slate-900 tracking-tight">
          Đặt lại thành công!
        </h1>
        <p className="text-slate-500">
          Mật khẩu đã được thay đổi. Bạn có thể đăng nhập ngay.
        </p>
      </div>
      <Link href={ROUTES.LOGIN}>
        <Button size="lg" className="w-full h-12 text-base font-semibold rounded-xl shadow-indigo-500/20 shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
          Đăng nhập ngay
        </Button>
      </Link>
    </div>
  );
}
