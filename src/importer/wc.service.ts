// ============================================================
// wc.service.ts — WooCommerce REST API Client
//
// ALL HTTP calls to WooCommerce live here exclusively.
// No REST calls should appear anywhere else in the importer.
// ============================================================

import { CONFIG } from './config';
import type {
  WCProduct,
  WCVariation,
  WCTag,
  WCProductPayload,
  WCVariationPayload,
} from './types';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class WooCommerceService {
  private baseUrl: string;
  private authHeader: Record<string, string>;

  constructor() {
    const wcBaseUrl = process.env.WC_BASE_URL;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!wcBaseUrl || !consumerKey || !consumerSecret) {
      throw new Error(
        'Missing WooCommerce credentials. Ensure WC_BASE_URL, WC_CONSUMER_KEY, and WC_CONSUMER_SECRET are set in .env.production'
      );
    }

    this.baseUrl = wcBaseUrl.replace(/\/$/, '');
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    this.authHeader = {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  // ── Private helpers ──────────────────────────────────────

  private url(endpoint: string): string {
    return `${this.baseUrl}/wp-json/${CONFIG.WC_API_VERSION}/${endpoint}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const fullUrl = this.url(endpoint);
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        ...this.authHeader,
        ...(options.headers || {}),
      },
    });

    const body = await res.text();

    if (!res.ok) {
      let errorMessage = `WC API Error [${res.status}]: ${res.statusText}`;
      try {
        const parsed = JSON.parse(body);
        errorMessage = `WC API Error [${res.status}]: ${parsed.message || parsed.code || res.statusText}`;
      } catch {
        // body isn't JSON
      }
      const error = new Error(errorMessage) as Error & {
        statusCode: number;
        endpoint: string;
        responseBody: string;
      };
      (error as any).statusCode = res.status;
      (error as any).endpoint = endpoint;
      (error as any).responseBody = body;
      throw error;
    }

    return JSON.parse(body) as T;
  }

  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      return await this.request<T>(endpoint, options);
    } catch (err: any) {
      // Retry once on 5xx errors
      if (err.statusCode >= 500 && CONFIG.MAX_RETRIES > 0) {
        await delay(1000);
        return await this.request<T>(endpoint, options);
      }
      throw err;
    }
  }

  // ── Products ─────────────────────────────────────────────

  async getProductBySku(sku: string): Promise<WCProduct | null> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    // Search all statuses including trash — WC keeps SKUs in lookup table even for trashed products
    const products = await this.requestWithRetry<WCProduct[]>(
      `products?sku=${encodeURIComponent(sku)}&status=any&per_page=1`
    );
    return products.length > 0 ? products[0] : null;
  }

  async getProductBySlug(slug: string): Promise<WCProduct | null> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    const products = await this.requestWithRetry<WCProduct[]>(
      `products?slug=${encodeURIComponent(slug)}&status=any&per_page=1`
    );
    return products.length > 0 ? products[0] : null;
  }

  async searchProducts(query: string): Promise<WCProduct[]> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    return this.requestWithRetry<WCProduct[]>(
      `products?search=${encodeURIComponent(query)}&per_page=${CONFIG.PER_PAGE}`
    );
  }

  async createProduct(payload: WCProductPayload): Promise<WCProduct> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    return this.requestWithRetry<WCProduct>('products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateProduct(
    id: number,
    payload: Partial<WCProductPayload>
  ): Promise<WCProduct> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    return this.requestWithRetry<WCProduct>(`products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // ── Variations ───────────────────────────────────────────

  async getVariations(productId: number): Promise<WCVariation[]> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    return this.requestWithRetry<WCVariation[]>(
      `products/${productId}/variations?per_page=${CONFIG.PER_PAGE}`
    );
  }

  async createVariation(
    productId: number,
    payload: WCVariationPayload
  ): Promise<WCVariation> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    return this.requestWithRetry<WCVariation>(
      `products/${productId}/variations`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  async updateVariation(
    productId: number,
    variationId: number,
    payload: Partial<WCVariationPayload>
  ): Promise<WCVariation> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    return this.requestWithRetry<WCVariation>(
      `products/${productId}/variations/${variationId}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  }

  // ── Tags ─────────────────────────────────────────────────

  async getTags(search?: string): Promise<WCTag[]> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    const query = search
      ? `products/tags?search=${encodeURIComponent(search)}&per_page=${CONFIG.PER_PAGE}`
      : `products/tags?per_page=${CONFIG.PER_PAGE}`;
    return this.requestWithRetry<WCTag[]>(query);
  }

  async createTag(name: string): Promise<WCTag> {
    await delay(CONFIG.REQUEST_DELAY_MS);
    return this.requestWithRetry<WCTag>('products/tags', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  /**
   * Find or create WooCommerce tags by name.
   * Returns an array of tag IDs.
   */
  async findOrCreateTags(tagNames: string[]): Promise<number[]> {
    if (tagNames.length === 0) return [];

    const tagIds: number[] = [];

    // Fetch all existing tags (paginated if needed)
    const existingTags = await this.getAllTags();
    const tagMap = new Map<string, number>();
    for (const tag of existingTags) {
      tagMap.set(tag.name.toLowerCase(), tag.id);
    }

    for (const name of tagNames) {
      const normalized = name.trim();
      if (!normalized) continue;

      const existingId = tagMap.get(normalized.toLowerCase());
      if (existingId) {
        tagIds.push(existingId);
      } else {
        try {
          const created = await this.createTag(normalized);
          tagIds.push(created.id);
          tagMap.set(normalized.toLowerCase(), created.id);
        } catch (err: any) {
          // Tag might have been created by another call — check for term_exists
          if (err.responseBody?.includes('term_exists')) {
            const searched = await this.getTags(normalized);
            const match = searched.find(
              t => t.name.toLowerCase() === normalized.toLowerCase()
            );
            if (match) {
              tagIds.push(match.id);
              tagMap.set(normalized.toLowerCase(), match.id);
            }
          }
          // Silently skip tag creation failures
        }
      }
    }

    return tagIds;
  }

  private async getAllTags(): Promise<WCTag[]> {
    const allTags: WCTag[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      await delay(CONFIG.REQUEST_DELAY_MS);
      const batch = await this.requestWithRetry<WCTag[]>(
        `products/tags?per_page=${CONFIG.PER_PAGE}&page=${page}`
      );
      allTags.push(...batch);
      hasMore = batch.length === CONFIG.PER_PAGE;
      page++;
    }

    return allTags;
  }
}
