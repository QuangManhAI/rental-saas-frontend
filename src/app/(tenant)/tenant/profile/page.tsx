'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, User, Phone, Mail, MapPin, CreditCard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tenantAuthService } from '@/services/tenant-portal.service';
import { useTenantAuthStore } from '@/stores/tenant-auth.store';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-indigo-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function TenantProfilePage() {
  const router = useRouter();
  const logout = useTenantAuthStore((s) => s.logout);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['tenant-profile'],
    queryFn: tenantAuthService.getProfile,
  });

  function handleLogout() {
    logout();
    router.replace('/tenant/login');
  }

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-slate-800">Hồ sơ cá nhân</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          {/* Avatar card */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-center text-white shadow-lg">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <User className="h-8 w-8 text-white" />
            </div>
            <p className="text-lg font-bold">{profile?.fullName ?? '—'}</p>
            {profile?.phone && <p className="text-indigo-200 text-sm mt-0.5">{profile.phone}</p>}
          </div>

          {/* Info card */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Thông tin cá nhân</p>
            <InfoRow icon={Phone} label="Số điện thoại" value={profile?.phone} />
            <InfoRow icon={Mail} label="Email" value={profile?.email} />
            <InfoRow icon={MapPin} label="Địa chỉ" value={profile?.address} />
            <InfoRow icon={CreditCard} label="CCCD/CMND" value={profile?.identityCard} />
            {profile?.dob && (
              <InfoRow
                icon={User}
                label="Ngày sinh"
                value={format(new Date(profile.dob), 'dd/MM/yyyy', { locale: vi })}
              />
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-red-200 bg-red-50 text-red-600 font-medium text-sm py-3 active:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </>
      )}
    </div>
  );
}
