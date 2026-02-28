'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Building2, ChevronDown, Check, Star,
  FileText, CreditCard, Bell, BarChart3, Shield, Zap,
  Users, Home, Receipt, MessageSquare, Menu, X,
  ArrowRight, Sparkles, Globe, Clock,
  Smartphone, Lock, LineChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── Data (same as desktop) ──────────────────────────────────────────────────

const PAIN_POINTS = [
  { icon: FileText, title: 'Sổ sách giấy tờ lộn xộn', desc: 'Hết thời gian ghi chép tay, mất hóa đơn, nhầm số tiền điện nước từng phòng.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: Bell, title: 'Quên nhắc đóng tiền phòng', desc: 'Khách thuê trả chậm, bạn phải gọi điện nhắc từng người.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: BarChart3, title: 'Không biết doanh thu thực tế', desc: 'Tiền vào tiền ra không rõ ràng, không biết phòng nào sinh lời.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
];

const FEATURES = [
  { icon: Home, title: 'Quản lý bất động sản', desc: 'Thêm nhiều tòa nhà, nhiều phòng. Theo dõi trạng thái từng phòng theo thời gian thực.', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Users, title: 'Hồ sơ khách thuê', desc: 'Lưu thông tin đầy đủ, hợp đồng, giấy tờ. Khách thuê tự xem hóa đơn qua cổng riêng.', gradient: 'from-violet-500 to-purple-500' },
  { icon: Receipt, title: 'Hóa đơn tự động', desc: 'Nhập chỉ số điện nước, hệ thống tính tiền và tạo hóa đơn PDF ngay lập tức.', gradient: 'from-emerald-500 to-green-500' },
  { icon: CreditCard, title: 'Thanh toán đa kênh', desc: 'VNPay, chuyển khoản ngân hàng VietQR, MoMo, tiền mặt — tất cả trong một.', gradient: 'from-orange-500 to-amber-500' },
  { icon: MessageSquare, title: 'Thông báo Telegram', desc: 'Nhắc nhở đóng tiền, xác nhận thanh toán gửi tự động qua Telegram bot.', gradient: 'from-pink-500 to-rose-500' },
  { icon: Shield, title: 'Bảo mật cao', desc: 'JWT hai lớp, mã hóa dữ liệu thanh toán, phân quyền nhân viên chi tiết.', gradient: 'from-indigo-500 to-blue-500' },
];

const PRICING = [
  {
    name: 'Miễn phí', price: '0', period: 'mãi mãi', desc: 'Dùng thử không giới hạn thời gian',
    highlight: false, badge: null,
    features: ['1 tòa nhà', '10 phòng', 'Hóa đơn & thanh toán cơ bản', 'Cổng thông tin khách thuê', 'Xuất PDF'],
    cta: 'Bắt đầu miễn phí', ctaVariant: 'outline' as const,
  },
  {
    name: 'Cơ bản', price: '199.000', period: 'tháng', desc: 'Cho chủ nhà từ 2–5 tòa nhà',
    highlight: true, badge: 'Phổ biến nhất',
    features: ['5 tòa nhà', '50 phòng', 'Thông báo Telegram', 'Báo cáo doanh thu', 'VNPay + VietQR', 'Email tự động', '2 tài khoản nhân viên'],
    cta: 'Dùng thử 14 ngày', ctaVariant: 'default' as const,
  },
  {
    name: 'Chuyên nghiệp', price: '499.000', period: 'tháng', desc: 'Cho nhà đầu tư quy mô lớn',
    highlight: false, badge: null,
    features: ['Không giới hạn tòa nhà', 'Không giới hạn phòng', 'Tất cả tính năng Cơ bản', 'API tích hợp', 'Nhân viên không giới hạn', 'Hỗ trợ ưu tiên 24/7'],
    cta: 'Liên hệ tư vấn', ctaVariant: 'outline' as const,
  },
];

const TESTIMONIALS = [
  { name: 'Nguyễn Văn Hùng', role: 'Chủ 3 dãy trọ tại Bình Dương', content: 'Trước đây tôi ghi sổ tay, cứ cuối tháng là loạn hết. Giờ chỉ cần mở điện thoại là biết ngay ai chưa đóng tiền.', rating: 5, avatar: 'H' },
  { name: 'Trần Thị Lan', role: 'Quản lý 45 phòng trọ tại TP.HCM', content: 'Tính năng VietQR quá tiện, khách thuê quét mã là chuyển tiền ngay. Không cần gọi nhắc nữa.', rating: 5, avatar: 'L' },
  { name: 'Phạm Minh Tuấn', role: 'Nhà đầu tư BĐS tại Hà Nội', content: 'Báo cáo doanh thu rõ ràng giúp tôi biết được căn nào đang lỗ để điều chỉnh giá.', rating: 5, avatar: 'T' },
];

const FAQS = [
  { q: 'Tôi có thể dùng thử trước khi trả phí không?', a: 'Có. Gói Miễn phí cho phép bạn dùng mãi mãi với 1 tòa nhà và 10 phòng. Gói trả phí có 14 ngày dùng thử.' },
  { q: 'Dữ liệu của tôi có được bảo mật không?', a: 'Dữ liệu được mã hóa và lưu trữ an toàn. Thông tin thanh toán được mã hóa AES-256.' },
  { q: 'Phần mềm có hoạt động trên điện thoại không?', a: 'Có. Giao diện mobile-first, hoạt động tốt trên mọi thiết bị.' },
  { q: 'Tôi có thể hủy gói bất kỳ lúc nào không?', a: 'Có thể hủy bất kỳ lúc nào, không ràng buộc hợp đồng.' },
  { q: 'Hỗ trợ bao nhiêu phương thức thanh toán?', a: 'Hỗ trợ: Tiền mặt, Chuyển khoản (VietQR), VNPay, MoMo.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản miễn phí trong 30 giây.', icon: Users },
  { step: '02', title: 'Thêm bất động sản', desc: 'Nhập thông tin tòa nhà, phòng và khách thuê.', icon: Building2 },
  { step: '03', title: 'Tự động hóa', desc: 'Hệ thống tự tạo hóa đơn, gửi thông báo và thu tiền.', icon: Zap },
  { step: '04', title: 'Theo dõi doanh thu', desc: 'Xem báo cáo chi tiết, biết phòng nào sinh lời.', icon: BarChart3 },
];

const WHY_US = [
  { icon: Globe, title: 'Thiết kế cho Việt Nam', desc: 'Giao diện tiếng Việt, VietQR, VNPay, MoMo.', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Clock, title: 'Tiết kiệm 10+ giờ/tháng', desc: 'Tự động hóa giúp bạn tập trung vào việc quan trọng.', gradient: 'from-emerald-500 to-green-500' },
  { icon: Smartphone, title: 'Mobile-first', desc: 'Quản lý mọi nơi từ điện thoại.', gradient: 'from-violet-500 to-purple-500' },
  { icon: Lock, title: 'Bảo mật cấp ngân hàng', desc: 'Mã hóa AES-256, JWT hai lớp.', gradient: 'from-orange-500 to-red-500' },
  { icon: LineChart, title: 'Phân tích thông minh', desc: 'Báo cáo tự động, dashboard trực quan.', gradient: 'from-pink-500 to-rose-500' },
  { icon: Zap, title: 'Triển khai tức thì', desc: 'Đăng ký xong là dùng được ngay.', gradient: 'from-indigo-500 to-blue-500' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button className="w-full flex items-center justify-between py-4 text-left gap-3" onClick={() => setOpen(!open)}>
        <span className="font-medium text-gray-900 text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-gray-500 text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

// ─── Mobile Landing Page ─────────────────────────────────────────────────────
// Pure CSS animations, zero framer-motion, optimized for low-end devices.

export function LandingMobile() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-gray-900">RentalSaaS</span>
          </Link>
          <button className="p-2 rounded-lg" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            {['Tính năng', 'Cách hoạt động', 'Bảng giá', 'Đánh giá', 'FAQ'].map((label) => (
              <a key={label} href={`#${label === 'Tính năng' ? 'features' : label === 'Cách hoạt động' ? 'how-it-works' : label === 'Bảng giá' ? 'pricing' : label === 'Đánh giá' ? 'testimonials' : 'faq'}`} className="block py-2 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <div className="pt-2 flex flex-col gap-2 border-t border-gray-100">
              <Link href="/login"><Button variant="outline" className="w-full rounded-xl text-sm">Đăng nhập</Button></Link>
              <Link href="/register"><Button className="w-full rounded-xl text-sm bg-gradient-to-r from-indigo-600 to-violet-600">Dùng thử miễn phí</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="px-4 pt-10 pb-8">
        <div className="mobile-reveal mobile-reveal-d1">
          <Badge className="mb-5 w-fit bg-indigo-50 text-indigo-700 border-indigo-200/60 rounded-xl px-3 py-1 text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Dành riêng cho chủ nhà trọ Việt Nam
          </Badge>
        </div>

        <h1 className="mobile-reveal mobile-reveal-d2 text-[2rem] font-extrabold tracking-tight text-gray-900 leading-[1.15]">
          Quản lý nhà trọ{' '}
          <span className="stripe-gradient-text">thông minh</span>
          <br />
          <span className="text-gray-800">— không còn sổ tay</span>
        </h1>

        <p className="mobile-reveal mobile-reveal-d3 mt-5 text-base text-gray-500 leading-relaxed">
          Tự động hóa hóa đơn, thu tiền, nhắc nhở và báo cáo doanh thu.
          Tiết kiệm hàng giờ mỗi tháng cho mỗi chủ nhà.
        </p>

        <div className="mobile-reveal mobile-reveal-d4 mt-7 flex flex-col gap-3">
          <Link href="/register">
            <Button size="lg" className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20">
              Bắt đầu miễn phí <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full h-12 text-base rounded-xl border-gray-200">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>

        <p className="mobile-reveal mobile-reveal-d5 mt-3 text-xs text-gray-400 text-center">
          Không cần thẻ tín dụng · Miễn phí mãi mãi với gói cơ bản
        </p>

        {/* Stats */}
        <div className="mobile-reveal mobile-reveal-d5 mt-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Chủ nhà tin dùng', value: '1,200+' },
            { label: 'Phòng quản lý', value: '18,000+' },
            { label: 'Hóa đơn/tháng', value: '50,000+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold stripe-gradient-text">{stat.value}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Hero image */}
        <div className="mobile-reveal mobile-reveal-d6 mt-8">
          <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200/50">
            <Image src="/hd.jpg" alt="Rental property" width={800} height={300} priority className="w-full h-[240px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-white/90 rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-md">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Quản lý toàn bộ bất động sản</p>
                  <p className="text-[10px] text-gray-500">Nhiều tòa nhà, nhiều phòng — một màn hình</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="py-8 border-y border-gray-100">
        <div className="px-4 text-center">
          <p className="text-xs text-gray-400 mb-4">Được tin dùng bởi hàng nghìn chủ nhà trọ</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Bình Dương', 'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'].map((city) => (
              <span key={city} className="text-sm font-extrabold text-gray-900">{city}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="py-12 px-4">
        <p className="text-red-500 font-semibold text-xs tracking-wide uppercase mb-2 text-center">Vấn đề thường gặp</p>
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2">Bạn đang gặp những vấn đề này?</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Chúng tôi hiểu nỗi đau của chủ nhà trọ</p>
        <div className="space-y-3">
          {PAIN_POINTS.map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-12 px-4 bg-gray-50">
        <p className="text-indigo-600 font-semibold text-xs tracking-wide uppercase mb-2 text-center">Tính năng nổi bật</p>
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2">Tất cả những gì bạn cần</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Một nền tảng — giải quyết mọi vấn đề quản lý nhà trọ</p>
        <div className="space-y-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-12 px-4">
        <p className="text-emerald-600 font-semibold text-xs tracking-wide uppercase mb-2 text-center">Cách hoạt động</p>
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Bắt đầu trong 4 bước</h2>
        <div className="space-y-4">
          {HOW_IT_WORKS.map((item, i) => (
            <div key={item.step} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-12 px-4 bg-gray-950 text-white">
        <p className="text-indigo-400 font-semibold text-xs tracking-wide uppercase mb-2 text-center">Tại sao chọn RentalSaaS</p>
        <h2 className="text-2xl font-extrabold text-center mb-8">Được thiết kế riêng cho Việt Nam</h2>
        <div className="grid grid-cols-2 gap-3">
          {WHY_US.map((card) => (
            <div key={card.title} className="bg-gray-900/80 rounded-xl p-4 border border-gray-800">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm text-white mb-1">{card.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-12 px-4">
        <p className="text-indigo-600 font-semibold text-xs tracking-wide uppercase mb-2 text-center">Bảng giá</p>
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2">Giá đơn giản, minh bạch</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Bắt đầu miễn phí, nâng cấp khi cần</p>
        <div className="space-y-4">
          {PRICING.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-5 border ${plan.highlight ? 'border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-200' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                {plan.badge && <span className="text-[10px] font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded-full">{plan.badge}</span>}
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price}₫</span>
                <span className="text-sm text-gray-500">/{plan.period}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant={plan.ctaVariant} className={`w-full rounded-xl ${plan.highlight ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white' : ''}`}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-12 px-4 bg-gray-50">
        <p className="text-indigo-600 font-semibold text-xs tracking-wide uppercase mb-2 text-center">Đánh giá</p>
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Chủ nhà nói gì?</h2>
        <div className="space-y-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <StarRating count={t.rating} />
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-[11px] text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-12 px-4">
        <p className="text-indigo-600 font-semibold text-xs tracking-wide uppercase mb-2 text-center">FAQ</p>
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Câu hỏi thường gặp</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 px-4 bg-gradient-to-br from-indigo-600 to-violet-600">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Sẵn sàng quản lý thông minh hơn?</h2>
          <p className="text-indigo-100 text-sm mb-6">Tham gia cùng 1,200+ chủ nhà trọ đã tin dùng</p>
          <div className="flex flex-col gap-3">
            <Link href="/register">
              <Button size="lg" className="w-full h-12 rounded-xl bg-white text-indigo-700 font-semibold shadow-xl hover:bg-gray-50">
                Bắt đầu miễn phí <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full h-12 rounded-xl border-white/30 text-white hover:bg-white/10">
                Tôi đã có tài khoản <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-400 pt-10 pb-6 px-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">RentalSaaS</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">Nền tảng quản lý nhà trọ thông minh dành cho chủ nhà Việt Nam.</p>
        <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-800/50">
          <div>
            <p className="font-semibold text-white mb-3 text-xs tracking-wide uppercase">Sản phẩm</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#features">Tính năng</a></li>
              <li><a href="#pricing">Bảng giá</a></li>
              <li><Link href="/register">Đăng ký</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3 text-xs tracking-wide uppercase">Pháp lý</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms">Điều khoản</Link></li>
              <li><Link href="/privacy">Bảo mật</Link></li>
              <li><Link href="/refund">Hoàn tiền</Link></li>
            </ul>
          </div>
        </div>
        <p className="pt-6 text-xs text-gray-500 text-center">&copy; 2026 RentalSaaS. Bảo lưu mọi quyền.</p>
      </footer>
    </div>
  );
}
