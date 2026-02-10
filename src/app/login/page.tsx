'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/lib/validators';
import { useLogin } from '@/hooks/use-auth';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

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
    <div className="min-h-screen w-full flex overflow-hidden bg-white">

      {/* Left Panel - Image (Hidden on mobile, 55% width on large screens) */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <img
          src="/hd.jpg"
          alt="Luxury Pool"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply" />
      </div>

      {/* Right Panel - Login Form (Full width mobile, 45% desktop) */}
      <div className="w-full lg:w-[45%] bg-[#FDF9FF] flex items-center justify-center p-8 relative">

        {/* --- Decorative Elements (Absolute positioned within right panel) --- */}

        {/* Blue Circle Top Right */}
        <div className="absolute -top-[100px] -right-[90px] w-[229px] h-[229px] bg-[#4F46E5] rounded-full blur-2xl opacity-20 lg:opacity-100 lg:blur-none shadow-lg z-0 scale-80" />

        {/* Center Outline Box (Subtle background decoration) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[70%] border border-slate-900/75 rounded-[2rem] pointer-events-none hidden md:block scale-80" />


        {/* --- Main Login Content --- */}
        <div className="max-w-[480px] w-full z-10 space-y-8 scale-75 origin-center">

          <div className="text-left space-y-2">
            <h1 className="text-[48px] leading-none font-normal text-black font-sans">
              Hello!
            </h1>
            <p className="text-[32px] leading-tight font-light text-black font-sans">
              sign in to RePOs
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <input
                          {...field}
                          placeholder="Email"
                          className="w-full h-[71px] rounded-[40px] bg-[#EEEEEE] shadow-[inset_0_4px_4px_rgba(0,0,0,0.05)] border-none px-8 text-[24px] text-black placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all font-light"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-6 text-red-500" />
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
                        <input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="w-full h-[71px] rounded-[40px] bg-[#EEEEEE] shadow-[inset_0_4px_4px_rgba(0,0,0,0.05)] border-none px-8 pr-16 text-[24px] text-black placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all font-light"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-black/30 hover:text-[#4F46E5] transition-colors"
                        >
                          {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="ml-6 text-red-500" />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={login.isPending}
                className="w-full h-[59px] rounded-[40px] bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[32px] font-normal flex items-center justify-center transition-all active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {login.isPending ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  'sign in'
                )}
              </button>

            </form>
          </Form>

          <div className="text-center pt-4">
            <a
              href="#"
              className="text-[18px] text-black underline decoration-1 underline-offset-4 hover:text-[#4F46E5] transition-colors"
            >
              Forgot information - Contact to Admin
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}