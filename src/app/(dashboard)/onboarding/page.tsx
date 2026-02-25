'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Building2, Home, Zap, MessageSquare, Check, Loader2,
  Plus, Trash2, ChevronRight, SkipForward,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AuthGuard } from '@/components/shared/auth-guard';
import { propertiesService } from '@/services/properties.service';
import { roomsService } from '@/services/rooms.service';
import { onboardingService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const propertySchema = z.object({
  name: z.string().min(2, 'Tên tòa nhà phải có ít nhất 2 ký tự'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  description: z.string().optional(),
});

type PropertyForm = z.infer<typeof propertySchema>;

interface RoomRow {
  id: string;
  name: string;
  price: string;
  area: string;
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

const STEPS = [
  { icon: Building2, label: 'Tòa nhà' },
  { icon: Home, label: 'Phòng' },
  { icon: Zap, label: 'Tiện ích' },
  { icon: MessageSquare, label: 'Telegram' },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className={`flex flex-col items-center gap-1.5 ${i <= current ? 'text-indigo-600' : 'text-gray-300'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
              i < current ? 'bg-indigo-600 border-indigo-600 text-white' :
              i === current ? 'border-indigo-600 text-indigo-600 bg-white' :
              'border-gray-200 text-gray-300 bg-white'
            }`}>
              {i < current ? <Check className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
            </div>
            <span className="text-xs font-medium hidden sm:block">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-12 sm:w-20 h-0.5 mx-1 ${i < current ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Property ─────────────────────────────────────────────────────────

function Step1Property({ onNext }: { onNext: (propertyId: string) => void }) {
  const form = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: { name: '', address: '', description: '' },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PropertyForm) => {
    setLoading(true);
    try {
      const property = await propertiesService.create(data);
      toast.success('Tòa nhà đã được tạo!');
      onNext(property._id);
    } catch {
      toast.error('Không thể tạo tòa nhà. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tạo tòa nhà đầu tiên</h2>
        <p className="text-gray-500 mt-1">Thêm thông tin cơ bản về bất động sản cho thuê của bạn.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên tòa nhà *</FormLabel>
                <FormControl>
                  <Input placeholder="VD: Nhà trọ Hoa Mai, Chung cư mini Quận 9..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ *</FormLabel>
                <FormControl>
                  <Input placeholder="VD: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả (tuỳ chọn)</FormLabel>
                <FormControl>
                  <Input placeholder="Mô tả thêm về tòa nhà..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 mt-6">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
            Tiếp theo
          </Button>
        </form>
      </Form>
    </div>
  );
}

// ─── Step 2: Rooms ────────────────────────────────────────────────────────────

function Step2Rooms({ propertyId, onNext, onSkip }: {
  propertyId: string;
  onNext: () => void;
  onSkip: () => void;
}) {
  const [rooms, setRooms] = useState<RoomRow[]>([
    { id: '1', name: '', price: '', area: '' },
    { id: '2', name: '', price: '', area: '' },
  ]);
  const [loading, setLoading] = useState(false);

  const addRoom = () => {
    setRooms((prev) => [...prev, { id: String(Date.now()), name: '', price: '', area: '' }]);
  };

  const removeRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRoom = (id: string, field: keyof RoomRow, value: string) => {
    setRooms((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = async () => {
    const validRooms = rooms.filter((r) => r.name && r.price);
    if (validRooms.length === 0) {
      toast.error('Hãy nhập ít nhất 1 phòng với tên và giá thuê.');
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        validRooms.map((r) =>
          roomsService.create({
            name: r.name,
            price: Number(r.price),
            area: r.area ? Number(r.area) : undefined,
            propertyId,
          })
        )
      );
      toast.success(`Đã tạo ${validRooms.length} phòng!`);
      onNext();
    } catch {
      toast.error('Không thể tạo phòng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Thêm phòng cho thuê</h2>
        <p className="text-gray-500 mt-1">Tạo nhanh các phòng cho tòa nhà vừa tạo.</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
          <div className="col-span-5">Tên phòng *</div>
          <div className="col-span-4">Giá thuê (đ) *</div>
          <div className="col-span-2">Diện tích (m²)</div>
          <div className="col-span-1"></div>
        </div>
        {rooms.map((room) => (
          <div key={room.id} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5">
              <Input
                placeholder="VD: Phòng 101"
                value={room.name}
                onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
              />
            </div>
            <div className="col-span-4">
              <Input
                type="number"
                placeholder="3500000"
                value={room.price}
                onChange={(e) => updateRoom(room.id, 'price', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                placeholder="20"
                value={room.area}
                onChange={(e) => updateRoom(room.id, 'area', e.target.value)}
              />
            </div>
            <div className="col-span-1">
              {rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRoom}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <Plus className="w-4 h-4" />
        Thêm phòng
      </button>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onSkip} className="flex-1">
          <SkipForward className="w-4 h-4 mr-2" />
          Bỏ qua
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
          Tạo phòng
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3: Utility Rates ────────────────────────────────────────────────────

function Step3Rates({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Đơn giá điện nước</h2>
        <p className="text-gray-500 mt-1">Hướng dẫn cài đặt đơn giá khi tạo hóa đơn.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-800 text-sm font-medium mb-2">Đơn giá điện nước tham khảo (2025)</p>
        <div className="space-y-2 text-sm text-amber-700">
          <div className="flex justify-between">
            <span>Điện bậc 1 (0–50 kWh)</span>
            <span className="font-medium">1.806đ/kWh</span>
          </div>
          <div className="flex justify-between">
            <span>Điện bậc 2 (51–100 kWh)</span>
            <span className="font-medium">1.866đ/kWh</span>
          </div>
          <div className="flex justify-between">
            <span>Điện phổ biến nhà trọ</span>
            <span className="font-medium">3.000–4.000đ/kWh</span>
          </div>
          <div className="flex justify-between border-t border-amber-200 pt-2">
            <span>Nước sinh hoạt</span>
            <span className="font-medium">10.000–15.000đ/m³</span>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
        <p className="text-indigo-700 text-sm">
          Khi tạo hóa đơn, bạn sẽ nhập chỉ số điện/nước đầu kỳ và cuối kỳ.
          Hệ thống tự động tính tiêu thụ và nhân với đơn giá bạn thiết lập cho từng hóa đơn.
          Bạn có thể thay đổi đơn giá bất kỳ lúc nào.
        </p>
      </div>

      <Button onClick={onNext} className="w-full bg-indigo-600 hover:bg-indigo-700">
        <ChevronRight className="w-4 h-4 mr-2" />
        Tiếp theo
      </Button>
    </div>
  );
}

// ─── Step 4: Telegram ─────────────────────────────────────────────────────────

function Step4Telegram({ onFinish }: { onFinish: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await onboardingService.complete();
      onFinish();
    } catch {
      toast.error('Lỗi khi hoàn thành thiết lập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Kết nối Telegram (tuỳ chọn)</h2>
        <p className="text-gray-500 mt-1">Nhận thông báo tức thì qua Telegram khi có thanh toán mới.</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-sm">1</div>
          <div>
            <p className="font-medium text-gray-900 text-sm">Tìm bot trên Telegram</p>
            <p className="text-gray-500 text-sm mt-0.5">Mở Telegram và tìm kiếm bot của bạn (cần thiết lập TELEGRAM_BOT_TOKEN trong .env)</p>
          </div>
        </div>
        <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-sm">2</div>
          <div>
            <p className="font-medium text-gray-900 text-sm">Lấy Chat ID</p>
            <p className="text-gray-500 text-sm mt-0.5">Gửi tin nhắn đến bot và lấy Chat ID từ phản hồi của bot</p>
          </div>
        </div>
        <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-sm">3</div>
          <div>
            <p className="font-medium text-gray-900 text-sm">Cài đặt trong Hồ sơ</p>
            <p className="text-gray-500 text-sm mt-0.5">Vào <strong>Hồ sơ → Telegram</strong> trong dashboard để nhập Chat ID</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleFinish} disabled={loading} className="flex-1">
          <SkipForward className="w-4 h-4 mr-2" />
          Bỏ qua
        </Button>
        <Button onClick={handleFinish} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
          Hoàn tất thiết lập
        </Button>
      </div>
    </div>
  );
}

// ─── Done ─────────────────────────────────────────────────────────────────────

function DoneScreen() {
  const router = useRouter();
  const { setUser, user } = useAuthStore();

  // Mark onboarding as complete in local store
  if (user && !user.isOnboardingComplete) {
    setUser({ ...user, isOnboardingComplete: true });
  }

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Thiết lập hoàn tất!</h2>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto">
        Tuyệt vời! Hệ thống của bạn đã sẵn sàng. Hãy bắt đầu quản lý nhà trọ thông minh.
      </p>
      <Button
        onClick={() => router.replace(ROUTES.DASHBOARD)}
        className="w-full max-w-xs mx-auto bg-indigo-600 hover:bg-indigo-700"
        size="lg"
      >
        Vào Dashboard
        <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
}

// ─── Main Onboarding Page ─────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [propertyId, setPropertyId] = useState<string>('');
  const [done, setDone] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-10 px-4 pb-10">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">RentalSaaS</span>
            </div>
            {!done && (
              <>
                <h1 className="text-2xl font-bold text-gray-900">Thiết lập hệ thống</h1>
                <p className="text-gray-500 mt-1">Chỉ cần vài bước để bắt đầu quản lý nhà trọ</p>
              </>
            )}
          </div>

          {!done && <StepIndicator current={step} />}

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
            {done && <DoneScreen />}
            {!done && step === 0 && (
              <Step1Property
                onNext={(pid) => {
                  setPropertyId(pid);
                  setStep(1);
                }}
              />
            )}
            {!done && step === 1 && (
              <Step2Rooms
                propertyId={propertyId}
                onNext={() => setStep(2)}
                onSkip={() => setStep(2)}
              />
            )}
            {!done && step === 2 && (
              <Step3Rates onNext={() => setStep(3)} />
            )}
            {!done && step === 3 && (
              <Step4Telegram onFinish={() => setDone(true)} />
            )}
          </div>

          {/* Skip all */}
          {!done && (
            <div className="text-center mt-4">
              <button
                onClick={async () => {
                  try {
                    await onboardingService.complete();
                    setDone(true);
                  } catch {
                    // ignore
                  }
                }}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Bỏ qua tất cả, thiết lập sau
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
