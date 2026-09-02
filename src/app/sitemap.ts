import { MetadataRoute } from 'next';
import { API_CONFIG } from '@/src/lib/api/api';
import { projectsData } from '@/src/lib/data/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://houseofdecor.ae';

  // Base static core routes
  const baseStaticPaths = [
    '',
    '/about',
    '/services',
    '/contact',
    '/bespoke',
    '/projects',
    '/room-visualizer',
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
    '/blog',
  ];

  // Case studies dynamic paths from projects data
  const projectPaths = projectsData.map((p) => `/projects/${p.slug}`);

  const staticRoutes: MetadataRoute.Sitemap = [...baseStaticPaths, ...projectPaths].map((route) => ({
    url: route === '' ? `${baseUrl}/` : `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/room-visualizer' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : route.startsWith('/projects/') ? 0.85 : 0.8,
  }));

  // Dynamic products from WooCommerce REST API with pagination loop
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const fields = 'id,slug,categories,date_modified';
    let page = 1;
    let hasMoreProducts = true;

    while (hasMoreProducts && page <= 10) { // Safety cap up to 1,000 products
      const wooUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=${fields}&per_page=100&page=${page}`;
      const res = await fetch(wooUrl, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) break;

      const products = await res.json();
      if (!Array.isArray(products) || products.length === 0) break;

      const entries = products
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

      productEntries.push(...entries);

      if (products.length < 100) {
        hasMoreProducts = false;
      } else {
        page++;
      }
    }
  } catch (error) {
    console.error('Failed to fetch sitemap products:', error);
  }

  // Dynamic blog posts from WordPress REST API with pagination loop
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    let postPage = 1;
    let hasMorePosts = true;

    while (hasMorePosts && postPage <= 10) { // Safety cap up to 1,000 posts
      const wpUrl = `${API_CONFIG.baseUrl}/wp-json/wp/v2/posts?_fields=slug,modified&per_page=100&page=${postPage}`;
      const res = await fetch(wpUrl, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) break;

      const posts = await res.json();
      if (!Array.isArray(posts) || posts.length === 0) break;

      const entries = posts
        .filter((post: any) => post && post.slug)
        .map((post: any) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.modified ? new Date(post.modified) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));

      postEntries.push(...entries);

      if (posts.length < 100) {
        hasMorePosts = false;
      } else {
        postPage++;
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
