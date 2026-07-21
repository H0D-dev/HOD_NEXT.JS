// ============================================================
// types.ts — Core type definitions for the Product Importer
// ============================================================

// === Raw CSV Types ===

/** A single row parsed from the CSV file */
export interface RawCsvRow {
  'Sr. No.'?: string;
  'Product Name'?: string;
  'Description'?: string;
  'Weaving Technique'?: string;
  'Material'?: string;
  'Colour Attributes'?: string;
  'Shape'?: string;
  'Size'?: string;
  'Price (AED)'?: string;
  'Price (USD)'?: string;
  'Price (EUR)'?: string;
  'Design ID'?: string;
  'Item Number (SKU)'?: string;
  'Pattern'?: string;
  'alt Text'?: string;
  'Image Title / Caption'?: string;
  'Image description'?: string;
  'tags'?: string;
  [key: string]: string | undefined;
}

/** A size-price entry extracted from multi-row product blocks */
export interface SizePriceEntry {
  size: string;
  priceAED: number;
  priceUSD?: number;
  priceEUR?: number;
}

/** Grouped product data after merging multi-row blocks */
export interface RawProduct {
  serialNumber: string;
  name: string;
  description: string;
  weavingTechnique: string;
  material: string;
  colourAttributes: string;
  shape: string;
  designId: string;
  sku: string;
  pattern: string;
  altText: string;
  imageCaption: string;
  imageDescription: string;
  tags: string;
  sizes: SizePriceEntry[];
}

// === Normalized Product Model ===

/** Clean, validated product model — parser output, mapper input */
export interface NormalizedProduct {
  name: string;
  description: string;
  designId: string;
  sku: string;
  construction: string;
  material: string;
  colours: string[];
  shape: string;
  sizes: SizePriceEntry[];
  pattern: string;
  tags: string[];
  altText?: string;
  imageCaption?: string;
  imageDescription?: string;
}

// === WooCommerce Payload Types ===

export interface WCMetaData {
  key: string;
  value: string;
}

export interface WCAttributePayload {
  id?: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WCProductPayload {
  name: string;
  type: 'variable';
  status: string;
  catalog_visibility: string;
  description: string;
  short_description?: string;
  sku: string;
  regular_price?: string;
  manage_stock: boolean;
  stock_status: string;
  featured: boolean;
  reviews_allowed: boolean;
  virtual: boolean;
  downloadable: boolean;
  categories: { id: number }[];
  tags?: { id: number }[];
  attributes: WCAttributePayload[];
  meta_data: WCMetaData[];
}

export interface WCVariationPayload {
  sku: string;
  regular_price: string;
  manage_stock: boolean;
  stock_status: string;
  attributes: { name: string; option: string }[];
  meta_data: WCMetaData[];
}

// === WooCommerce Response Types ===

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  type: string;
  status: string;
  permalink: string;
  meta_data: { id: number; key: string; value: any }[];
  attributes: { id: number; name: string; options: string[] }[];
  variations: number[];
}

export interface WCVariation {
  id: number;
  sku: string;
  regular_price: string;
  attributes: { id: number; name: string; option: string }[];
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WCTag {
  id: number;
  name: string;
  slug: string;
}

export interface WCAttribute {
  id: number;
  name: string;
  slug: string;
  type: string;
  has_archives: boolean;
}

export interface WCAttributeTerm {
  id: number;
  name: string;
  slug: string;
}

// === Import Result Types ===

export interface ValidationError {
  productIndex: number;
  productName?: string;
  field: string;
  message: string;
}

export interface ApiError {
  productName: string;
  endpoint: string;
  statusCode?: number;
  message: string;
}

export interface SkippedProduct {
  name: string;
  reason: string;
}

export interface ImportResult {
  productsCreated: number;
  productsUpdated: number;
  variationsCreated: number;
  variationsUpdated: number;
  skipped: SkippedProduct[];
  validationErrors: ValidationError[];
  apiErrors: ApiError[];
  executionTimeMs: number;
}
