'use client';

import { useEffect, useState } from 'react';
import { Users, Building2, DoorOpen, FileText, TrendingUp, Crown } from 'lucide-react';
import { adminService, AdminStats } from '@/services/admin.service';

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-indigo-600" />
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gray-900">
        {typeof value === 'number' && label.toLowerCase().includes('doanh')
          ? value.toLocaleString('vi-VN') + ' ₫'
          : value.toLocaleString('vi-VN')}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  basic: 'bg-blue-100 text-blue-700',
  pro: 'bg-indigo-100 text-indigo-700',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getStats()
      .then(setStats)
      .catch(() => setError('Không thể tải dữ liệu thống kê.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">{error}</div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan hệ thống RentalSaaS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Tổng người dùng"
          value={stats.users.total}
          icon={Users}
          sub={`${stats.users.owners} chủ trọ · ${stats.users.staff} nhân viên`}
        />
        <StatCard label="Tổng bất động sản" value={stats.properties} icon={Building2} />
        <StatCard label="Tổng phòng" value={stats.rooms} icon={DoorOpen} />
        <StatCard label="Tổng hóa đơn" value={stats.bills} icon={FileText} />
        <StatCard
          label="Tổng doanh thu"
          value={stats.totalRevenue}
          icon={TrendingUp}
          sub="Tổng thanh toán ghi nhận"
        />
        <StatCard label="Chủ trọ" value={stats.users.owners} icon={Crown} sub="Tài khoản owner" />
      </div>

      {/* Plan Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Phân bổ gói dịch vụ</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.planBreakdown).length === 0 ? (
            <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
          ) : (
            Object.entries(stats.planBreakdown).map(([plan, count]) => (
              <div
                key={plan}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${PLAN_COLORS[plan] ?? 'bg-gray-100 text-gray-700'}`}
              >
                {plan.toUpperCase()}: {count}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Chủ trọ mới đăng ký</h2>
        {stats.recentUsers.length === 0 ? (
          <p className="text-sm text-gray-400">Chưa có người dùng nào.</p>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="md:hidden space-y-3">
              {stats.recentUsers.map((u) => (
                <div key={u._id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 text-sm truncate pr-2">{u.fullName || '—'}</p>
                    <span
                      className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {u.isActive ? 'Hoạt động' : 'Khóa'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 text-gray-500 font-medium">Tên</th>
                    <th className="text-left py-2 pr-4 text-gray-500 font-medium">Email</th>
                    <th className="text-left py-2 pr-4 text-gray-500 font-medium">Trạng thái</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Ngày đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">{u.fullName || '—'}</td>
                      <td className="py-3 pr-4 text-gray-600">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {u.isActive ? 'Hoạt động' : 'Khóa'}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
