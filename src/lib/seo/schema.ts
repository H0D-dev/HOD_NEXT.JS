/**
 * Schema.org JSON-LD Generator Utilities for House of Decór
 */

export const BASE_URL = 'https://houseofdecor.ae';

/**
 * Global LocalBusiness / HomeGoodsStore & Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'HomeGoodsStore', 'FurnitureStore'],
    '@id': `${BASE_URL}/#organization`,
    name: 'House of Decór',
    legalName: 'House of Decór Bespoke Interiors LLC',
    url: BASE_URL,
    logo: `${BASE_URL}/logo/new_logo_footer.png`,
    image: `${BASE_URL}/about_hero_desktop.png`,
    email: 'connect@houseofdecor.ae',
    telephone: '+971521236888',
    priceRange: '$$$$',
    currenciesAccepted: 'AED, USD, EUR, GBP',
    paymentAccepted: 'Credit Card, Debit Card, Wire Transfer',
    sameAs: [
      'https://www.instagram.com/houseofdecoruae',
      'https://www.facebook.com/houseofdecoruae',
      'https://www.pinterest.com/houseofdecoruae',
      'https://www.linkedin.com/company/houseofdecoruae',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dubai Design District (d3) & Al Quoz 1',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      postalCode: '00000',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.1857,
      longitude: 55.2988,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+971521236888',
      contactType: 'customer service',
      areaServed: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'GB', 'US'],
      availableLanguage: ['English', 'Arabic'],
    },
  };
}

/**
 * Global WebSite Schema (Emitted in root layout)
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'House of Decór',
    url: BASE_URL,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
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
 * FAQPage Schema
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

/**
 * WebApplication Schema for Interactive Tools (e.g. Room Visualizer)
 */
export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'House of Decór Virtual Room Visualizer',
    url: `${BASE_URL}/room-visualizer`,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All (Browser-based WebGL/Canvas)',
    browserRequirements: 'Requires JavaScript, HTML5 Canvas and WebGL support',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
    },
    description:
      'Interactive 2D/3D luxury rug visualizer. Upload custom room photos or select curated living spaces to preview handmade rugs with perspective transform, ambient lighting, and precision scale.',
    author: {
      '@type': 'Organization',
      name: 'House of Decór',
      url: BASE_URL,
    },
  };
}

/**
 * CreativeWork / Project Schema for Case Studies
 */
export function generateProjectSchema(project: {
  title: string;
  subtitle?: string;
  slug: string;
  summary: string;
  heroImage: string;
  location: string;
  year: string;
  specs: {
    clientType: string;
    materials: string[];
    techniques: string[];
    scope: string;
  };
  partnerCredits?: { name: string; role: string; url?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['CreativeWork', 'VisualArtwork'],
    name: project.title,
    headline: project.subtitle || project.title,
    description: project.summary,
    image: project.heroImage.startsWith('http') ? project.heroImage : `${BASE_URL}${project.heroImage}`,
    url: `${BASE_URL}/projects/${project.slug}`,
    dateCreated: project.year,
    locationCreated: {
      '@type': 'Place',
      name: project.location,
    },
    artMedium: project.specs.materials.join(', '),
    artform: project.specs.techniques.join(', '),
    creator: {
      '@type': 'Organization',
      name: 'House of Decór',
      url: BASE_URL,
    },
    contributor: (project.partnerCredits || []).map((partner) => ({
      '@type': 'Organization',
      name: partner.name,
      description: partner.role,
      url: partner.url || BASE_URL,
    })),
  };
}
