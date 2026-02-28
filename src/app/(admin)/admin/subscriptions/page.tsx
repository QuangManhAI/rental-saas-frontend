'use client';

import { useEffect, useState, useCallback } from 'react';
import { CreditCard, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminService, AdminSubscription, PopulatedOwner } from '@/services/admin.service';

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  basic: 'bg-blue-100 text-blue-700',
  pro: 'bg-indigo-100 text-indigo-700',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  trial: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Đang dùng',
  trial: 'Dùng thử',
  expired: 'Hết hạn',
  cancelled: 'Đã hủy',
};

function ActivatePlanForm({ onSuccess }: { onSuccess: () => void }) {
  const [ownerId, setOwnerId] = useState('');
  const [plan, setPlan] = useState('basic');
  const [months, setMonths] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId.trim()) {
      setErrorMsg('Vui lòng nhập Owner ID.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await adminService.activatePlan({
        ownerId: ownerId.trim(),
        plan,
        months,
        notes: notes.trim() || undefined,
      });
      setSuccessMsg(`Kích hoạt gói ${plan.toUpperCase()} thành công cho ${ownerId}`);
      setOwnerId('');
      setNotes('');
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(msg ?? 'Kích hoạt thất bại. Kiểm tra lại Owner ID.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Kích hoạt gói dịch vụ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="ownerId">Owner ID (MongoDB ObjectId)</Label>
            <Input
              id="ownerId"
              placeholder="64a1b2c3d4e5f6789abc1234"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan">Gói dịch vụ</Label>
            <select
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="months">Số tháng</Label>
            <Input
              id="months"
              type="number"
              min={1}
              max={24}
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Input
              id="notes"
              placeholder="VD: Thanh toán chuyển khoản ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{errorMsg}</p>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {submitting ? 'Đang kích hoạt...' : 'Kích hoạt'}
        </Button>
      </form>
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<AdminSubscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubs = useCallback(() => {
    setLoading(true);
    setError('');
    adminService
      .listSubscriptions({ page, limit: 20 })
      .then((res) => {
        setSubs(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      })
      .catch(() => setError('Không thể tải danh sách gói dịch vụ.'))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gói dịch vụ</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng cộng {total} gói đăng ký</p>
      </div>

      {/* Activate Plan Form */}
      <ActivatePlanForm onSuccess={() => { setPage(1); fetchSubs(); }} />

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Danh sách gói đăng ký</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-100">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : subs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <CreditCard className="w-8 h-8 mb-2" />
            <p className="text-sm">Chưa có gói nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Chủ trọ</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Gói</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Trạng thái</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Giới hạn BĐS</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Giới hạn phòng</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Hết hạn</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subs.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {typeof sub.ownerId === 'object' ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{(sub.ownerId as PopulatedOwner).fullName}</p>
                          <p className="text-xs text-gray-400">{(sub.ownerId as PopulatedOwner).email}</p>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-gray-500">{sub.ownerId.slice(-8)}...</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${PLAN_COLORS[sub.plan] ?? 'bg-gray-100 text-gray-700'}`}
                      >
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[sub.status] ?? 'bg-gray-100 text-gray-700'}`}
                      >
                        {STATUS_LABELS[sub.status] ?? sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {sub.propertyLimit === -1 ? 'Không giới hạn' : sub.propertyLimit}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {sub.roomLimit === -1 ? 'Không giới hạn' : sub.roomLimit}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {sub.currentPeriodEnd
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString('vi-VN')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[160px] truncate">
                      {sub.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">
              Trang {page} / {totalPages} — {total} kết quả
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
