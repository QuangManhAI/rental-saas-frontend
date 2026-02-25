import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ RentalSaaS.',
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Điều khoản sử dụng</h1>
          <p className="text-sm text-gray-400">Cập nhật lần cuối: {LAST_UPDATED}</p>
        </div>

        <Section title="1. Chấp nhận điều khoản">
          <p>
            Bằng cách truy cập và sử dụng RentalSaaS ("Dịch vụ"), bạn đồng ý bị ràng buộc bởi
            các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng
            không sử dụng Dịch vụ.
          </p>
          <p>
            Các điều khoản này áp dụng cho tất cả người dùng, bao gồm chủ nhà trọ, nhân viên
            quản lý và khách thuê.
          </p>
        </Section>

        <Section title="2. Mô tả dịch vụ">
          <p>
            RentalSaaS cung cấp nền tảng quản lý nhà trọ trực tuyến bao gồm: tạo và quản lý
            hóa đơn, ghi nhận thanh toán, thông báo qua Telegram, cổng thông tin cho khách
            thuê và báo cáo tài chính.
          </p>
          <p>
            Chúng tôi có quyền sửa đổi, tạm ngừng hoặc ngừng cung cấp Dịch vụ bất kỳ lúc
            nào với thông báo trước 30 ngày (trừ trường hợp khẩn cấp).
          </p>
        </Section>

        <Section title="3. Tài khoản người dùng">
          <p>
            Bạn có trách nhiệm bảo mật thông tin đăng nhập tài khoản. Bạn không được chia sẻ
            tài khoản với người khác và phải thông báo ngay cho chúng tôi nếu phát hiện truy
            cập trái phép.
          </p>
          <p>
            Mỗi tài khoản chỉ được sử dụng cho một chủ nhà trọ. Việc tạo nhiều tài khoản để
            vượt qua giới hạn gói dịch vụ là vi phạm điều khoản và có thể dẫn đến đình chỉ
            tài khoản.
          </p>
        </Section>

        <Section title="4. Quyền và nghĩa vụ của người dùng">
          <p><strong>Bạn có quyền:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Sử dụng Dịch vụ theo đúng mục đích quản lý nhà trọ</li>
            <li>Xuất và tải về dữ liệu của mình</li>
            <li>Yêu cầu hỗ trợ kỹ thuật theo mức gói đăng ký</li>
          </ul>
          <p><strong>Bạn không được:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Sử dụng Dịch vụ cho mục đích bất hợp pháp</li>
            <li>Cố gắng xâm nhập hoặc phá vỡ hệ thống bảo mật</li>
            <li>Thu thập dữ liệu của người dùng khác trái phép</li>
            <li>Bán lại hoặc cấp phép lại quyền truy cập Dịch vụ</li>
          </ul>
        </Section>

        <Section title="5. Chính sách dữ liệu">
          <p>
            Dữ liệu bạn nhập vào hệ thống (thông tin khách thuê, hóa đơn, thanh toán) thuộc
            sở hữu của bạn. Chúng tôi chỉ sử dụng dữ liệu này để cung cấp Dịch vụ và không
            bán cho bên thứ ba.
          </p>
          <p>
            Chúng tôi lưu trữ dữ liệu trong thời gian bạn sử dụng Dịch vụ cộng thêm 90 ngày
            sau khi hủy tài khoản, sau đó dữ liệu sẽ bị xóa vĩnh viễn.
          </p>
        </Section>

        <Section title="6. Thanh toán và gói dịch vụ">
          <p>
            Gói Free hoạt động mà không cần thanh toán. Các gói trả phí (Basic, Pro) được
            kích hoạt thủ công thông qua liên hệ với đội ngũ hỗ trợ và thanh toán theo tháng
            hoặc năm.
          </p>
          <p>
            Nếu không gia hạn, tài khoản sẽ tự động chuyển về gói Free sau ngày hết hạn. Dữ
            liệu vẫn được bảo lưu nhưng các tính năng nâng cao sẽ bị tắt.
          </p>
        </Section>

        <Section title="7. Giới hạn trách nhiệm">
          <p>
            Dịch vụ được cung cấp "nguyên trạng". Chúng tôi không đảm bảo Dịch vụ sẽ hoạt
            động liên tục không gián đoạn hoặc không có lỗi.
          </p>
          <p>
            Trong mọi trường hợp, trách nhiệm của RentalSaaS không vượt quá số tiền bạn đã
            thanh toán cho Dịch vụ trong 3 tháng gần nhất.
          </p>
          <p>
            Chúng tôi không chịu trách nhiệm về tổn thất gián tiếp, mất dữ liệu do lỗi người
            dùng, hoặc hành vi của bên thứ ba.
          </p>
        </Section>

        <Section title="8. Chấm dứt hợp đồng">
          <p>
            Bạn có thể hủy tài khoản bất kỳ lúc nào. Chúng tôi có quyền đình chỉ hoặc chấm
            dứt tài khoản vi phạm điều khoản mà không cần thông báo trước.
          </p>
        </Section>

        <Section title="9. Thay đổi điều khoản">
          <p>
            Chúng tôi có thể cập nhật các Điều khoản này. Các thay đổi quan trọng sẽ được
            thông báo qua email hoặc thông báo trong hệ thống ít nhất 14 ngày trước khi có
            hiệu lực. Việc tiếp tục sử dụng Dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa
            với việc bạn chấp nhận các điều khoản mới.
          </p>
        </Section>

        <Section title="10. Liên hệ">
          <p>
            Nếu bạn có câu hỏi về các Điều khoản này, vui lòng liên hệ:{' '}
            <a href="mailto:support@rentalsaas.vn" className="text-indigo-600 hover:underline">
              support@rentalsaas.vn
            </a>
          </p>
        </Section>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        <div className="flex justify-center gap-6">
          <Link href="/privacy" className="hover:text-gray-600">Chính sách bảo mật</Link>
          <Link href="/refund" className="hover:text-gray-600">Chính sách hoàn tiền</Link>
          <Link href="/" className="hover:text-gray-600">Trang chủ</Link>
        </div>
      </footer>
    </div>
  );
}
