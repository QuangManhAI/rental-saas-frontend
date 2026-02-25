'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Shield, UserCheck, UserX, ChevronLeft, ChevronRight, Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminService, AdminUser } from '@/services/admin.service';

const ROLE_LABELS: Record<string, string> = {
  owner: 'Chủ trọ',
  staff: 'Nhân viên',
  admin: 'Admin',
};

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-blue-100 text-blue-700',
  staff: 'bg-purple-100 text-purple-700',
  admin: 'bg-red-100 text-red-700',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Activate plan dialog state
  const [activatingUser, setActivatingUser] = useState<AdminUser | null>(null);
  const [activatePlan, setActivatePlan] = useState<'basic' | 'pro'>('basic');
  const [activateMonths, setActivateMonths] = useState(1);
  const [activateNotes, setActivateNotes] = useState('');
  const [activating, setActivating] = useState(false);
  const [activateError, setActivateError] = useState('');

  const limit = 20;

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError('');
    adminService
      .listUsers({ page, limit, search: search || undefined, role: roleFilter || undefined })
      .then((res) => {
        setUsers(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      })
      .catch(() => setError('Không thể tải danh sách người dùng.'))
      .finally(() => setLoading(false));
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleToggleActive = async (user: AdminUser) => {
    setTogglingId(user._id);
    try {
      const updated = await adminService.toggleUserActive(user._id);
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, isActive: updated.isActive } : u)));
    } catch {
      alert('Không thể thay đổi trạng thái người dùng.');
    } finally {
      setTogglingId(null);
    }
  };

  const openActivateDialog = (user: AdminUser) => {
    setActivatingUser(user);
    setActivatePlan('basic');
    setActivateMonths(1);
    setActivateNotes('');
    setActivateError('');
  };

  const handleActivatePlan = async () => {
    if (!activatingUser) return;
    setActivating(true);
    setActivateError('');
    try {
      await adminService.activatePlan({
        ownerId: activatingUser._id,
        plan: activatePlan,
        months: activateMonths,
        notes: activateNotes || undefined,
      });
      setActivatingUser(null);
    } catch {
      setActivateError('Không thể kích hoạt gói. Vui lòng thử lại.');
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng cộng {total} người dùng</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button variant="outline" onClick={handleSearch} size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Tất cả vai trò</option>
          <option value="owner">Chủ trọ</option>
          <option value="staff">Nhân viên</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-100">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Shield className="w-8 h-8 mb-2" />
            <p className="text-sm">Không tìm thấy người dùng nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Tên</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Vai trò</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Email xác thực</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Trạng thái</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Ngày tham gia</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.fullName || <span className="text-gray-400 italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-700'}`}
                      >
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.emailVerified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === 'owner' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openActivateDialog(user)}
                            className="text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Crown className="w-3 h-3 mr-1" /> Gói
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(user)}
                          disabled={togglingId === user._id}
                          className={`text-xs ${
                            user.isActive
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {togglingId === user._id ? (
                            <span className="animate-pulse">...</span>
                          ) : user.isActive ? (
                            <>
                              <UserX className="w-3 h-3 mr-1" /> Khóa
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" /> Mở khóa
                            </>
                          )}
                        </Button>
                      </div>
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

      {/* Activate Plan Dialog */}
      {activatingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setActivatingUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Kích hoạt gói dịch vụ</h2>
                  <p className="text-sm text-gray-500 truncate max-w-xs">
                    {activatingUser.fullName || activatingUser.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Plan selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Gói</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['basic', 'pro'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setActivatePlan(p)}
                        className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                          activatePlan === p
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div>{p === 'basic' ? 'Cơ bản' : 'Chuyên nghiệp'}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {p === 'basic' ? '199.000 ₫/tháng' : '499.000 ₫/tháng'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Months */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Thời hạn (tháng)
                  </label>
                  <select
                    value={activateMonths}
                    onChange={(e) => setActivateMonths(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {[1, 3, 6, 12].map((m) => (
                      <option key={m} value={m}>
                        {m} tháng
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ghi chú (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={activateNotes}
                    onChange={(e) => setActivateNotes(e.target.value)}
                    placeholder="Ví dụ: Thanh toán qua chuyển khoản..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {activateError && (
                  <p className="text-sm text-red-600">{activateError}</p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setActivatingUser(null)}
                  disabled={activating}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleActivatePlan}
                  disabled={activating}
                >
                  {activating ? (
                    <span className="animate-pulse">Đang kích hoạt...</span>
                  ) : (
                    'Kích hoạt gói'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
