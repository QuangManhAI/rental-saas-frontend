import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/providers/app-providers';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://rentalsaas.vn';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'RentalSaaS — Phần mềm quản lý nhà trọ thông minh',
    template: '%s | RentalSaaS',
  },
  description:
    'Hệ thống quản lý nhà trọ chuyên nghiệp: hóa đơn tự động, thanh toán online, thông báo Telegram, cổng khách thuê và báo cáo tài chính.',
  keywords: [
    'quản lý nhà trọ',
    'phần mềm nhà trọ',
    'hóa đơn nhà trọ',
    'thanh toán nhà trọ',
    'phần mềm cho thuê phòng',
    'rental management vietnam',
  ],
  authors: [{ name: 'RentalSaaS' }],
  creator: 'RentalSaaS',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: APP_URL,
    siteName: 'RentalSaaS',
    title: 'RentalSaaS — Phần mềm quản lý nhà trọ thông minh',
    description:
      'Quản lý nhà trọ hiệu quả: hóa đơn tự động, thanh toán online, cổng khách thuê và báo cáo tài chính.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RentalSaaS — Quản lý nhà trọ thông minh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentalSaaS — Phần mềm quản lý nhà trọ thông minh',
    description: 'Quản lý nhà trọ hiệu quả với hóa đơn tự động và thanh toán online.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: APP_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'RentalSaaS',
              operatingSystem: 'Web',
              applicationCategory: 'BusinessApplication',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
              description:
                'Phần mềm quản lý nhà trọ thông minh với hóa đơn tự động, thanh toán online và cổng khách thuê.',
              url: APP_URL,
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
