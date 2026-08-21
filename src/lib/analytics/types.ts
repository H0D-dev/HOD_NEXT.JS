/**
 * HOD Analytics Type Definitions
 * Source of Truth: HOD Analytics Master Implementation Plan & Specification
 */

// ── Approved 33+ Event Catalog ────────────────────────────────────────────────

export type ProductEventName =
  | "product_viewed"
  | "product_variant_selected"
  | "product_size_selected"
  | "product_image_interacted";

export type CartEventName =
  | "add_to_cart"
  | "cart_viewed"
  | "cart_item_removed"
  | "cart_quantity_changed";

export type CheckoutEventName =
  | "checkout_started"
  | "payment_method_selected"
  | "payment_started"
  | "payment_failed"
  | "purchase_completed";

export type DiscoveryEventName =
  | "search_performed"
  | "search_result_clicked"
  | "search_no_results"
  | "category_selected"
  | "filter_applied"
  | "sort_changed"
  | "product_card_clicked";

export type InfoEventName =
  | "size_guide_opened"
  | "shipping_info_opened"
  | "contact_clicked";

export type VisualizerEventName =
  | "visualizer_opened"
  | "visualizer_product_loaded"
  | "visualizer_room_selected"
  | "visualizer_room_uploaded"
  | "visualizer_tool_used"
  | "visualizer_perspective_adjusted"
  | "visualizer_exported"
  | "visualizer_add_to_cart"
  | "visualizer_closed";

export type ErrorEventName =
  | "product_load_failed"
  | "add_to_cart_failed"
  | "checkout_failed"
  | "payment_failed"
  | "visualizer_load_failed"
  | "visualizer_export_failed"
  | "image_load_failed";

export type AnalyticsEventName =
  | ProductEventName
  | CartEventName
  | CheckoutEventName
  | DiscoveryEventName
  | InfoEventName
  | VisualizerEventName
  | ErrorEventName;

// ── Session & Payload Interfaces ──────────────────────────────────────────────

export interface AnalyticsSession {
  session_id: string;
  user_id?: number | null;
  started_at: string;
  last_seen_at: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  referrer?: string | null;
  referrer_domain?: string | null;
  channel?: string | null;
  landing_page?: string | null;
  country_code?: string | null;
  country_name?: string | null;
  city?: string | null;
  region?: string | null;
}

export interface RawAnalyticsEvent {
  event_id: string;
  event_name: AnalyticsEventName;
  session_id: string;
  user_id?: number | null;
  product_id?: number | null;
  variation_id?: number | null;
  order_id?: number | null;
  page: string;
  created_at: string;
  properties?: Record<string, unknown>;
}

export interface AnalyticsBatchPayload {
  session: AnalyticsSession;
  events: RawAnalyticsEvent[];
}

// ── Specific Event Property Interfaces ────────────────────────────────────────

// Product
export interface ProductViewedProperties {
  productId: number;
  slug?: string;
  name?: string;
  category?: string;
  price?: number;
  currency?: string;
  color?: string;
  size?: string;
  material?: string;
  [key: string]: unknown;
}

export interface ProductVariantSelectedProperties {
  productId: number;
  variationId?: number;
  variantType: "color" | "material" | "style" | "size" | string;
  variantValue: string;
  price?: number;
  [key: string]: unknown;
}

export interface ProductSizeSelectedProperties {
  productId: number;
  variationId?: number;
  size: string;
  price?: number;
  [key: string]: unknown;
}

export interface ProductImageInteractedProperties {
  productId: number;
  interactionType: "thumbnail_click" | "zoom" | "swipe" | "gallery_arrow";
  imageIndex?: number;
  imageUrl?: string;
  [key: string]: unknown;
}

// Cart
export interface AddToCartProperties {
  productId: number;
  variationId?: number;
  name?: string;
  price: number;
  currency: string;
  quantity: number;
  color?: string;
  size?: string;
  source?: "pdp" | "catalog" | "room_visualizer" | "search";
  [key: string]: unknown;
}

export interface CartViewedProperties {
  itemCount: number;
  subtotal: number;
  currency: string;
  items?: Array<{
    productId: number;
    variationId?: number;
    quantity: number;
    price: number;
  }>;
  [key: string]: unknown;
}

export interface CartItemRemovedProperties {
  productId: number;
  variationId?: number;
  quantity: number;
  price: number;
  currency: string;
  [key: string]: unknown;
}

export interface CartQuantityChangedProperties {
  productId: number;
  variationId?: number;
  oldQuantity: number;
  newQuantity: number;
  price: number;
  currency: string;
  [key: string]: unknown;
}

// Checkout
export interface CheckoutStartedProperties {
  itemCount: number;
  subtotal: number;
  currency: string;
  couponApplied?: boolean;
  couponCode?: string;
  [key: string]: unknown;
}

export interface PaymentMethodSelectedProperties {
  paymentMethod: "stripe" | "tabby" | "cod" | "bank_transfer" | string;
  currency: string;
  amount: number;
  [key: string]: unknown;
}

export interface PaymentStartedProperties {
  orderId?: number;
  paymentMethod: string;
  currency: string;
  amount: number;
  [key: string]: unknown;
}

export interface PaymentFailedProperties {
  orderId?: number;
  paymentMethod: string;
  errorCode?: string;
  errorMessage?: string;
  amount?: number;
  currency?: string;
  [key: string]: unknown;
}

export interface PurchaseCompletedProperties {
  orderId: number;
  subtotal: number;
  total: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  currency: string;
  paymentMethod: string;
  itemCount: number;
  items: Array<{
    productId: number;
    variationId?: number;
    name?: string;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
  }>;
  isVisualizerAssisted?: boolean;
  [key: string]: unknown;
}

// Discovery
export interface SearchPerformedProperties {
  query: string;
  resultCount: number;
  filtersActive?: boolean;
  [key: string]: unknown;
}

export interface SearchResultClickedProperties {
  query: string;
  productId: number;
  position: number;
  resultCount: number;
  [key: string]: unknown;
}

export interface SearchNoResultsProperties {
  query: string;
  [key: string]: unknown;
}

export interface CategorySelectedProperties {
  categorySlug: string;
  categoryName?: string;
  [key: string]: unknown;
}

export interface FilterAppliedProperties {
  filterType: "category" | "color" | "material" | "size" | "price" | "shape" | string;
  filterValue: string | number | [number, number];
  [key: string]: unknown;
}

export interface SortChangedProperties {
  sortOption: "price_asc" | "price_desc" | "popularity" | "date" | "rating" | string;
  category?: string;
  [key: string]: unknown;
}

export interface ProductCardClickedProperties {
  productId: number;
  slug: string;
  position?: number;
  category?: string;
  source: "catalog_grid" | "featured_slider" | "search_results" | "related_products";
  [key: string]: unknown;
}

// Information
export interface SizeGuideOpenedProperties {
  productId?: number;
  category?: string;
  [key: string]: unknown;
}

export interface ShippingInfoOpenedProperties {
  productId?: number;
  [key: string]: unknown;
}

export interface ContactClickedProperties {
  source: "pdp" | "header" | "footer" | "trade_program";
  channel: "whatsapp" | "email" | "phone" | "form";
  [key: string]: unknown;
}

// Room Visualizer
export interface VisualizerOpenedProperties {
  productId?: number;
  source: "pdp_button" | "header_nav" | "catalog_action";
  [key: string]: unknown;
}

export interface VisualizerProductLoadedProperties {
  productId: number;
  productName?: string;
  size?: { width: number; height: number } | string;
  [key: string]: unknown;
}

export interface VisualizerRoomSelectedProperties {
  roomType: "sample" | "preset";
  roomName: string;
  [key: string]: unknown;
}

export interface VisualizerRoomUploadedProperties {
  fileSize?: number;
  fileType?: string;
  [key: string]: unknown;
}

export interface VisualizerToolUsedProperties {
  tool: "corners" | "floorTexture" | "brush" | "box" | "eraser" | "wand" | "beforeAfter" | "brightness" | "shadow";
  actionDetails?: string;
  [key: string]: unknown;
}

export interface VisualizerPerspectiveAdjustedProperties {
  productId?: number;
  tool: "corners" | "transform";
  [key: string]: unknown;
}

export interface VisualizerExportedProperties {
  productId?: number;
  exportFormat: "image/png" | "image/jpeg" | "share";
  durationSeconds?: number;
  [key: string]: unknown;
}

export interface VisualizerAddToCartProperties {
  productId: number;
  variationId?: number;
  size?: string;
  price?: number;
  currency?: string;
  [key: string]: unknown;
}

export interface VisualizerClosedProperties {
  durationSeconds: number;
  productsViewedCount: number;
  toolsUsedCount: number;
  [key: string]: unknown;
}

// Error Properties
export interface GenericErrorProperties {
  errorType?: string;
  errorMessage: string;
  errorCode?: string | number;
  component?: string;
  productId?: number;
  variationId?: number;
  [key: string]: unknown;
}

// ── Generic Event Options ─────────────────────────────────────────────────────

export interface TrackEventOptions {
  userId?: number | null;
  productId?: number | null;
  variationId?: number | null;
  orderId?: number | null;
  page?: string;
  properties?: Record<string, unknown>;
  /**
   * If true, sends event immediately bypassing debounce/queue.
   * Useful for purchase_completed or beforeUnload scenarios.
   */
  immediate?: boolean;
}

// ── Geography & Attribution Analytics Data Contracts ─────────────────────────

export interface CountryMetric {
  code: string;
  country: string;
  flag: string;
  sessions: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  sharePercentage: number;
}

export interface CityMetric {
  city: string;
  countryCode: string;
  country: string;
  flag: string;
  sessions: number;
  orders: number;
  revenue: number;
  sharePercentage: number;
}

export interface TrafficChannelMetric {
  channel: string;
  sessions: number;
  productViews: number;
  addToCart: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  sharePercentage: number;
}

export interface ReferrerMetric {
  referrer: string;
  domain: string;
  channel: string;
  sessions: number;
  purchases: number;
  revenue: number;
  sharePercentage: number;
}

export interface UtmSourceMetric {
  source: string;
  sessions: number;
  productViews: number;
  addToCart: number;
  purchases: number;
  revenue: number;
}

export interface UtmCampaignMetric {
  campaign: string;
  sessions: number;
  purchases: number;
  revenue: number;
}

export interface AttributionAnalyticsData {
  countries: CountryMetric[];
  cities: CityMetric[];
  channels: TrafficChannelMetric[];
  referrers: ReferrerMetric[];
  utmSources: UtmSourceMetric[];
  utmCampaigns: UtmCampaignMetric[];
  topLandingPages: Array<{ landing_page: string; sessions: number }>;
  summary: {
    topCountry: string;
    topCountryFlag: string;
    topChannel: string;
    inboundTrafficRatio: number;
    totalTrackedSessions: number;
    totalAttributedRevenue: number;
  };
  meta?: { from: string; to: string };
}

