import { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://rentalsaas.vn';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/terms', '/privacy', '/refund'],
        disallow: [
          '/dashboard',
          '/admin',
          '/onboarding',
          '/api/',
          '/subscription',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
