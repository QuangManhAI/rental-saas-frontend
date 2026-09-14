'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  User,
  Shield,
  Bell,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Send,
  ArrowLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSkeleton } from '@/components/shared';

import { useAuthStore } from '@/stores/auth.store';
import { useProfile } from '@/hooks/use-auth';
import { usersService } from '@/services/users.service';
import { authService } from '@/services/auth.service';
import { Role } from '@/types/enums';

// --- Types ---
type TabValue = 'general' | 'security' | 'notifications';

interface TabItem {
  value: TabValue;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { value: 'general', label: 'Thông tin chung', icon: User },
  { value: 'security', label: 'Bảo mật', icon: Shield },
  { value: 'notifications', label: 'Thông báo', icon: Bell },
];

// --- Main Layout Component ---

export default function SettingsPage() {
  const { data: user, isLoading, refetch } = useProfile();
  const [activeTab, setActiveTab] = useState<TabValue>('general');

  if (isLoading) return <LoadingSkeleton />;
  if (!user) return <div className="p-8 text-center">Không tìm thấy thông tin người dùng.</div>;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cài đặt tài khoản</h1>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và tuỳ chọn ứng dụng.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Menu */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <tab.icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* User Summary Card (Optional Sidebar element) */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <Badge variant={user.role === Role.OWNER ? 'default' : 'secondary'} className="w-full justify-center">
              {user.role === Role.OWNER ? 'Chủ nhà' : 'Nhân viên'}
            </Badge>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 w-full max-w-2xl">
          {activeTab === 'general' && <GeneralTab user={user} onUpdate={refetch} />}
          {activeTab === 'security' && <SecurityTab user={user} />}
          {activeTab === 'notifications' && <NotificationsTab user={user} />}
        </div>
      </div>
    </div>
  );
}

// --- Tab Components ---

function GeneralTab({ user, onUpdate }: { user: any; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user.fullName || '',
      phone: user.phone || '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await usersService.update(user._id, data);
      toast.success('Cập nhật thông tin thành công');
      onUpdate();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Thông tin chung</CardTitle>
        <CardDescription>Cập nhật thông tin hiển thị và liên hệ của bạn.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white h-6 w-6" />
            </div>
          </div>
          <div>
            <Button variant="outline" size="sm" className="mb-2">Thay đổi ảnh</Button>
            <p className="text-xs text-muted-foreground">JPG, GIF hoặc PNG. Tối đa 2MB.</p>
          </div>
        </div>

        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              {...register('fullName', { required: 'Họ tên là bắt buộc' })}
              className="max-w-md focus:ring-indigo-500"
            />
            {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message as string}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="max-w-md bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email không thể thay đổi vì là định danh tài khoản.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              {...register('phone')}
              className="max-w-md focus:ring-indigo-500"
              placeholder="+84..."
            />
          </div>

          <div className="grid gap-2">
            <Label>Chức vụ</Label>
            <div>
              <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 px-3 py-1">
                {user.role === Role.OWNER ? 'Quản lý (Owner)' : 'Nhân viên (Staff)'}
              </Badge>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>Hủy</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SecurityTab({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [passwordData, setPasswordData] = useState<{ currentPassword: string; newPassword: string } | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const onChangePassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (data.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await authService.requestChangePasswordOtp();
      setPasswordData({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      setOtpStep(true);
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      toast.success('Mã OTP đã được gửi đến email của bạn');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi gửi OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];

    if (value.length > 1) {
      const digits = value.slice(0, 6).split('');
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
      if (newOtp.every((d) => d !== '')) handleVerifyOtp(newOtp.join(''));
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (newOtp.every((d) => d !== '')) handleVerifyOtp(newOtp.join(''));
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (!passwordData) return;
    setLoading(true);
    try {
      await authService.verifyChangePasswordOtp({
        code,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Đổi mật khẩu thành công');
      setOtpStep(false);
      setPasswordData(null);
      setOtp(['', '', '', '', '', '']);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Mã OTP không đúng');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.requestChangePasswordOtp();
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      toast.success('Đã gửi lại mã OTP');
    } catch (error: any) {
      toast.error('Không thể gửi lại mã OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Bảo mật</CardTitle>
        <CardDescription>Quản lý mật khẩu và các phương thức bảo mật.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {!otpStep ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Đổi mật khẩu</h3>
            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-3 max-w-md">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input
                  type="password"
                  id="currentPassword"
                  {...register('currentPassword', { required: true })}
                  className="focus:ring-indigo-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  type="password"
                  id="newPassword"
                  {...register('newPassword', { required: true, minLength: 6 })}
                  className="focus:ring-indigo-500"
                />
                <p className="text-xs text-muted-foreground">Tối thiểu 6 ký tự.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  {...register('confirmPassword', { required: true })}
                  className="focus:ring-indigo-500"
                />
              </div>

              <Button type="submit" disabled={loading} className="mt-2">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật mật khẩu
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setOtpStep(false); setPasswordData(null); }}
                className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Xác thực OTP</h3>
            </div>

            <p className="text-sm text-slate-500">
              Nhập mã 6 số đã gửi đến email <span className="font-medium text-slate-700">{user.email}</span>
            </p>

            <div className="flex gap-3 justify-start">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-13 text-center text-lg font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  disabled={loading}
                />
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleVerifyOtp(otp.join(''))}
                disabled={loading || otp.some((d) => !d)}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận
              </Button>

              <span className="text-sm text-slate-500">
                {canResend ? (
                  <button
                    onClick={handleResendOtp}
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                    disabled={loading}
                  >
                    Gửi lại mã
                  </button>
                ) : (
                  <>Gửi lại sau {countdown}s</>
                )}
              </span>
            </div>
          </div>
        )}

        <Separator />

        {/* 2FA Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-medium text-slate-900">Xác thực qua Email (OTP)</h3>
            <p className="text-sm text-muted-foreground">Mã OTP được gửi qua email khi đổi mật khẩu.</p>
          </div>
          <Badge variant="default" className="bg-green-600">Đang bật</Badge>
        </div>

      </CardContent>
    </Card>
  );
}

function NotificationsTab({ user }: { user: any }) {
  // Construct Telegram link URL from user's ownerId (or user._id)
  const ownerId = user?.ownerId || user?._id;
  const telegramLinkUrl = ownerId
    ? `https://t.me/quangManhAI_bot?start=owner_${ownerId}`
    : '';

  const [notifSettings, setNotifSettings] = useState({
    dailyReport: true,
    paymentAlert: true,
    newContract: false,
  });

  // Mock checking if linked (based on user data if provided, or assuming not linked for demo if field missing)
  const isTelegramLinked = !!user.telegramChatId;

  const handleLinkTelegram = () => {
    if (telegramLinkUrl) {
      window.open(telegramLinkUrl, '_blank');
      toast.info('Mở Telegram để liên kết. Nhấn START trong bot!');
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Thông báo & Tích hợp</CardTitle>
        <CardDescription>Cấu hình cách bạn nhận thông báo từ hệ thống.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* Telegram Integration */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-white rounded-full shadow-sm shrink-0">
                <Send className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  Telegram
                  {isTelegramLinked ? (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700 h-5 px-1.5 text-[10px]">Đã liên kết</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-500 h-5 px-1.5 text-[10px]">Chưa liên kết</Badge>
                  )}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-sm">
                  Nhận báo cáo doanh thu hàng tháng và thông báo quan trọng trực tiếp qua Telegram.
                </p>

                {isTelegramLinked && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-indigo-700 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Chat ID: {user.telegramChatId}
                  </div>
                )}
              </div>
            </div>
            <div>
              {isTelegramLinked ? (
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                  <LogOut className="mr-2 h-3 w-3" /> Hủy liên kết
                </Button>
              ) : (
                <Button size="sm" onClick={handleLinkTelegram} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Kết nối ngay
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Cài đặt thông báo</h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-slate-900">Báo cáo tổng quan hàng ngày</p>
              <p className="text-xs text-muted-foreground">Nhận tóm tắt doanh thu và tình trạng phòng mỗi sáng.</p>
            </div>
            <Switch
              checked={notifSettings.dailyReport}
              onCheckedChange={(v) => setNotifSettings({ ...notifSettings, dailyReport: v })}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
          <Separator />

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-slate-900">Cảnh báo đóng tiền</p>
              <p className="text-xs text-muted-foreground">Thông báo khi có hóa đơn quá hạn thanh toán.</p>
            </div>
            <Switch
              checked={notifSettings.paymentAlert}
              onCheckedChange={(v) => setNotifSettings({ ...notifSettings, paymentAlert: v })}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
          <Separator />

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-slate-900">Thông báo hợp đồng mới</p>
              <p className="text-xs text-muted-foreground">Khi có nhân viên tạo hợp đồng mới.</p>
            </div>
            <Switch
              checked={notifSettings.newContract}
              onCheckedChange={(v) => setNotifSettings({ ...notifSettings, newContract: v })}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>

        </div>

      </CardContent>
    </Card>
  );
}
