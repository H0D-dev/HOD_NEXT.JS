import { fetchCatalogProducts } from "../product/getCatalogProducts";
import { getPosts } from "../../services/Posts";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  type: 'product' | 'collection' | 'guide' | 'blog' | 'project';
  image?: string;
}

export interface GroupedSearchResults {
  products: SearchResultItem[];
  collections: SearchResultItem[];
  guides: SearchResultItem[];
  blog: SearchResultItem[];
  projects: SearchResultItem[];
}

const STATIC_COLLECTIONS: SearchResultItem[] = [
  {
    id: 'col-rugs',
    title: 'Handmade Luxury Rugs',
    subtitle: 'Hand-knotted & hand-tufted wool and silk rugs',
    url: '/products/rugs',
    type: 'collection',
    image: '/banners/rugs_banner.jpg',
  },
  {
    id: 'col-bespoke',
    title: 'Bespoke Custom Rugs',
    subtitle: 'Commission custom sizes, fibers, colors, and patterns',
    url: '/bespoke',
    type: 'collection',
  },
  {
    id: 'col-trade',
    title: 'Designer Trade Program',
    subtitle: 'Tailored solutions for architects & interior designers',
    url: '/designer-trade-program',
    type: 'collection',
  },
];

const STATIC_GUIDES: SearchResultItem[] = [
  {
    id: 'guide-size',
    title: 'Rug Size & Placement Guide',
    subtitle: 'Living room, bedroom, and dining room floorplan guide',
    url: '/size-fitting-guide',
    type: 'guide',
  },
  {
    id: 'guide-care',
    title: 'Rug Care & Cleaning Guide',
    subtitle: 'Stain removal and maintenance for silk & wool rugs',
    url: '/care-cleaning',
    type: 'guide',
  },
  {
    id: 'guide-know',
    title: 'Know Your Rug — Artisan Weaving',
    subtitle: 'Fibers, knot density, and hand-weaving techniques',
    url: '/know-your-rug',
    type: 'guide',
  },
  {
    id: 'guide-bespoke',
    title: 'Bespoke Custom Rug Commission',
    subtitle: 'Commission custom sizes, materials, and colors',
    url: '/bespoke',
    type: 'guide',
  },
];

const STATIC_PROJECTS: SearchResultItem[] = [
  {
    id: 'proj-main',
    title: 'Interior Design Portfolio & Projects',
    subtitle: 'Luxury residential, commercial, and yacht interiors',
    url: '/projects',
    type: 'project',
  },
];

export async function performMultiDomainSearch(query: string): Promise<GroupedSearchResults> {
  const q = query.trim().toLowerCase();
  const results: GroupedSearchResults = {
    products: [],
    collections: [],
    guides: [],
    blog: [],
    projects: [],
  };

  if (!q) return results;

  // Search static collections
  results.collections = STATIC_COLLECTIONS.filter(c =>
    c.title.toLowerCase().includes(q) || (c.subtitle && c.subtitle.toLowerCase().includes(q))
  );

  // Search static guides
  results.guides = STATIC_GUIDES.filter(g =>
    g.title.toLowerCase().includes(q) || (g.subtitle && g.subtitle.toLowerCase().includes(q))
  );

  // Search static projects
  results.projects = STATIC_PROJECTS.filter(p =>
    p.title.toLowerCase().includes(q) || (p.subtitle && p.subtitle.toLowerCase().includes(q))
  );

  // Search products with multi-attribute awareness (name, material, construction, colors, categories)
  try {
    const products = await fetchCatalogProducts();
    if (Array.isArray(products)) {
      const searchTerms = q.split(/\s+/).filter(t => t.length > 1);
      // Non-generic terms excluding generic filler words like "rug", "rugs", "carpet"
      const specificTerms = searchTerms.filter(t => !["rug", "rugs", "carpet", "carpets"].includes(t));
      const termsToMatch = specificTerms.length > 0 ? specificTerms : searchTerms;

      results.products = products
        .filter((p: any) => {
          const name = (p.name || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const categories = Array.isArray(p.categories) ? p.categories.map((c: any) => (c.name || "").toLowerCase()).join(" ") : "";
          const construction = (p.acf?.construction || "").toLowerCase();
          const origin = (p.acf?.countryOfOrigin || "").toLowerCase();
          const productColor = (p.acf?.productColor || "").toLowerCase();
          const colors = Array.isArray(p.colors) ? p.colors.map((c: any) => (c.name || "").toLowerCase()).join(" ") : "";
          const attrs = Array.isArray(p.attributes) ? p.attributes.map((a: any) => `${a.name} ${Array.isArray(a.options) ? a.options.join(" ") : ""}`).join(" ").toLowerCase() : "";

          const searchableText = `${name} ${desc} ${categories} ${construction} ${origin} ${productColor} ${colors} ${attrs}`;

          // Direct phrase match
          if (searchableText.includes(q)) return true;

          // All specific terms must match
          if (termsToMatch.length > 0 && termsToMatch.every(term => searchableText.includes(term))) {
            return true;
          }

          return false;
        })
        .slice(0, 8)
        .map((p: any) => {
          const categoryFolder = p.categorySlug || 'rugs';
          const subtitle = p.acf?.construction 
            ? `${p.acf.construction}${p.acf.countryOfOrigin ? ` • ${p.acf.countryOfOrigin}` : ''}`
            : (p.categories?.[0]?.name || 'Luxury Handmade Rug');

          return {
            id: `prod-${p.id}`,
            title: p.name,
            subtitle,
            url: `/products/${categoryFolder}/${p.slug}`,
            type: 'product' as const,
            image: p.mainImage?.src || p.colors?.[0]?.lifestyleUrl || p.colors?.[0]?.textureUrl,
          };
        });
    }
  } catch (e) {
    // Fallback gracefully
  }

  // Search blog posts
  try {
    const posts = await getPosts();
    if (Array.isArray(posts)) {
      results.blog = posts
        .filter((post: any) => post.title?.toLowerCase().includes(q) || (post.excerpt && post.excerpt.toLowerCase().includes(q)))
        .slice(0, 4)
        .map((post: any) => ({
          id: `blog-${post.id}`,
          title: post.title,
          subtitle: post.date ? new Date(post.date).toLocaleDateString() : 'Journal Article',
          url: `/blog/${post.slug}`,
          type: 'blog' as const,
          image: post.image,
        }));
    }
  } catch (e) {
    // Fallback gracefully
  }

  return results;
}

export function findFuzzyUrlSuggestion(path: string): SearchResultItem | null {
  const cleanPath = path.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  if (!cleanPath) return null;

  const terms = cleanPath.split(/\s+/).filter(t => t.length > 2);
  if (terms.length === 0) return null;

  // Content-type hierarchical matching rule:
  // If path starts with /products, search products first, then collections
  if (path.startsWith('/products')) {
    // Check collections first
    for (const c of STATIC_COLLECTIONS) {
      if (terms.some(t => c.title.toLowerCase().includes(t))) return c;
    }
  }

  if (path.startsWith('/blog')) {
    for (const g of STATIC_GUIDES) {
      if (terms.some(t => g.title.toLowerCase().includes(t))) return g;
    }
  }

  // Fallback to Size Guide or Rugs Collection
  if (cleanPath.includes('size') || cleanPath.includes('fit') || cleanPath.includes('room')) {
    return STATIC_GUIDES[0]; // Size guide
  }
  if (cleanPath.includes('care') || cleanPath.includes('clean')) {
    return STATIC_GUIDES[1]; // Care guide
  }

  return STATIC_COLLECTIONS[0]; // Luxury Rugs default suggestion
}
