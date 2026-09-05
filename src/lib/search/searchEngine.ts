export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  type: 'product' | 'collection' | 'guide' | 'blog' | 'project';
  image?: string;
}

export interface CatalogSuggestionResults {
  collections: SearchResultItem[];
  guides: SearchResultItem[];
  blog: SearchResultItem[];
  projects: SearchResultItem[];
}

let cachedBlogPosts: any[] | null = null;
let blogFetchPromise: Promise<any[]> | null = null;

async function fetchBlogPosts(): Promise<any[]> {
  if (cachedBlogPosts) return cachedBlogPosts;
  if (blogFetchPromise) return blogFetchPromise;

  blogFetchPromise = (async () => {
    try {
      if (typeof window !== "undefined") {
        const res = await fetch("/api/posts");
        if (!res.ok) return [];
        const data = await res.json();
        const posts = Array.isArray(data?.posts) ? data.posts : (Array.isArray(data) ? data : []);
        cachedBlogPosts = posts;
        return posts;
      }
      const { getPosts } = await import("../../services/Posts");
      const posts = await getPosts();
      cachedBlogPosts = Array.isArray(posts) ? posts : [];
      return cachedBlogPosts;
    } catch {
      return [];
    } finally {
      blogFetchPromise = null;
    }
  })();

  return blogFetchPromise;
}

const STATIC_COLLECTIONS: SearchResultItem[] = [
  {
    id: 'col-capsule',
    title: 'The Capsule Collection',
    subtitle: 'Architectural pill-silhouette rugs in 100% hand-knotted wool',
    url: '/products/rugs?collection=the-capsule',
    type: 'collection',
    image: '/collections/capsule.webp',
  },
  {
    id: 'col-terra',
    title: 'Terra Collection',
    subtitle: 'Hand-tufted organic earth tones and textured pinstripes',
    url: '/products/rugs?collection=terra',
    type: 'collection',
    image: '/collections/terra.webp',
  },
  {
    id: 'col-chroma',
    title: 'The Chroma Edit',
    subtitle: 'Hand-knotted modern geometric designs in wool and bamboo silk',
    url: '/products/rugs?collection=the-chroma-edit',
    type: 'collection',
    image: '/collections/chroma.webp',
  },
  {
    id: 'col-bauhaus',
    title: 'Bauhaus Blend Collection',
    subtitle: 'Modernist compositions and architectural geometric rugs',
    url: '/products/rugs?collection=bauhaus-blend',
    type: 'collection',
    image: '/collections/bauhaus.webp',
  },
  {
    id: 'col-rugs',
    title: 'Handmade Luxury Rugs',
    subtitle: 'Hand-knotted & hand-tufted wool and silk rugs',
    url: '/products/rugs',
    type: 'collection',
    image: '/products_hero.webp',
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

/**
 * Search static catalog suggestions: Collections, Guides, Projects, and Blog posts.
 * Product search is now handled client-side by MiniSearch (see miniSearchIndex.ts).
 */
export async function performCatalogSuggestionSearch(query: string): Promise<CatalogSuggestionResults> {
  const q = query.trim().toLowerCase();
  const results: CatalogSuggestionResults = {
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

  // Search blog posts
  try {
    const posts = await fetchBlogPosts();
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
