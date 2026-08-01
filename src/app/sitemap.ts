import { MetadataRoute } from 'next';
import { API_CONFIG } from '@/src/lib/api/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://houseofdecor.ae';

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/services',
    '/contact',
    '/bespoke',
    '/projects',
    '/designer-trade-program',
    '/know-your-rug',
    '/know-your-rug/fibers-material',
    '/know-your-rug/rug-guide',
    '/know-your-rug/rug-making-process',
    '/know-your-rug/weaving-techniques',
    '/care-cleaning',
    '/size-fitting-guide',
    '/terms-conditions',
    '/privacy-policy',
    '/cookie-policy',
    '/products',
    '/products/rugs',
    '/products/curtains',
    '/blog',
  ].map((route) => ({
    url: route === '' ? `${baseUrl}/` : `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic products from WooCommerce REST API
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const fields = 'id,slug,categories,date_modified';
    const wooUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=${fields}&per_page=100`;
    const res = await fetch(wooUrl, { next: { revalidate: 3600 } });
    if (res.ok) {
      const products = await res.json();
      if (Array.isArray(products)) {
        productEntries = products
          .filter((p: any) => p && p.slug)
          .map((p: any) => {
            const isCurtain = Array.isArray(p.categories) && p.categories.some(
              (c: any) => c.slug === 'curtains' || c.name?.toLowerCase() === 'curtains'
            );
            const categoryFolder = isCurtain ? 'curtains' : 'rugs';
            return {
              url: `${baseUrl}/products/${categoryFolder}/${p.slug}`,
              lastModified: p.date_modified ? new Date(p.date_modified) : new Date(),
              changeFrequency: 'daily' as const,
              priority: 0.9,
            };
          });
      }
    }
  } catch (error) {
    console.error('Failed to fetch sitemap products:', error);
  }

  // Dynamic blog posts from WordPress REST API
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const wpUrl = `${API_CONFIG.baseUrl}/wp-json/wp/v2/posts?_fields=slug,modified&per_page=100`;
    const res = await fetch(wpUrl, { next: { revalidate: 3600 } });
    if (res.ok) {
      const posts = await res.json();
      if (Array.isArray(posts)) {
        postEntries = posts
          .filter((post: any) => post && post.slug)
          .map((post: any) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.modified ? new Date(post.modified) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          }));
      }
    }
  } catch (error) {
    console.error('Failed to fetch sitemap posts:', error);
  }

  // Deduplicate entries by URL
  const allEntries = [...staticRoutes, ...productEntries, ...postEntries];
  const uniqueEntries = Array.from(
    new Map(allEntries.map((item) => [item.url, item])).values()
  );

  return uniqueEntries;
}
