'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/lib/validators';
import { useLogin } from '@/hooks/use-auth';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export default function LoginPage() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data);
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

      {/* Right Panel — Login Form */}
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[70%] border border-slate-900/75 rounded-[2rem] pointer-events-none hidden md:block scale-95" />

        <div className="relative w-full max-w-[420px]">
          <div className="space-y-8">

            <div className="space-y-2 text-left">
              <h1 className="text-[36px] leading-tight font-bold text-slate-900 tracking-tight">
                Chào mừng trở lại
              </h1>
              <p className="text-slate-500 text-lg">
                Đăng nhập vào bảng điều khiển của bạn
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            autoComplete="current-password"
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

                <div className="flex justify-end">
                  <Link
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={login.isPending}
                  size="lg"
                  className="w-full h-12 text-base font-semibold rounded-xl shadow-indigo-500/20 shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                >
                  {login.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-slate-500">
              Chưa có tài khoản?{' '}
              <Link
                href={ROUTES.REGISTER}
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Đăng ký miễn phí
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
