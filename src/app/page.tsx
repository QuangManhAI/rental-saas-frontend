'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Building2, ChevronDown, ChevronRight, Check, Star,
  FileText, CreditCard, Bell, BarChart3, Shield, Zap,
  Users, Home, Receipt, MessageSquare, Menu, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    icon: FileText,
    title: 'Sổ sách giấy tờ lộn xộn',
    desc: 'Hết thời gian ghi chép tay, mất hóa đơn, nhầm số tiền điện nước từng phòng.',
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    icon: Bell,
    title: 'Quên nhắc đóng tiền phòng',
    desc: 'Khách thuê trả chậm, bạn phải gọi điện nhắc từng người. Vừa mất thời gian vừa ngại ngùng.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: BarChart3,
    title: 'Không biết doanh thu thực tế',
    desc: 'Tiền vào tiền ra không rõ ràng, không biết phòng nào sinh lời, phòng nào bị lỗ.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
];

const FEATURES = [
  {
    icon: Home,
    title: 'Quản lý bất động sản',
    desc: 'Thêm nhiều tòa nhà, nhiều phòng. Theo dõi trạng thái từng phòng theo thời gian thực.',
  },
  {
    icon: Users,
    title: 'Hồ sơ khách thuê',
    desc: 'Lưu thông tin đầy đủ, hợp đồng, giấy tờ. Khách thuê tự xem hóa đơn qua cổng riêng.',
  },
  {
    icon: Receipt,
    title: 'Hóa đơn tự động',
    desc: 'Nhập chỉ số điện nước, hệ thống tính tiền và tạo hóa đơn PDF ngay lập tức.',
  },
  {
    icon: CreditCard,
    title: 'Thanh toán đa kênh',
    desc: 'VNPay, chuyển khoản ngân hàng VietQR, tiền mặt — tất cả trong một giao diện.',
  },
  {
    icon: MessageSquare,
    title: 'Thông báo Telegram',
    desc: 'Nhắc nhở đóng tiền, xác nhận thanh toán gửi tự động qua Telegram bot.',
  },
  {
    icon: Shield,
    title: 'Bảo mật cao',
    desc: 'JWT hai lớp, mã hóa dữ liệu thanh toán, phân quyền nhân viên chi tiết.',
  },
];

const PRICING = [
  {
    name: 'Miễn phí',
    price: '0',
    period: 'mãi mãi',
    desc: 'Dùng thử không giới hạn thời gian',
    highlight: false,
    badge: null,
    features: [
      '1 tòa nhà',
      '10 phòng',
      'Hóa đơn & thanh toán cơ bản',
      'Cổng thông tin khách thuê',
      'Xuất PDF',
    ],
    cta: 'Bắt đầu miễn phí',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Cơ bản',
    price: '199.000',
    period: 'tháng',
    desc: 'Cho chủ nhà từ 2–5 tòa nhà',
    highlight: true,
    badge: 'Phổ biến nhất',
    features: [
      '5 tòa nhà',
      '50 phòng',
      'Thông báo Telegram',
      'Báo cáo doanh thu',
      'VNPay + VietQR',
      'Email tự động',
      '2 tài khoản nhân viên',
    ],
    cta: 'Dùng thử 14 ngày',
    ctaVariant: 'default' as const,
  },
  {
    name: 'Chuyên nghiệp',
    price: '499.000',
    period: 'tháng',
    desc: 'Cho nhà đầu tư quy mô lớn',
    highlight: false,
    badge: null,
    features: [
      'Không giới hạn tòa nhà',
      'Không giới hạn phòng',
      'Tất cả tính năng Cơ bản',
      'API tích hợp',
      'Nhân viên không giới hạn',
      'Hỗ trợ ưu tiên 24/7',
    ],
    cta: 'Liên hệ tư vấn',
    ctaVariant: 'outline' as const,
  },
];

const TESTIMONIALS = [
  {
    name: 'Nguyễn Văn Hùng',
    role: 'Chủ 3 dãy trọ tại Bình Dương',
    content: 'Trước đây tôi ghi sổ tay, cứ cuối tháng là loạn hết. Giờ chỉ cần mở điện thoại là biết ngay ai chưa đóng tiền.',
    rating: 5,
    avatar: 'H',
  },
  {
    name: 'Trần Thị Lan',
    role: 'Quản lý 45 phòng trọ tại TP.HCM',
    content: 'Tính năng VietQR quá tiện, khách thuê quét mã là chuyển tiền ngay. Không cần gọi nhắc nữa, thu tiền nhanh hơn hẳn.',
    rating: 5,
    avatar: 'L',
  },
  {
    name: 'Phạm Minh Tuấn',
    role: 'Nhà đầu tư BĐS tại Hà Nội',
    content: 'Báo cáo doanh thu rõ ràng giúp tôi biết được căn nào đang lỗ để điều chỉnh giá. ROI cải thiện rõ rệt.',
    rating: 5,
    avatar: 'T',
  },
];

const FAQS = [
  {
    q: 'Tôi có thể dùng thử trước khi trả phí không?',
    a: 'Có. Gói Miễn phí cho phép bạn dùng mãi mãi với 1 tòa nhà và 10 phòng. Gói trả phí có 14 ngày dùng thử không cần thẻ tín dụng.',
  },
  {
    q: 'Dữ liệu của tôi có được bảo mật không?',
    a: 'Dữ liệu được mã hóa và lưu trữ an toàn trên server. Thông tin thanh toán (API key VNPay) được mã hóa AES-256. Chúng tôi không bao giờ chia sẻ dữ liệu của bạn.',
  },
  {
    q: 'Phần mềm có hoạt động trên điện thoại không?',
    a: 'Có. Giao diện được thiết kế mobile-first, hoạt động tốt trên mọi thiết bị. Khách thuê cũng có cổng thông tin riêng tối ưu cho điện thoại.',
  },
  {
    q: 'Tôi có thể hủy gói bất kỳ lúc nào không?',
    a: 'Có thể hủy bất kỳ lúc nào, không ràng buộc hợp đồng. Sau khi hủy, tài khoản sẽ chuyển về gói Miễn phí và dữ liệu vẫn được giữ nguyên.',
  },
  {
    q: 'Phần mềm hỗ trợ bao nhiêu phương thức thanh toán?',
    a: 'Hỗ trợ: Tiền mặt, Chuyển khoản ngân hàng (VietQR tự động), VNPay, MoMo. Tất cả được ghi nhận và theo dõi tự động.',
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-gray-600 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">RentalSaaS</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Tính năng</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Bảng giá</a>
            <a href="#testimonials" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">Đánh giá</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Dùng thử miễn phí</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <a href="#features" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Tính năng</a>
            <a href="#pricing" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Bảng giá</a>
            <a href="#testimonials" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Đánh giá</a>
            <a href="#faq" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="pt-2 flex flex-col gap-2 border-t border-gray-100">
              <Link href="/login"><Button variant="outline" className="w-full">Đăng nhập</Button></Link>
              <Link href="/register"><Button className="w-full bg-indigo-600 hover:bg-indigo-700">Dùng thử miễn phí</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center min-h-[calc(100vh-4rem)] py-16 sm:py-20">

            {/* Left — Text */}
            <div className="flex flex-col justify-center">
              <Badge className="mb-6 w-fit bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50">
                <Zap className="w-3.5 h-3.5 mr-1" />
                Dành riêng cho chủ nhà trọ Việt Nam
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                Quản lý nhà trọ{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  thông minh
                </span>
                <br />— không còn sổ tay
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed">
                Tự động hóa hóa đơn, thu tiền, nhắc nhở và báo cáo doanh thu.
                Tiết kiệm hàng giờ mỗi tháng cho mỗi chủ nhà.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25">
                    Bắt đầu miễn phí
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Đăng nhập ngay
                  </Button>
                </Link>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Không cần thẻ tín dụng · Miễn phí mãi mãi với gói cơ bản
              </p>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm">
                {[
                  { label: 'Chủ nhà tin dùng', value: '1,200+' },
                  { label: 'Phòng quản lý', value: '18,000+' },
                  { label: 'Hóa đơn/tháng', value: '50,000+' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Photo */}
            <div className="mt-14 lg:mt-0 relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-violet-100 rounded-3xl -z-10 blur-xl opacity-70" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 ring-1 ring-black/5">
                <img
                  src="/hd.jpg"
                  alt="Luxury rental property"
                  className="w-full h-[520px] object-cover"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Quản lý toàn bộ bất động sản</p>
                      <p className="text-xs text-gray-500">Nhiều tòa nhà, nhiều phòng — một màn hình</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Bạn đang gặp những vấn đề này?
            </h2>
            <p className="mt-4 text-gray-600 text-lg">Chúng tôi hiểu nỗi đau của chủ nhà trọ</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-indigo-600 font-semibold text-lg">
              → RentalSaaS giải quyết tất cả những điều trên
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Mọi thứ bạn cần trong một nền tảng
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
              Từ quản lý phòng, hóa đơn đến thanh toán — tất cả được tích hợp liền mạch
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-100 p-6 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <f.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Showcase (alternating) ── */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20">

          {/* Row 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200">Hóa đơn tự động</Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Tạo hóa đơn trong 30 giây
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Chỉ cần nhập chỉ số điện cuối kỳ — hệ thống tự tính tiền điện, nước, các phí phụ trội
                và xuất hóa đơn PDF ngay lập tức. Gửi thông báo qua Telegram hoặc email tự động.
              </p>
              <ul className="space-y-3">
                {['Nhập số điện nước theo đợt', 'Tự tính theo đơn giá đã cài', 'Xuất PDF chuyên nghiệp', 'Gửi thông báo tự động'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="bg-indigo-600 text-white rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-200 text-sm">Hóa đơn tháng 2/2026</p>
                    <p className="text-xl font-bold mt-1">Phòng 101 — Toà A</p>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">Chưa thanh toán</Badge>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Tiền phòng', value: '3.500.000đ' },
                  { label: 'Tiền điện (120 kWh × 3.500đ)', value: '420.000đ' },
                  { label: 'Tiền nước (5m³ × 15.000đ)', value: '75.000đ' },
                  { label: 'Internet', value: '150.000đ' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-indigo-600 pt-2">
                  <span>Tổng cộng</span>
                  <span>4.145.000đ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="font-semibold text-gray-900 mb-4">Thanh toán ngay</p>
              <div className="bg-gray-50 rounded-xl p-4 text-center mb-4">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-0.5">
                    {[1,0,1,0,1,0,1,1,0,1,1,0,0,0,1,0,1,1,0,1,1,0,1,0,1].map((v, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${v ? 'bg-gray-800' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Quét mã VietQR để chuyển khoản</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                <div className="bg-indigo-50 rounded-lg p-2 text-indigo-700">VNPay</div>
                <div className="bg-purple-50 rounded-lg p-2 text-purple-700">MoMo</div>
                <div className="bg-green-50 rounded-lg p-2 text-green-700">VietQR</div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200">Thanh toán thông minh</Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Thu tiền nhanh hơn 3 lần
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Mỗi hóa đơn đi kèm mã QR ngân hàng riêng. Khách thuê chỉ cần quét là chuyển tiền.
                Hệ thống tự động đối soát và cập nhật trạng thái thanh toán.
              </p>
              <ul className="space-y-3">
                {['QR code VietQR tự động theo hóa đơn', 'Thanh toán VNPay trực tuyến', 'Xác nhận tức thì qua Telegram', 'Lịch sử thanh toán đầy đủ'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Bảng giá rõ ràng, không ẩn phí</h2>
            <p className="mt-4 text-gray-600 text-lg">Bắt đầu miễn phí, nâng cấp khi cần</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border ${
                  plan.highlight
                    ? 'border-indigo-500 shadow-xl shadow-indigo-100 bg-indigo-600 text-white relative'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-400 text-amber-900 border-amber-300 shadow-sm px-3 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <p className={`font-semibold ${plan.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>{plan.name}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}đ
                  </span>
                  <span className={`mb-1 ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>/{plan.period}</span>
                </div>
                <p className={`mt-2 text-sm ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{plan.desc}</p>

                <Link href="/register" className="block mt-6">
                  <Button
                    variant={plan.highlight ? 'secondary' : plan.ctaVariant}
                    className={`w-full ${plan.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : ''}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-indigo-400' : 'bg-indigo-50'}`}>
                        <Check className={`w-2.5 h-2.5 ${plan.highlight ? 'text-white' : 'text-indigo-600'}`} />
                      </div>
                      <span className={plan.highlight ? 'text-indigo-100' : 'text-gray-700'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Được tin dùng bởi hàng nghìn chủ nhà</h2>
            <p className="mt-4 text-gray-600 text-lg">Đánh giá thực từ người dùng thực</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <StarRating count={t.rating} />
                <p className="mt-4 text-gray-700 leading-relaxed text-sm italic">"{t.content}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Câu hỏi thường gặp</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 px-6">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 sm:py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Bắt đầu quản lý nhà trọ thông minh ngay hôm nay
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
            Miễn phí mãi mãi với gói cơ bản. Không cần thẻ tín dụng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold">
                Tạo tài khoản miễn phí
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold">
                Tôi đã có tài khoản
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">RentalSaaS</span>
              </div>
              <p className="text-sm leading-relaxed">
                Nền tảng quản lý nhà trọ thông minh dành cho chủ nhà Việt Nam.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Sản phẩm</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Tính năng</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Bảng giá</a></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Đăng ký</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Hỗ trợ</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="mailto:support@rental.local" className="hover:text-white transition-colors">Email hỗ trợ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram hỗ trợ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Pháp lý</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 RentalSaaS. Bảo lưu mọi quyền.</p>
            <p className="text-sm">Made with ❤️ for Vietnamese landlords</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
