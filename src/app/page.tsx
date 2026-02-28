'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import {
  Building2, ChevronDown, Check, Star,
  FileText, CreditCard, Bell, BarChart3, Shield, Zap,
  Users, Home, Receipt, MessageSquare, Menu, X,
  ArrowRight, Sparkles, Globe, Clock,
  Smartphone, Lock, LineChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  MotionConfig,
} from 'framer-motion';

// ─── Animation Variants ──────────────────────────────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_OUT },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE_OUT },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Animated Section Wrapper ────────────────────────────────────────────────
// On mobile (<=1024px), renders a plain div — zero JS animation overhead.

function AnimatedSection({
  children,
  className = '',
  mobile,
}: {
  children: React.ReactNode;
  className?: string;
  mobile?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  if (mobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    icon: FileText,
    title: 'Sổ sách giấy tờ lộn xộn',
    desc: 'Hết thời gian ghi chép tay, mất hóa đơn, nhầm số tiền điện nước từng phòng.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    gradient: 'from-red-500/20 to-red-500/5',
  },
  {
    icon: Bell,
    title: 'Quên nhắc đóng tiền phòng',
    desc: 'Khách thuê trả chậm, bạn phải gọi điện nhắc từng người. Vừa mất thời gian vừa ngại ngùng.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
  {
    icon: BarChart3,
    title: 'Không biết doanh thu thực tế',
    desc: 'Tiền vào tiền ra không rõ ràng, không biết phòng nào sinh lời, phòng nào bị lỗ.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
];

const FEATURES = [
  {
    icon: Home,
    title: 'Quản lý bất động sản',
    desc: 'Thêm nhiều tòa nhà, nhiều phòng. Theo dõi trạng thái từng phòng theo thời gian thực.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Hồ sơ khách thuê',
    desc: 'Lưu thông tin đầy đủ, hợp đồng, giấy tờ. Khách thuê tự xem hóa đơn qua cổng riêng.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Receipt,
    title: 'Hóa đơn tự động',
    desc: 'Nhập chỉ số điện nước, hệ thống tính tiền và tạo hóa đơn PDF ngay lập tức.',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: CreditCard,
    title: 'Thanh toán đa kênh',
    desc: 'VNPay, chuyển khoản ngân hàng VietQR, MoMo, tiền mặt — tất cả trong một giao diện.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: MessageSquare,
    title: 'Thông báo Telegram',
    desc: 'Nhắc nhở đóng tiền, xác nhận thanh toán gửi tự động qua Telegram bot.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Bảo mật cao',
    desc: 'JWT hai lớp, mã hóa dữ liệu thanh toán, phân quyền nhân viên chi tiết.',
    gradient: 'from-indigo-500 to-blue-500',
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

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Đăng ký tài khoản',
    desc: 'Tạo tài khoản miễn phí trong 30 giây. Không cần thẻ tín dụng.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Thêm bất động sản',
    desc: 'Nhập thông tin tòa nhà, phòng và khách thuê của bạn.',
    icon: Building2,
  },
  {
    step: '03',
    title: 'Tự động hóa',
    desc: 'Hệ thống tự tạo hóa đơn, gửi thông báo và thu tiền cho bạn.',
    icon: Zap,
  },
  {
    step: '04',
    title: 'Theo dõi doanh thu',
    desc: 'Xem báo cáo chi tiết, biết phòng nào sinh lời, phòng nào cần điều chỉnh.',
    icon: BarChart3,
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="border-b border-gray-200/60 last:border-0"
    >
      <button
        className="w-full flex items-center justify-between py-6 text-left gap-4 group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE_IN_OUT }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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

// Floating gradient orb for background decoration
function GradientOrb({
  className,
  color = 'indigo',
  mobile,
}: {
  className?: string;
  color?: string;
  mobile?: boolean;
}) {
  if (mobile) return null; // Skip heavy blur elements on mobile
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-400/40',
    violet: 'bg-violet-400/40',
    blue: 'bg-blue-400/35',
    cyan: 'bg-cyan-400/35',
    purple: 'bg-purple-400/35',
  };
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none hidden md:block ${colorMap[color] || colorMap.indigo} ${className}`}
    />
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, isMobile ? 1 : 0]);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <MotionConfig reducedMotion={isMobile ? 'always' : 'never'}>
    <div className={`min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden relative ${isMobile ? 'landing-perf' : ''}`}>
      {/* ── Stripe-style gradient mesh background ── */}
      <div className="stripe-gradient-bg" aria-hidden />

      {/* ── Navbar ── */}
      <motion.nav
        initial={isMobile ? false : { y: -20, opacity: 0 }}
        animate={isMobile ? undefined : { y: 0, opacity: 1 }}
        transition={isMobile ? undefined : { duration: 0.5 }}
        className={`sticky top-0 z-50 border-b border-gray-200/40 ${isMobile ? 'bg-white' : 'backdrop-blur-2xl bg-white/70'}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              RentalSaaS
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Tính năng', href: '#features' },
              { label: 'Cách hoạt động', href: '#how-it-works' },
              { label: 'Bảng giá', href: '#pricing' },
              { label: 'Đánh giá', href: '#testimonials' },
              { label: 'FAQ', href: '#faq' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-indigo-600 rounded-xl px-4">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="rounded-xl px-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
              >
                Dùng thử miễn phí
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-gray-100/50 bg-white/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Tính năng</a>
                <a href="#how-it-works" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Cách hoạt động</a>
                <a href="#pricing" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Bảng giá</a>
                <a href="#testimonials" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>Đánh giá</a>
                <a href="#faq" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                <div className="pt-2 flex flex-col gap-2 border-t border-gray-100">
                  <Link href="/login"><Button variant="outline" className="w-full rounded-xl">Đăng nhập</Button></Link>
                  <Link href="/register"><Button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600">Dùng thử miễn phí</Button></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero (original 2-col layout + Stripe polish) ── */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Stripe gradient mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] stripe-mesh-1" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] stripe-mesh-2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] stripe-mesh-3" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="lg:grid lg:grid-cols-2 lg:gap-16 items-center min-h-[calc(100vh-4rem)] py-16 sm:py-20"
          >
            {/* Left — Text */}
            <div className="flex flex-col justify-center">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                <Badge className="mb-6 w-fit bg-indigo-50 text-indigo-700 border-indigo-200/60 hover:bg-indigo-100 backdrop-blur-sm rounded-xl px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Dành riêng cho chủ nhà trọ Việt Nam
                </Badge>
              </motion.div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-gray-900 leading-[1.1]"
              >
                Quản lý nhà trọ{' '}
                <span className="stripe-gradient-text">
                  thông minh
                </span>
                <br />
                <span className="text-gray-800">— không còn sổ tay</span>
              </h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="mt-6 text-lg sm:text-xl text-gray-500 max-w-lg leading-relaxed"
              >
                Tự động hóa hóa đơn, thu tiền, nhắc nhở và báo cáo doanh thu.
                Tiết kiệm hàng giờ mỗi tháng cho mỗi chủ nhà.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="mt-8 flex flex-col sm:flex-row gap-3"
              >
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-base rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Bắt đầu miễn phí
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-8 text-base rounded-xl border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 backdrop-blur-sm transition-all duration-300"
                  >
                    Đăng nhập ngay
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="mt-4 text-sm text-gray-400"
              >
                Không cần thẻ tín dụng · Miễn phí mãi mãi với gói cơ bản
              </motion.p>

              {/* Stats */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="mt-12 grid grid-cols-3 gap-6 max-w-sm"
              >
                {[
                  { label: 'Chủ nhà tin dùng', value: '1,200+' },
                  { label: 'Phòng quản lý', value: '18,000+' },
                  { label: 'Hóa đơn/tháng', value: '50,000+' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} variants={fadeUp} custom={i}>
                    <div className="text-2xl font-bold stripe-gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right — Photo */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
              className="mt-14 lg:mt-0 relative"
            >
              {/* Glow effect — hidden on mobile for performance */}
              <div className="hidden md:block absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl -z-10 blur-3xl" />
              <div className="hidden md:block absolute -inset-1 bg-gradient-to-br from-indigo-500/20 via-transparent to-violet-500/20 rounded-2xl -z-10" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 ring-1 ring-white/20">
                <Image
                  src="/hd.jpg"
                  alt="Luxury rental property"
                  width={800}
                  height={520}
                  priority
                  className="w-full h-[520px] object-cover"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating glassmorphism badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute bottom-5 left-5 right-5"
                >
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg border border-white/50">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Quản lý toàn bộ bất động sản</p>
                      <p className="text-xs text-gray-500">Nhiều tòa nhà, nhiều phòng — một màn hình</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating stat card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute top-5 right-5"
                >
                  {/* <div className="bg-white/80 backdrop-blur-xl rounded-xl px-3 py-2 shadow-lg border border-white/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-medium text-gray-700">98.5% uptime</span>
                    </div>
                  </div> */}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-400">Cuộn xuống</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-2.5 rounded-full bg-gray-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Trusted By / Social Proof Bar ── */}
      <AnimatedSection mobile={isMobile}>
        <motion.section
          variants={fadeIn}
          className="py-12 border-b border-gray-200/60"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-gray-400 mb-6">Được tin dùng bởi hàng nghìn chủ nhà trọ trên cả nước</p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {['Bình Dương', 'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'].map((city) => (
                <span key={city} className="text-lg font-extrabold text-gray-900 tracking-wide">{city}</span>
              ))}
            </div>
          </div>
        </motion.section>
      </AnimatedSection>

      {/* ── Pain Points ── */}
      <section className="pt-20 sm:pt-28 pb-20 sm:pb-28 relative">
        <GradientOrb mobile={isMobile} className="w-[500px] h-[500px] top-0 left-1/2 -translate-x-1/2" color="purple" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection mobile={isMobile}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-red-500 font-semibold text-sm tracking-wide uppercase mb-3">Vấn đề thường gặp</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Bạn đang gặp những vấn đề này?
              </h2>
              <p className="mt-4 text-gray-500 text-lg">Chúng tôi hiểu nỗi đau của chủ nhà trọ</p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection mobile={isMobile}>
            <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-6">
              {PAIN_POINTS.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={scaleIn}
                  custom={i}
                  className="relative group hover:-translate-y-1 transition-transform duration-200"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                    {/* Gradient glow on hover */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`} />
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>

          <AnimatedSection mobile={isMobile}>
            <motion.div variants={fadeUp} className="mt-10 text-center">
              <p className="text-indigo-600 font-semibold text-lg flex items-center justify-center gap-2">
                <ArrowRight className="w-5 h-5" />
                RentalSaaS giải quyết tất cả những điều trên
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50/80 border-y border-gray-200/60 relative">
        <GradientOrb mobile={isMobile} className="w-[400px] h-[400px] top-20 -right-20" color="blue" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection mobile={isMobile}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-indigo-600 font-semibold text-sm tracking-wide uppercase mb-3">Tính năng</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Mọi thứ bạn cần trong một nền tảng
              </h2>
              <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
                Từ quản lý phòng, hóa đơn đến thanh toán — tất cả được tích hợp liền mạch
              </p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection mobile={isMobile}>
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={scaleIn}
                  custom={i}
                  className="group hover:-translate-y-1.5 transition-transform duration-200"
                >
                  <div className="h-full rounded-2xl border border-gray-200/60 bg-white p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 relative overflow-hidden">
                    {/* Stripe-style gradient corner accent */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${f.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-[100px]`} />

                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className="w-5.5 h-5.5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 relative">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed relative">{f.desc}</p>

                    <div className="mt-4 flex items-center gap-1 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Tìm hiểu thêm <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Feature Showcase (alternating) ── */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <GradientOrb mobile={isMobile} className="w-[600px] h-[600px] -left-40 top-30" color="indigo" />
        <GradientOrb mobile={isMobile} className="w-[400px] h-[400px] right-0 bottom-20 top-120" color="violet" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-24 relative">
          {/* Row 1 — Invoice */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection mobile={isMobile}>
              <motion.div variants={slideInLeft}>
                <p className="text-emerald-600 font-semibold text-sm tracking-wide uppercase mb-3">Hóa đơn tự động</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Tạo hóa đơn trong <span className="stripe-gradient-text">30 giây</span>
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Chỉ cần nhập chỉ số điện cuối kỳ — hệ thống tự tính tiền điện, nước, các phí phụ trội
                  và xuất hóa đơn PDF ngay lập tức. Gửi thông báo qua Telegram hoặc email tự động.
                </p>
                <ul className="space-y-3">
                  {['Nhập số điện nước theo đợt', 'Tự tính theo đơn giá đã cài', 'Xuất PDF chuyên nghiệp', 'Gửi thông báo tự động'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection mobile={isMobile}>
              <motion.div variants={slideInRight} className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-3xl blur-2xl -z-10" />
                <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-indigo-200 text-sm">Hóa đơn tháng 2/2026</p>
                        <p className="text-xl font-bold mt-1">Phòng 101 — Toà A</p>
                      </div>
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-medium">Chưa thanh toán</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {[
                      { label: 'Tiền phòng', value: '3.500.000đ' },
                      { label: 'Tiền điện (120 kWh × 3.500đ)', value: '420.000đ' },
                      { label: 'Tiền nước (5m³ × 15.000đ)', value: '75.000đ' },
                      { label: 'Internet', value: '150.000đ' },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500">{row.label}</span>
                        <span className="font-medium text-gray-900">{row.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold stripe-gradient-text text-lg pt-2">
                      <span>Tổng cộng</span>
                      <span>4.145.000đ</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>

          {/* Row 2 — Payment */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection mobile={isMobile}>
              <motion.div variants={slideInLeft} className="order-2 lg:order-1 relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/15 to-pink-500/15 rounded-3xl blur-2xl -z-10" />
                <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xl p-6">
                  <p className="font-semibold text-gray-900 mb-4">Thanh toán ngay</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-center mb-4">
                    <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center shadow-inner border border-gray-100">
                      <div className="grid grid-cols-5 gap-0.5">
                        {[1,0,1,0,1,0,1,1,0,1,1,0,0,0,1,0,1,1,0,1,1,0,1,0,1].map((v, i) => (
                          <div key={i} className={`w-3 h-3 rounded-sm ${v ? 'bg-gray-800' : 'bg-gray-100'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Quét mã VietQR để chuyển khoản</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {[
                      { label: 'VNPay', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/50' },
                      { label: 'MoMo', color: 'bg-purple-50 text-purple-700 border-purple-200/50' },
                      { label: 'VietQR', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50' },
                    ].map((method) => (
                      <div key={method.label} className={`${method.color} rounded-lg p-2.5 font-medium border`}>
                        {method.label}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection mobile={isMobile}>
              <motion.div variants={slideInRight} className="order-1 lg:order-2">
                <p className="text-violet-600 font-semibold text-sm tracking-wide uppercase mb-3">Thanh toán thông minh</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Thu tiền nhanh hơn <span className="stripe-gradient-text">3 lần</span>
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Mỗi hóa đơn đi kèm mã QR ngân hàng riêng. Khách thuê chỉ cần quét là chuyển tiền.
                  Hệ thống tự động đối soát và cập nhật trạng thái thanh toán.
                </p>
                <ul className="space-y-3">
                  {['QR code VietQR tự động theo hóa đơn', 'Thanh toán VNPay trực tuyến', 'Xác nhận tức thì qua Telegram', 'Lịch sử thanh toán đầy đủ'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-violet-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Marketing Cards (Stripe dark section) ── */}
      <section className="py-20 sm:py-28 bg-gray-950 relative overflow-hidden">
        <div className="hidden md:block absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="hidden md:block absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection mobile={isMobile}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-indigo-400 font-semibold text-sm tracking-wide uppercase mb-3">Tại sao chọn chúng tôi</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Xây dựng cho quy mô của bạn
              </h2>
              <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
                Dù bạn quản lý 5 phòng hay 500 phòng, RentalSaaS mở rộng cùng bạn
              </p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection mobile={isMobile}>
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Smartphone,
                  title: 'Mobile-first',
                  desc: 'Thiết kế ưu tiên di động. Quản lý mọi lúc mọi nơi từ điện thoại.',
                  gradient: 'from-cyan-400 to-blue-500',
                },
                {
                  icon: Zap,
                  title: 'Tự động hóa hoàn toàn',
                  desc: 'Hóa đơn, thông báo, nhắc nhở — tất cả chạy tự động, bạn chỉ cần kiểm tra.',
                  gradient: 'from-amber-400 to-orange-500',
                },
                {
                  icon: Lock,
                  title: 'Bảo mật cấp doanh nghiệp',
                  desc: 'Mã hóa AES-256, JWT hai lớp, phân quyền chi tiết cho nhân viên.',
                  gradient: 'from-emerald-400 to-green-500',
                },
                {
                  icon: Globe,
                  title: 'Đa ngôn ngữ',
                  desc: 'Hỗ trợ Tiếng Việt và Tiếng Anh. Giao diện thân thiện cho mọi người dùng.',
                  gradient: 'from-violet-400 to-purple-500',
                },
                {
                  icon: Clock,
                  title: 'Tiết kiệm 15+ giờ/tháng',
                  desc: 'Không cần ghi sổ, không cần gọi nhắc. Thời gian để bạn tập trung mở rộng.',
                  gradient: 'from-pink-400 to-rose-500',
                },
                {
                  icon: LineChart,
                  title: 'Phân tích thông minh',
                  desc: 'Báo cáo doanh thu, tỷ lệ lấp đầy, dự báo xu hướng — tất cả bằng biểu đồ trực quan.',
                  gradient: 'from-indigo-400 to-blue-500',
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  variants={scaleIn}
                  custom={i}
                  className="group hover:-translate-y-1.5 transition-transform duration-200"
                >
                  <div className="h-full rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-300 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-bl-[100px]`} />
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">{card.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-gray-200/60 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection mobile={isMobile}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-emerald-600 font-semibold text-sm tracking-wide uppercase mb-3">Cách hoạt động</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Bắt đầu chỉ trong 4 bước
              </h2>
              <p className="mt-4 text-gray-500 text-lg">Đơn giản, nhanh chóng, hiệu quả</p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection mobile={isMobile}>
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  custom={i}
                  className="relative group"
                >
                  {/* Connector line */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-40px)] h-0.5 bg-gradient-to-r from-indigo-200 to-violet-200" />
                  )}
                  <div className="text-center relative">
                    <div className="relative inline-flex mb-4">
                      <div className="w-20 h-20 rounded-2xl bg-white border-2 border-gray-200 group-hover:border-indigo-300 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-300">
                        <step.icon className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2 mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 sm:py-28 bg-gray-50/80 border-b border-gray-200/60 relative">
        <GradientOrb mobile={isMobile} className="w-[500px] h-[500px] -right-20 top-1/2 -translate-y-1/2" color="indigo" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection mobile={isMobile}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-violet-600 font-semibold text-sm tracking-wide uppercase mb-3">Bảng giá</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Bảng giá rõ ràng, không ẩn phí</h2>
              <p className="mt-4 text-gray-500 text-lg">Bắt đầu miễn phí, nâng cấp khi cần</p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection mobile={isMobile}>
            <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-6 items-start">
              {PRICING.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  variants={scaleIn}
                  custom={i}
                  className="relative hover:-translate-y-2 transition-transform duration-200"
                >
                  <div
                    className={`rounded-2xl p-6 border transition-all duration-300 ${
                      plan.highlight
                        ? 'border-indigo-600 shadow-2xl shadow-indigo-500/15 bg-white ring-2 ring-indigo-600 relative'
                        : 'border-gray-200/60 bg-white hover:shadow-lg hover:border-gray-300'
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/25 px-4 py-1 rounded-xl text-xs">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}
                    <p className="font-semibold text-gray-900 text-lg">{plan.name}</p>
                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {plan.price}đ
                      </span>
                      <span className="text-gray-500 mb-1">/{plan.period}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{plan.desc}</p>

                    <Link href="/register" className="block mt-6">
                      <Button
                        variant={plan.highlight ? 'default' : plan.ctaVariant}
                        className={`w-full rounded-xl transition-all duration-300 ${
                          plan.highlight
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl shadow-indigo-500/25'
                            : 'hover:shadow-md'
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-3 text-sm">
                          <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-indigo-600' : 'text-gray-400'}`} />
                          <span className="text-gray-700">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 sm:py-28 border-b border-gray-200/60 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection mobile={isMobile}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-amber-600 font-semibold text-sm tracking-wide uppercase mb-3">Đánh giá</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Được tin dùng bởi hàng nghìn chủ nhà</h2>
              <p className="mt-4 text-gray-500 text-lg">Đánh giá thực từ người dùng thực</p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection mobile={isMobile}>
            <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={scaleIn}
                  custom={i}
                  className="group hover:-translate-y-1 transition-transform duration-200"
                >
                  <div className="bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
                    <StarRating count={t.rating} />
                    <p className="mt-4 text-gray-600 leading-relaxed text-sm">&ldquo;{t.content}&rdquo;</p>
                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-semibold text-white shadow-lg">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        <p className="text-gray-500 text-xs">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 sm:py-28 bg-gray-50/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <AnimatedSection mobile={isMobile}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-gray-500 font-semibold text-sm tracking-wide uppercase mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Câu hỏi thường gặp</h2>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection mobile={isMobile}>
            <motion.div
              variants={staggerContainer}
              className="bg-white rounded-2xl border border-gray-200/60 shadow-sm px-6"
            >
              {FAQS.map((faq, i) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <AnimatedSection mobile={isMobile}>
        <motion.section
          variants={fadeUp}
          className="py-20 sm:py-28 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gray-950" />
          <div className="absolute inset-0">
            <div className="hidden md:block absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[120px]" />
            <div className="hidden md:block absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-violet-500/15 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                Bắt đầu quản lý nhà trọ{' '}
                <span className="stripe-gradient-text">
                  thông minh
                </span>
                {' '}ngay hôm nay
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Miễn phí mãi mãi với gói cơ bản. Không cần thẻ tín dụng.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-13 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-xl shadow-indigo-500/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Tạo tài khoản miễn phí
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-8 rounded-xl border-gray-700 text-black hover:text-white hover:border-gray-500 hover:bg-gray-800 transition-all duration-300"
                  >
                    Tôi đã có tài khoản
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </AnimatedSection>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-400 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-gray-800/50">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">RentalSaaS</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                Nền tảng quản lý nhà trọ thông minh dành cho chủ nhà Việt Nam.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Sản phẩm</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Tính năng</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Bảng giá</a></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Đăng ký</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Hỗ trợ</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="mailto:support@rental.local" className="hover:text-white transition-colors">Email hỗ trợ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram hỗ trợ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Pháp lý</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">Chính sách hoàn tiền</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">&copy; 2026 RentalSaaS. Bảo lưu mọi quyền.</p>
            <p className="text-sm text-gray-600">Made with love for Vietnamese landlords</p>
          </div>
        </div>
      </footer>
    </div>
    </MotionConfig>
  );
}
