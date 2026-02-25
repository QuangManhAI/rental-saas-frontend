import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách thu thập và sử dụng dữ liệu của RentalSaaS.',
};

const LAST_UPDATED = '01/01/2025';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">RentalSaaS</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chính sách bảo mật</h1>
          <p className="text-sm text-gray-400">Cập nhật lần cuối: {LAST_UPDATED}</p>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          RentalSaaS cam kết bảo vệ quyền riêng tư của bạn. Chính sách này mô tả cách chúng
          tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
        </p>

        <Section title="1. Thông tin chúng tôi thu thập">
          <p><strong>Thông tin tài khoản:</strong> Họ tên, địa chỉ email, số điện thoại khi
          bạn đăng ký tài khoản.</p>
          <p><strong>Dữ liệu kinh doanh:</strong> Thông tin nhà trọ, phòng, khách thuê, hóa
          đơn và thanh toán mà bạn nhập vào hệ thống.</p>
          <p><strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thời gian truy
          cập và nhật ký hoạt động cho mục đích bảo mật.</p>
          <p><strong>Thông tin thanh toán:</strong> Chúng tôi không lưu trữ thông tin thẻ
          ngân hàng. Các giao dịch được xử lý qua cổng thanh toán bên thứ ba (MoMo, VNPay).</p>
        </Section>

        <Section title="2. Cách chúng tôi sử dụng thông tin">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Cung cấp và cải thiện Dịch vụ</li>
            <li>Gửi thông báo hóa đơn, xác nhận thanh toán</li>
            <li>Hỗ trợ kỹ thuật và giải quyết sự cố</li>
            <li>Phân tích xu hướng sử dụng để cải thiện sản phẩm (ẩn danh)</li>
            <li>Tuân thủ nghĩa vụ pháp lý khi được yêu cầu</li>
          </ul>
          <p>
            Chúng tôi <strong>không</strong> bán, cho thuê hoặc chia sẻ thông tin cá nhân của
            bạn với bên thứ ba vì mục đích thương mại.
          </p>
        </Section>

        <Section title="3. Chia sẻ dữ liệu">
          <p>Chúng tôi chỉ chia sẻ dữ liệu trong các trường hợp sau:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Nhà cung cấp dịch vụ:</strong> Các đối tác cần thiết để vận hành (email,
              lưu trữ đám mây, phân tích) đều ký thỏa thuận bảo mật.
            </li>
            <li>
              <strong>Yêu cầu pháp lý:</strong> Khi có yêu cầu hợp lệ từ cơ quan có thẩm
              quyền theo quy định pháp luật Việt Nam.
            </li>
            <li>
              <strong>Bảo vệ quyền lợi:</strong> Khi cần thiết để ngăn chặn gian lận hoặc
              bảo vệ quyền lợi hợp pháp.
            </li>
          </ul>
        </Section>

        <Section title="4. Bảo mật dữ liệu">
          <p>Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật bao gồm:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Mã hóa HTTPS/TLS cho tất cả kết nối</li>
            <li>Mã hóa mật khẩu bằng bcrypt (salt 12)</li>
            <li>Mã hóa AES-256-GCM cho thông tin thanh toán nhạy cảm</li>
            <li>Phân quyền truy cập dữ liệu chặt chẽ</li>
            <li>Sao lưu dữ liệu hàng ngày</li>
            <li>Kiểm tra bảo mật định kỳ</li>
          </ul>
        </Section>

        <Section title="5. Thời gian lưu trữ">
          <p>
            Dữ liệu của bạn được lưu trữ trong suốt thời gian tài khoản hoạt động và thêm{' '}
            <strong>90 ngày</strong> sau khi hủy tài khoản để cho phép khôi phục nếu cần.
          </p>
          <p>
            Sau 90 ngày, dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống của chúng tôi.
            Nhật ký bảo mật có thể được lưu trữ tối đa 12 tháng theo yêu cầu pháp lý.
          </p>
        </Section>

        <Section title="6. Quyền của bạn">
          <p>Bạn có các quyền sau đối với dữ liệu của mình:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Truy cập:</strong> Xem và xuất dữ liệu của bạn bất kỳ lúc nào</li>
            <li><strong>Chỉnh sửa:</strong> Cập nhật thông tin không chính xác</li>
            <li><strong>Xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu của bạn</li>
            <li><strong>Hạn chế xử lý:</strong> Yêu cầu dừng một số hoạt động xử lý dữ liệu</li>
            <li><strong>Tính di động:</strong> Nhận dữ liệu của bạn dưới định dạng JSON/CSV</li>
          </ul>
          <p>
            Để thực hiện các quyền này, liên hệ:{' '}
            <a href="mailto:privacy@rentalsaas.vn" className="text-indigo-600 hover:underline">
              privacy@rentalsaas.vn
            </a>
          </p>
        </Section>

        <Section title="7. Cookie">
          <p>
            Chúng tôi sử dụng cookie và localStorage để lưu trạng thái đăng nhập và tùy
            chọn giao diện. Không có cookie theo dõi quảng cáo.
          </p>
        </Section>

        <Section title="8. Liên hệ">
          <p>
            Mọi câu hỏi về chính sách bảo mật, vui lòng liên hệ:{' '}
            <a href="mailto:privacy@rentalsaas.vn" className="text-indigo-600 hover:underline">
              privacy@rentalsaas.vn
            </a>
          </p>
        </Section>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        <div className="flex justify-center gap-6">
          <Link href="/terms" className="hover:text-gray-600">Điều khoản sử dụng</Link>
          <Link href="/refund" className="hover:text-gray-600">Chính sách hoàn tiền</Link>
          <Link href="/" className="hover:text-gray-600">Trang chủ</Link>
        </div>
      </footer>
    </div>
  );
}
