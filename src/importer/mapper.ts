// ============================================================
// mapper.ts — Two-stage data transformation
//
// Stage 1: RawProduct → NormalizedProduct (extract + clean)
// Stage 2: NormalizedProduct → WCProductPayload + WCVariationPayload[]
//
// The parser only extracts data. The mapper contains ALL
// transformation and business logic.
// ============================================================

import { CONFIG } from './config';
import type {
  RawProduct,
  NormalizedProduct,
  WCProductPayload,
  WCVariationPayload,
  WCAttributePayload,
  WCMetaData,
  SizePriceEntry,
} from './types';

// ── Stage 1: Raw → Normalized ──────────────────────────────

export function rawToNormalized(raw: RawProduct): NormalizedProduct {
  // Split colour attributes by pipe separator
  const colours = raw.colourAttributes
    ? raw.colourAttributes.split('|').map(c => c.trim()).filter(Boolean)
    : [];

  // Split tags by comma
  const tags = raw.tags
    ? raw.tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return {
    name: raw.name ? raw.name.replace(/&/g, 'and') : raw.name,
    description: raw.description,
    designId: raw.designId,
    sku: raw.sku,
    construction: raw.weavingTechnique,
    material: raw.material,
    colours,
    productColor: raw.productColor,
    shape: raw.shape,
    sizes: raw.sizes,
    pattern: raw.pattern,
    tags,
    altText: raw.altText || undefined,
    imageCaption: raw.imageCaption || undefined,
    imageDescription: raw.imageDescription || undefined,
  };
}

// ── Stage 2: Normalized → WooCommerce Payload ──────────────

export function normalizedToWCPayload(
  product: NormalizedProduct,
  tagIds: number[]
): WCProductPayload {
  const attributes = buildAttributes(product);
  const metaData = buildMetaData(product);

  return {
    name: product.name,
    type: 'variable',
    status: CONFIG.DEFAULT_STATUS,
    catalog_visibility: CONFIG.DEFAULT_CATALOG_VISIBILITY,
    description: product.description,
    sku: product.sku,
    manage_stock: CONFIG.DEFAULT_PRODUCT_SETTINGS.manage_stock,
    stock_status: CONFIG.DEFAULT_STOCK_STATUS,
    featured: CONFIG.DEFAULT_PRODUCT_SETTINGS.featured,
    reviews_allowed: CONFIG.DEFAULT_PRODUCT_SETTINGS.reviews_allowed,
    virtual: CONFIG.DEFAULT_PRODUCT_SETTINGS.virtual,
    downloadable: CONFIG.DEFAULT_PRODUCT_SETTINGS.downloadable,
    categories: CONFIG.DEFAULT_CATEGORY_IDS.map(id => ({ id })),
    tags: tagIds.length > 0 ? tagIds.map(id => ({ id })) : undefined,
    attributes,
    meta_data: metaData,
  };
}

/**
 * Build variation payloads — one per size entry.
 * Each variation gets its own price from the CSV (per-size pricing).
 */
export function buildVariationPayloads(
  product: NormalizedProduct,
  parentSku: string
): WCVariationPayload[] {
  return product.sizes.map((sizeEntry: SizePriceEntry) => {
    const variationSku = `${parentSku}${CONFIG.SKU_GENERATION.SEPARATOR}${sizeEntry.size}`;

    const metaData: WCMetaData[] = [];

    // Store USD/EUR as native ACF meta keys on each variation
    if (sizeEntry.priceUSD) {
      metaData.push({ key: 'price_usd', value: sizeEntry.priceUSD.toString() });
    }
    if (sizeEntry.priceEUR) {
      metaData.push({ key: 'price_eur', value: sizeEntry.priceEUR.toString() });
    }

    // Inject ACF Hidden Reference Keys so the data renders in the WP Admin backend UI
    const acfRefs: WCMetaData[] = [];
    for (const m of metaData) {
      if (CONFIG.ACF_REFERENCES[m.key as keyof typeof CONFIG.ACF_REFERENCES]) {
        acfRefs.push({
          key: `_${m.key}`,
          value: CONFIG.ACF_REFERENCES[m.key as keyof typeof CONFIG.ACF_REFERENCES],
        });
      }
    }

    return {
      sku: variationSku,
      regular_price: sizeEntry.priceAED.toString(),
      manage_stock: CONFIG.DEFAULT_PRODUCT_SETTINGS.manage_stock,
      stock_status: CONFIG.DEFAULT_STOCK_STATUS,
      attributes: [
        {
          name: CONFIG.ATTRIBUTES.SIZE,
          option: sizeEntry.size,
        },
      ],
      meta_data: [...metaData, ...acfRefs],
    };
  });
}

// ── Helper: Build product attributes ───────────────────────

function buildAttributes(product: NormalizedProduct): WCAttributePayload[] {
  const attrs: WCAttributePayload[] = [];
  let position = 0;

  // Size — the ONLY variation attribute
  if (product.sizes.length > 0) {
    attrs.push({
      name: CONFIG.ATTRIBUTES.SIZE,
      position: position++,
      visible: true,
      variation: true,
      options: product.sizes.map(s => s.size),
    });
  }

  // Informational attributes (visible but not for variations)
  if (product.material) {
    attrs.push({
      name: CONFIG.ATTRIBUTES.MATERIAL,
      position: position++,
      visible: true,
      variation: false,
      options: [product.material],
    });
  }

  if (product.construction) {
    attrs.push({
      name: CONFIG.ATTRIBUTES.CONSTRUCTION,
      position: position++,
      visible: true,
      variation: false,
      options: [product.construction],
    });
  }

  if (product.pattern) {
    attrs.push({
      name: CONFIG.ATTRIBUTES.PATTERN,
      position: position++,
      visible: true,
      variation: false,
      options: [product.pattern],
    });
  }

  if (product.shape) {
    attrs.push({
      name: CONFIG.ATTRIBUTES.SHAPE,
      position: position++,
      visible: true,
      variation: false,
      options: [product.shape],
    });
  }

  if (product.colours.length > 0) {
    attrs.push({
      name: CONFIG.ATTRIBUTES.COLOUR,
      position: position++,
      visible: true,
      variation: false,
      options: product.colours,
    });
  }

  return attrs;
}

// ── Helper: Build product metadata ─────────────────────────

function buildMetaData(product: NormalizedProduct): WCMetaData[] {
  const meta: WCMetaData[] = [];

  // Design ID — critical for frontend color switching
  meta.push({ key: CONFIG.META_KEYS.DESIGN_ID, value: product.designId });

  // Item number (SKU reference in metadata)
  meta.push({ key: CONFIG.META_KEYS.ITEM_NUMBER, value: product.sku });

  // Product Color — critical for frontend color grouping to distinguish siblings
  if (product.productColor) {
    meta.push({ key: CONFIG.META_KEYS.PRODUCT_COLOR, value: product.productColor });
  }

  // Construction / weaving technique
  if (product.construction) {
    meta.push({ key: CONFIG.META_KEYS.CONSTRUCTION, value: product.construction });
  }

  // Country of origin (from config default)
  meta.push({ key: CONFIG.META_KEYS.COUNTRY_OF_ORIGIN, value: CONFIG.DEFAULT_COUNTRY });

  // Brand
  meta.push({ key: CONFIG.META_KEYS.BRAND, value: CONFIG.DEFAULT_BRAND });

  // Manual prices on the parent level (using first size entry for parent price)
  if (product.sizes.length > 0) {
    const firstSize = product.sizes[0];
    if (firstSize.priceUSD) {
      meta.push({ key: 'price_usd', value: firstSize.priceUSD.toString() });
    }
    if (firstSize.priceEUR) {
      meta.push({ key: 'price_eur', value: firstSize.priceEUR.toString() });
    }
  }

  // ACF Checkboxes (1 for Yes, 0 for No)
  for (const [key, value] of Object.entries(CONFIG.DEFAULT_METADATA)) {
    meta.push({ key, value });
  }

  // Inject ACF Hidden Reference Keys so the data renders in the WP Admin backend UI
  const acfRefs: WCMetaData[] = [];
  for (const m of meta) {
    if (CONFIG.ACF_REFERENCES[m.key]) {
      acfRefs.push({
        key: `_${m.key}`,
        value: CONFIG.ACF_REFERENCES[m.key],
      });
    }
  }
  
  return [...meta, ...acfRefs];
}
