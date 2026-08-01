/**
 * Schema.org JSON-LD Generator Utilities for House of Decór
 */

export const BASE_URL = 'https://houseofdecor.ae';

/**
 * Global Organization Schema (Emitted ONLY ONCE in root layout)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'House of Decór',
    url: BASE_URL,
    logo: `${BASE_URL}/logo/new_logo_footer.png`,
    image: `${BASE_URL}/about_hero_desktop.png`,
    email: 'connect@houseofdecor.ae',
    telephone: '+971521236888',
    sameAs: [
      'https://www.instagram.com/houseofdecoruae',
      'https://www.facebook.com/houseofdecoruae',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+971521236888',
      contactType: 'customer service',
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
  };
}

/**
 * Global WebSite Schema (Emitted ONLY ONCE in root layout)
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'House of Decór',
    url: BASE_URL,
  };
}

/**
 * Helper to map WooCommerce stock status to Schema.org availability
 */
export function mapStockAvailability(stockStatus?: string): string {
  switch (stockStatus?.toLowerCase()) {
    case 'instock':
      return 'https://schema.org/InStock';
    case 'outofstock':
      return 'https://schema.org/OutOfStock';
    case 'onbackorder':
      return 'https://schema.org/BackOrder';
    default:
      return 'https://schema.org/InStock';
  }
}

/**
 * Product & Offer Schema (Constructed directly from server-side Product object)
 */
export function generateProductSchema(product: any, categorySlug: string = 'rugs') {
  if (!product) return null;

  const images: string[] = [];
  if (Array.isArray(product.colors)) {
    product.colors.forEach((c: any) => {
      if (c.lifestyleUrl) images.push(c.lifestyleUrl);
      if (c.textureUrl && !images.includes(c.textureUrl)) images.push(c.textureUrl);
    });
  }
  if (images.length === 0 && product.mainImage?.src) {
    images.push(product.mainImage.src);
  }

  const price = product.price || product.regularPrice || 0;
  const productUrl = `${BASE_URL}/products/${categorySlug}/${product.slug}`;

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.shortDescription || product.name,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'House of Decór',
    },
    image: images.length > 0 ? images : undefined,
    url: productUrl,
    category: product.design || (categorySlug === 'curtains' ? 'Bespoke Curtains' : 'Handmade Rugs'),
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'AED',
      availability: mapStockAvailability(product.stockStatus),
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'House of Decór',
      },
      url: productUrl,
    },
  };

  // Only emit rating/review schema when genuine data exists on product object
  if (product.aggregateRating && product.aggregateRating.ratingValue) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.aggregateRating.ratingValue,
      reviewCount: product.aggregateRating.reviewCount || 1,
    };
  }

  return schema;
}

/**
 * BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * CollectionPage & ItemList Schema
 */
export function generateCollectionSchema(
  title: string,
  description: string,
  categorySlug: string,
  products: any[]
) {
  const collectionUrl = `${BASE_URL}/products/${categorySlug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: collectionUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: (products || []).slice(0, 30).map((p: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: p.name,
        url: `${BASE_URL}/products/${categorySlug}/${p.slug}`,
      })),
    },
  };
}

/**
 * BlogPosting Schema
 */
export function generateBlogPostingSchema(blog: any) {
  if (!blog) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.image ? [blog.image] : undefined,
    datePublished: blog.date,
    author: {
      '@type': 'Organization',
      name: 'House of Decór',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'House of Decór',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo/new_logo_footer.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${blog.slug}`,
    },
  };
}

/**
 * FAQPage Schema (FAQ text MUST literally match visible UI text)
 */
export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
