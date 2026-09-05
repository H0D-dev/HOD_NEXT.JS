"use client";

/**
 * MiniSearch Client-Side Product Search Index
 *
 * Fetches the product catalog once from /api/products, builds a MiniSearch
 * inverted index in the browser, and exposes instant (<3ms) search with
 * typo tolerance, prefix matching, and BM25 relevance scoring.
 *
 * The index is cached as a module-level singleton and auto-refreshes
 * every 5 minutes to stay in sync with the WooCommerce catalog.
 */

import MiniSearch, { type SearchResult } from "minisearch";

/* ── Types ── */

export interface MiniSearchProduct {
  id: number;
  name: string;
  slug: string;
  categories: string;
  construction: string;
  materials: string;
  colors: string;
  description: string;
  url: string;
  image: string;
  subtitle: string;
  categorySlug: string;
}

export interface ProductSearchResult {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  type: "product";
  image?: string;
  score: number;
}

/* ── Singleton State ── */

let searchIndex: MiniSearch<MiniSearchProduct> | null = null;
let productStore: Map<number, MiniSearchProduct> = new Map();
let indexBuiltAt: number = 0;
let buildPromise: Promise<void> | null = null;

const INDEX_TTL_MS = 5 * 60 * 1000; // 5 minutes — matches API revalidate: 300

/* ── Stop words to filter from queries ── */

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "of", "in", "on", "for", "to", "is",
  "it", "by", "at", "from", "with", "as", "this", "that", "are", "was",
]);

/* ── Index Builder ── */

function createIndex(): MiniSearch<MiniSearchProduct> {
  return new MiniSearch<MiniSearchProduct>({
    fields: ["name", "categories", "construction", "materials", "colors", "description"],
    storeFields: ["name", "slug", "url", "image", "subtitle", "categorySlug"],
    searchOptions: {
      boost: {
        name: 3,
        construction: 2,
        materials: 2,
        colors: 1.5,
        categories: 1.5,
        description: 0.5,
      },
      prefix: true,
      fuzzy: (term: string) => (term.length > 4 ? 2 : 1),
      combineWith: "AND",
    },
    // Tokenizer: split on whitespace, hyphens, and special chars
    tokenize: (text: string) => {
      return text
        .toLowerCase()
        .split(/[\s\-_&/,;:()]+/)
        .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
    },
  });
}

function extractSearchableFields(product: any): MiniSearchProduct {
  const name = product.name || "";
  const slug = product.slug || "";

  // Categories
  const categories = Array.isArray(product.categories)
    ? product.categories.map((c: any) => c.name || "").join(" ")
    : "";

  const categorySlug = Array.isArray(product.categories) && product.categories.length > 0
    ? (product.categories[0]?.slug || "rugs")
    : "rugs";

  // ACF fields
  const construction = product.acf?.construction || "";
  const origin = product.acf?.countryOfOrigin || "";
  const productColor = product.acf?.productColor || "";

  // Colors from color variations
  const colors = Array.isArray(product.colors)
    ? product.colors.map((c: any) => c.name || "").join(" ")
    : productColor;

  // Attributes (sizes, materials, etc.)
  const attrs = Array.isArray(product.attributes)
    ? product.attributes
        .map((a: any) => `${a.name || ""} ${Array.isArray(a.options) ? a.options.join(" ") : ""}`)
        .join(" ")
    : "";

  // Materials — extract from construction + attributes
  const materials = [construction, attrs].filter(Boolean).join(" ");

  // Description (strip HTML tags)
  const description = (product.description || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300); // limit to avoid bloating the index

  // Image
  const image =
    product.mainImage?.src ||
    product.colors?.[0]?.lifestyleUrl ||
    product.colors?.[0]?.textureUrl ||
    "";

  // Subtitle — construction only (per user request)
  const subtitle = construction || (categories ? categories.split(" ")[0] : "Luxury Handmade");

  // URL
  const url = `/products/${categorySlug}/${slug}`;

  return {
    id: product.id,
    name,
    slug,
    categories,
    construction,
    materials,
    colors,
    description,
    url,
    image,
    subtitle,
    categorySlug,
  };
}

async function fetchAndBuildIndex(): Promise<void> {
  try {
    const res = await fetch("/api/products", {
      cache: "no-store", // Always fetch fresh from the Next.js API route (which itself is cached with revalidate: 300)
    });

    if (!res.ok) {
      console.warn("[MiniSearch] Failed to fetch product catalog:", res.status);
      return;
    }

    const data = await res.json();
    const products = data.products;

    if (!Array.isArray(products) || products.length === 0) {
      console.warn("[MiniSearch] No products returned from API");
      return;
    }

    // Build new index
    const newIndex = createIndex();
    const newStore = new Map<number, MiniSearchProduct>();

    const docs: MiniSearchProduct[] = [];
    for (const product of products) {
      const doc = extractSearchableFields(product);
      docs.push(doc);
      newStore.set(doc.id, doc);
    }

    newIndex.addAll(docs);

    // Swap in the new index atomically
    searchIndex = newIndex;
    productStore = newStore;
    indexBuiltAt = Date.now();

    console.log(
      `[MiniSearch] Index built: ${docs.length} products indexed in ${Date.now() - indexBuiltAt}ms`
    );
  } catch (err) {
    console.warn("[MiniSearch] Error building search index:", err);
  }
}

/* ── Public API ── */

/**
 * Initialize (or refresh) the search index.
 * Safe to call multiple times — deduplicates concurrent builds.
 */
export async function initSearchIndex(): Promise<void> {
  const now = Date.now();

  // Already built and still fresh
  if (searchIndex && now - indexBuiltAt < INDEX_TTL_MS) {
    return;
  }

  // Build already in progress
  if (buildPromise) {
    return buildPromise;
  }

  buildPromise = fetchAndBuildIndex().finally(() => {
    buildPromise = null;
  });

  return buildPromise;
}

/**
 * Search products using MiniSearch.
 * Returns scored results sorted by relevance.
 */
export function searchProducts(query: string): ProductSearchResult[] {
  if (!searchIndex) return [];

  const q = query.trim();
  if (!q || q.length < 2) return [];

  try {
    const results: SearchResult[] = searchIndex.search(q);

    // Also try an auto-suggest search for very short queries (1-2 words)
    // This gives better results for partial matches like "ter" → "terra"
    let autoSuggestResults: SearchResult[] = [];
    if (q.length <= 12) {
      autoSuggestResults = searchIndex.search(q, {
        prefix: true,
        fuzzy: false,
        combineWith: "OR",
      });
    }

    // Merge and deduplicate, preferring higher scores
    const scoreMap = new Map<number, SearchResult>();
    for (const r of results) {
      scoreMap.set(r.id as number, r);
    }
    for (const r of autoSuggestResults) {
      const existing = scoreMap.get(r.id as number);
      if (!existing || r.score > existing.score) {
        scoreMap.set(r.id as number, r);
      }
    }

    // Sort by score descending, limit to 8
    return Array.from(scoreMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((result) => {
        const stored = productStore.get(result.id as number);
        return {
          id: `prod-${result.id}`,
          title: stored?.name || (result as any).name || "Product",
          subtitle: stored?.subtitle || "",
          url: stored?.url || `/products/rugs/${stored?.slug || ""}`,
          type: "product" as const,
          image: stored?.image || undefined,
          score: result.score,
        };
      });
  } catch (err) {
    console.warn("[MiniSearch] Search error:", err);
    return [];
  }
}

/**
 * Check if the search index is ready (loaded and built).
 */
export function isIndexReady(): boolean {
  return searchIndex !== null;
}
