'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema, type RegisterFormValues } from '@/lib/validators';
import { useRegister } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants';

export default function RegisterPage() {
  const register = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', fullName: '', phone: '' },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Đăng ký tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => register.mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại (tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Input autoComplete="tel" placeholder="0901234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Đăng ký
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{' '}
          <Link href={ROUTES.LOGIN} className="text-primary underline">
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
