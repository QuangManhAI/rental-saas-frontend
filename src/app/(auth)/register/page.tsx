'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema, type RegisterFormValues } from '@/lib/validators';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import { Loader2, Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react';
import { ROUTES } from '@/constants';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState<RegisterFormValues | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', fullName: '', phone: '' },
  });

  const handleRequestOtp = async (data: RegisterFormValues) => {
    setIsPending(true);
    try {
      const res = await authService.requestRegisterOtp(data);
      setEmail(res.email);
      setFormData(data);
      setStep('otp');
      toast.success('Mã OTP đã được gửi đến email của bạn');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Đăng ký thất bại. Email có thể đã tồn tại.';
      toast.error(msg);
    } finally {
      setIsPending(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setIsPending(true);
    try {
      const res = await authService.verifyRegisterOtp({ email, code });
      setTokens(res.tokens.accessToken, res.tokens.refreshToken);
      setUser(res.user);
      toast.success('Đăng ký thành công!');
      router.replace(ROUTES.ONBOARDING);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Mã OTP không đúng';
      toast.error(msg);
    } finally {
      setIsPending(false);
    }
  };

  const handleResendOtp = async () => {
    if (!formData) return;
    setIsPending(true);
    try {
      await authService.requestRegisterOtp(formData);
      toast.success('Đã gửi lại mã OTP');
    } catch (error: any) {
      toast.error('Không thể gửi lại mã OTP');
    } finally {
      setIsPending(false);
    }
  };

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

        {/* Back to home */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Trang chủ
        </Link>

        <div className="absolute -top-[100px] -right-[50px] w-[300px] h-[300px] bg-[#4F46E5] rounded-full blur-[80px] opacity-5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[85%] border border-slate-900/75 rounded-[2rem] pointer-events-none hidden md:block scale-95" />

        <div className="relative w-full max-w-[420px]">
          {step === 'form' ? (
            <div className="space-y-8">
              <div className="space-y-2 text-left">
                <h1 className="text-[36px] leading-tight font-bold text-slate-900 tracking-tight">
                  Tạo tài khoản
                </h1>
                <p className="text-slate-500 text-lg">
                  Miễn phí mãi mãi với gói cơ bản
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRequestOtp)} className="space-y-4">

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            autoComplete="name"
                            placeholder="Họ và tên"
                            className="h-12 text-base bg-white shadow-sm border-slate-200"
                          />
                        </FormControl>
                        <FormMessage className="ml-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            autoComplete="email"
                            placeholder="Email"
                            className="h-12 text-base bg-white shadow-sm border-slate-200"
                          />
                        </FormControl>
                        <FormMessage className="ml-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              placeholder="Mật khẩu"
                              className="h-12 text-base bg-white shadow-sm border-slate-200 pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="ml-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            autoComplete="tel"
                            placeholder="Số điện thoại (tuỳ chọn)"
                            className="h-12 text-base bg-white shadow-sm border-slate-200"
                          />
                        </FormControl>
                        <FormMessage className="ml-1" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    size="lg"
                    className="w-full h-12 text-base font-semibold rounded-xl shadow-indigo-500/20 shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Đăng ký miễn phí'
                    )}
                  </Button>
                </form>
              </Form>

              <p className="text-center text-sm text-slate-500">
                Đã có tài khoản?{' '}
                <Link
                  href={ROUTES.LOGIN}
                  className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          ) : (
            <OtpStep
              email={email}
              isPending={isPending}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              onBack={() => setStep('form')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── OTP Step Component ─────────────────────────────────────────────────────

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
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      // Handle paste
      const digits = value.slice(0, 6).split('');
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // Auto-submit if all filled
      if (newOtp.every((d) => d !== '')) {
        onVerify(newOtp.join(''));
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all filled
    if (newOtp.every((d) => d !== '')) {
      onVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setCanResend(false);
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    onResend();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-left">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
        <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
          <Mail className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-[28px] leading-tight font-bold text-slate-900 tracking-tight">
          Xác thực email
        </h1>
        <p className="text-slate-500">
          Nhập mã 6 số đã gửi đến{' '}
          <span className="font-medium text-slate-700">{email}</span>
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
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Xác nhận'
          )}
        </Button>

        <p className="text-sm text-slate-500">
          Chưa nhận được mã?{' '}
          {canResend ? (
            <button
              onClick={handleResend}
              className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              disabled={isPending}
            >
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
