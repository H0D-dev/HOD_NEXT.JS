// ============================================================
// config.ts — All business constants and defaults
// ============================================================

import path from 'path';

export const CONFIG = {
  // Input — supports both CSV and DOCX
  DATA_DIR: path.resolve(process.cwd(), 'data'),
  DEFAULT_FILE: 'products.csv',

  // WooCommerce Defaults
  DEFAULT_STATUS: 'publish' as const,
  DEFAULT_CATALOG_VISIBILITY: 'visible' as const,
  DEFAULT_STOCK_STATUS: 'instock' as const,
  DEFAULT_CATEGORY_IDS: [16], // Rugs

  // Brand / Origin defaults
  DEFAULT_BRAND: 'House of Decor',
  DEFAULT_COUNTRY: 'India',
  DEFAULT_COLLECTION: 'Signature',

  // Product defaults (matching existing WooCommerce products)
  DEFAULT_PRODUCT_SETTINGS: {
    featured: false,
    manage_stock: false,
    reviews_allowed: true,
    virtual: false,
    downloadable: false,
  } as const,

  // Metadata keys (matching existing store patterns exactly)
  META_KEYS: {
    DESIGN_ID: 'design_id',
    ITEM_NUMBER: 'item_number',
    CONSTRUCTION: 'construction',
    COUNTRY_OF_ORIGIN: 'country_of_origin',
    PRODUCT_COLOR: 'product_color',
    MANUAL_PRICES: 'manual_prices',
    PET_FRIENDLY: 'pet_friendly',
    WASHABLE: 'washable',
    BRAND: 'brand',
  } as const,

  // Default metadata applied to every product
  DEFAULT_METADATA: {
    pet_friendly: '0',
    washable: '0',
    pile_thickness: '10',
    lead_time: '4-6 weeks',
  } as Record<string, string>,

  // ACF hidden reference keys (required for fields to show in the WP Admin backend)
  ACF_REFERENCES: {
    pile_thickness: 'field_6a5892584a07d',
    lead_time: 'field_6a5f167695e3c',
    design_id: 'field_6a41ff1610cc6',
    item_number: 'field_6a42003410cc7',
    construction: 'field_6a42004510cc8',
    country_of_origin: 'field_6a4200a010cc9',
    product_color: 'field_6a4613ea08a61',
    pet_friendly: 'field_6a4200ab10cca',
    washable: 'field_6a4200df10ccc',
    price_usd: 'field_6a60b9389e801', // Standard ACF field hashes for prices if they existed
    price_eur: 'field_6a60b9499e802',
  } as Record<string, string>,

  // Attribute names (WooCommerce global attributes)
  ATTRIBUTES: {
    SIZE: 'Size',           // variation = true
    MATERIAL: 'Material',   // visible, informational
    CONSTRUCTION: 'Construction',
    PATTERN: 'Pattern',
    SHAPE: 'Shape',
    COLOUR: 'Colour',
  } as const,

  // SKU generation
  SKU_GENERATION: {
    SEPARATOR: '-',
    // variationSku = parentSku + SEPARATOR + sizeValue
    // e.g. HOD-HTWB-BB-01-150X240
  } as const,

  // API settings
  WC_API_VERSION: 'wc/v3' as const,
  REQUEST_DELAY_MS: 300,       // Rate limiting between API calls
  MAX_RETRIES: 1,              // Retry on 5xx errors
  PER_PAGE: 100,               // WC API pagination limit
} as const;
