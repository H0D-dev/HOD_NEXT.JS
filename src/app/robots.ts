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
        ],
      },
    ],
    sitemap: 'https://houseofdecor.ae/sitemap.xml',
  };
}
