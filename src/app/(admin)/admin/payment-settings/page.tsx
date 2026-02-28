'use client';

import { useEffect, useState } from 'react';
import { Settings, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminService } from '@/services/admin.service';

type Mode = 'loading' | 'linked' | 'form';

function maskString(s: string) {
  if (s.length <= 8) return '****';
  return s.slice(0, 4) + '••••' + s.slice(-4);
}

export default function AdminPaymentSettingsPage() {
  const [mode, setMode] = useState<Mode>('loading');
  const [settings, setSettings] = useState<{
    configured: boolean;
    partnerCode: string | null;
    isActive: boolean;
    environment: string;
  } | null>(null);

  // Form state
  const [partnerCode, setPartnerCode] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSettings = async () => {
    try {
      const data = await adminService.getPaymentSettings();
      setSettings(data);
      setMode(data.configured ? 'linked' : 'form');
      if (data.partnerCode) setPartnerCode(data.partnerCode);
    } catch {
      setMode('form');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerCode.trim() || !accessKey.trim() || !secretKey.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin MoMo.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const result = await adminService.upsertPaymentSettings({
        provider: 'MOMO',
        momoPartnerCode: partnerCode.trim(),
        momoAccessKey: accessKey.trim(),
        momoSecretKey: secretKey.trim(),
        isActive: true,
      });
      setSettings(result);
      setSuccessMsg('Cấu hình MoMo đã được lưu thành công!');
      setAccessKey('');
      setSecretKey('');
      setMode('linked');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(msg ?? 'Lưu cấu hình thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async () => {
    setSubmitting(true);
    try {
      const result = await adminService.upsertPaymentSettings({
        isActive: !settings?.isActive,
      });
      setSettings(result);
      setSuccessMsg(result.isActive ? 'Đã bật thanh toán MoMo.' : 'Đã tắt thanh toán MoMo.');
    } catch {
      setErrorMsg('Không thể cập nhật trạng thái.');
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'loading') {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt thanh toán</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cấu hình MoMo để nhận thanh toán gói dịch vụ từ chủ trọ
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
            <Settings className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">MoMo Business</h2>
            <p className="text-xs text-gray-500">Nhận thanh toán qua ví MoMo</p>
          </div>
        </div>

        {mode === 'linked' && settings?.configured ? (
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-sm font-medium text-green-800">Đã liên kết với MoMo</p>
            </div>

            {/* Info */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Partner Code</p>
                <p className="text-sm font-mono text-gray-900">{settings.partnerCode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Môi trường</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  {settings.environment === 'production' ? 'Production' : 'Sandbox'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                <button
                  onClick={handleToggleActive}
                  disabled={submitting}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    settings.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${settings.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {settings.isActive ? 'Đang hoạt động' : 'Đã tắt'}
                </button>
              </div>
            </div>

            {successMsg && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {successMsg}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => { setMode('form'); setSuccessMsg(''); }}
            >
              Cập nhật thông tin MoMo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="partnerCode">Partner Code</Label>
              <Input
                id="partnerCode"
                placeholder="MOMOXXX"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="accessKey">Access Key</Label>
              <Input
                id="accessKey"
                placeholder="Nhập Access Key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secretKey">Secret Key</Label>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showSecret ? 'text' : 'password'}
                  placeholder="Nhập Secret Key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Thông tin này được mã hóa và lưu trữ an toàn. Dùng cho MoMo Sandbox để thử nghiệm.
              </p>
            </div>

            {errorMsg && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{errorMsg}</p>
            )}
            {successMsg && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {successMsg}
              </div>
            )}

            <div className="flex gap-3">
              {settings?.configured && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setMode('linked'); setErrorMsg(''); setSuccessMsg(''); }}
                >
                  Hủy
                </Button>
              )}
              <Button
                type="submit"
                disabled={submitting}
                className={`bg-pink-600 hover:bg-pink-700 text-white ${settings?.configured ? 'flex-1' : 'w-full'}`}
              >
                {submitting ? 'Đang lưu...' : settings?.configured ? 'Cập nhật' : 'Liên kết MoMo'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
