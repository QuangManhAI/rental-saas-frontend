'use client';

import { useEffect, useState } from 'react';
import {
  Activity, Database, Cpu, Clock, RefreshCw, CheckCircle, XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminService, AdminHealth } from '@/services/admin.service';

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

function MetricCard({
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminHealthPage() {
  const [health, setHealth] = useState<AdminHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHealth = () => {
    setLoading(true);
    setError('');
    adminService
      .getHealth()
      .then(setHealth)
      .catch(() => setError('Không thể kết nối đến server.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-sm text-gray-500 mt-1">Tự động làm mới mỗi 30 giây</p>
        </div>
        <Button variant="outline" onClick={fetchHealth} disabled={loading} size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading && !health ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : health ? (
        <>
          {/* Status Banner */}
          <div
            className={`rounded-xl border p-4 flex items-center gap-3 ${
              health.status === 'healthy'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            {health.status === 'healthy' ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <div>
              <p
                className={`font-semibold ${
                  health.status === 'healthy' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {health.status === 'healthy' ? 'Hệ thống hoạt động bình thường' : 'Hệ thống có sự cố'}
              </p>
              <p className="text-xs text-gray-500">
                Cập nhật lúc: {new Date(health.timestamp).toLocaleTimeString('vi-VN')}
              </p>
            </div>
          </div>

          {/* DB Metrics */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Database
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Người dùng"
                value={health.database.users.toLocaleString()}
                icon={Database}
              />
              <MetricCard
                label="Hóa đơn"
                value={health.database.bills.toLocaleString()}
                icon={Database}
              />
              <MetricCard
                label="Thanh toán"
                value={health.database.payments.toLocaleString()}
                icon={Database}
              />
            </div>
          </div>

          {/* Memory Metrics */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Bộ nhớ (Node.js)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="RSS"
                value={formatBytes(health.memory.rss)}
                icon={Cpu}
                sub="Resident Set Size"
              />
              <MetricCard
                label="Heap Total"
                value={formatBytes(health.memory.heapTotal)}
                icon={Cpu}
                sub="Heap allocated"
              />
              <MetricCard
                label="Heap Used"
                value={formatBytes(health.memory.heapUsed)}
                icon={Cpu}
                sub="Heap in use"
              />
              <MetricCard
                label="External"
                value={formatBytes(health.memory.external)}
                icon={Cpu}
                sub="C++ objects"
              />
            </div>
          </div>

          {/* System Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Thông tin hệ thống
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                label="Thời gian hoạt động"
                value={formatUptime(health.uptime)}
                icon={Clock}
                sub="Kể từ lần khởi động gần nhất"
              />
              <MetricCard
                label="Node.js Version"
                value={health.nodeVersion}
                icon={Activity}
                sub="Runtime version"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
