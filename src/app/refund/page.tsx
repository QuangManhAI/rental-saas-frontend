import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách hoàn tiền',
  description: 'Chính sách hoàn tiền và hủy gói dịch vụ của RentalSaaS.',
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

export default function RefundPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chính sách hoàn tiền</h1>
          <p className="text-sm text-gray-400">Cập nhật lần cuối: {LAST_UPDATED}</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-8">
          <p className="text-indigo-800 font-medium">
            Chúng tôi muốn bạn hoàn toàn hài lòng với RentalSaaS. Nếu không hài lòng,
            chúng tôi cam kết giải quyết một cách công bằng.
          </p>
        </div>

        <Section title="1. Gói Free">
          <p>
            Gói Free được cung cấp miễn phí và không có chính sách hoàn tiền do không có
            khoản thanh toán nào được thực hiện.
          </p>
        </Section>

        <Section title="2. Gói trả phí (Basic và Pro)">
          <p>
            Hiện tại, các gói trả phí được kích hoạt thủ công sau khi xác nhận thanh toán.
            Chúng tôi áp dụng chính sách hoàn tiền như sau:
          </p>

          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Trong vòng 7 ngày đầu tiên (Bảo đảm hài lòng)
              </p>
              <p>
                Nếu bạn không hài lòng trong 7 ngày đầu sau khi kích hoạt gói trả phí,
                chúng tôi sẽ hoàn tiền <strong>100%</strong> số tiền đã thanh toán.
                Không cần giải thích lý do.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Từ ngày 8 đến 30 (Hoàn tiền theo tỉ lệ)
              </p>
              <p>
                Chúng tôi sẽ hoàn tiền tương ứng với số ngày chưa sử dụng trong chu kỳ
                thanh toán hiện tại, trừ phí xử lý 10%.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Sau 30 ngày
              </p>
              <p>
                Không hỗ trợ hoàn tiền sau 30 ngày sử dụng. Gói đăng ký sẽ tiếp tục hoạt
                động đến hết chu kỳ đã thanh toán.
              </p>
            </div>
          </div>
        </Section>

        <Section title="3. Điều kiện hoàn tiền">
          <p>Yêu cầu hoàn tiền sẽ được chấp thuận khi:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Tài khoản chưa vi phạm Điều khoản sử dụng</li>
            <li>Yêu cầu được gửi trong thời hạn quy định</li>
            <li>Cung cấp đủ thông tin: mã đơn hàng, phương thức thanh toán, lý do</li>
          </ul>
          <p>Các trường hợp không được hoàn tiền:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Vi phạm Điều khoản sử dụng dẫn đến đình chỉ tài khoản</li>
            <li>Gian lận trong thanh toán</li>
            <li>Tài khoản đã nhận hoàn tiền trước đó trong 12 tháng</li>
          </ul>
        </Section>

        <Section title="4. Quy trình yêu cầu hoàn tiền">
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>
              Gửi email đến{' '}
              <a href="mailto:billing@rentalsaas.vn" className="text-indigo-600 hover:underline">
                billing@rentalsaas.vn
              </a>{' '}
              với tiêu đề "Yêu cầu hoàn tiền - [Email tài khoản]"
            </li>
            <li>Cung cấp: mã giao dịch, ngày thanh toán, lý do hoàn tiền</li>
            <li>Chúng tôi xác nhận yêu cầu trong vòng 2 ngày làm việc</li>
            <li>Hoàn tiền được xử lý trong 5–10 ngày làm việc theo phương thức gốc</li>
          </ol>
        </Section>

        <Section title="5. Hủy gói đăng ký">
          <p>
            Bạn có thể hủy gói đăng ký bất kỳ lúc nào bằng cách liên hệ hỗ trợ. Sau khi
            hủy, tài khoản sẽ giữ nguyên gói hiện tại đến hết chu kỳ đã thanh toán, sau đó
            tự động chuyển về gói Free.
          </p>
          <p>
            Dữ liệu của bạn <strong>không bị xóa</strong> khi hủy gói — bạn vẫn có thể đăng
            nhập và xem dữ liệu với các tính năng của gói Free.
          </p>
        </Section>

        <Section title="6. Liên hệ">
          <p>
            Mọi câu hỏi về hoàn tiền, vui lòng liên hệ:{' '}
            <a href="mailto:billing@rentalsaas.vn" className="text-indigo-600 hover:underline">
              billing@rentalsaas.vn
            </a>{' '}
            hoặc nhắn tin qua Telegram hỗ trợ.
          </p>
        </Section>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        <div className="flex justify-center gap-6">
          <Link href="/terms" className="hover:text-gray-600">Điều khoản sử dụng</Link>
          <Link href="/privacy" className="hover:text-gray-600">Chính sách bảo mật</Link>
          <Link href="/" className="hover:text-gray-600">Trang chủ</Link>
        </div>
      </footer>
    </div>
  );
}
