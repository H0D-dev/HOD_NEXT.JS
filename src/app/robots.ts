import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account',
          '/cart',
          '/checkout',
          '/login',
          '/register',
          '/order-success',
          '/payment-failed',
          '/payment/',
          '/api/',
          '/admin/',
          '/admin',
        ],
      },
    ],
    sitemap: 'https://houseofdecor.ae/sitemap.xml',
  };
}
