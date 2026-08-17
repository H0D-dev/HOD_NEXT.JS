"use client";

/**
 * HOD Analytics React Hook
 * Exposes strongly-typed event dispatchers for all 33+ catalog events.
 */

import { useCallback } from "react";
import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { getActiveSessionId, trackEvent } from "./tracker";
import {
  AddToCartProperties,
  AnalyticsEventName,
  CartItemRemovedProperties,
  CartQuantityChangedProperties,
  CartViewedProperties,
  CategorySelectedProperties,
  CheckoutStartedProperties,
  ContactClickedProperties,
  ErrorEventName,
  FilterAppliedProperties,
  GenericErrorProperties,
  PaymentFailedProperties,
  PaymentMethodSelectedProperties,
  PaymentStartedProperties,
  ProductCardClickedProperties,
  ProductImageInteractedProperties,
  ProductSizeSelectedProperties,
  ProductVariantSelectedProperties,
  ProductViewedProperties,
  PurchaseCompletedProperties,
  SearchNoResultsProperties,
  SearchPerformedProperties,
  SearchResultClickedProperties,
  ShippingInfoOpenedProperties,
  SizeGuideOpenedProperties,
  SortChangedProperties,
  TrackEventOptions,
  VisualizerAddToCartProperties,
  VisualizerClosedProperties,
  VisualizerExportedProperties,
  VisualizerOpenedProperties,
  VisualizerPerspectiveAdjustedProperties,
  VisualizerProductLoadedProperties,
  VisualizerRoomSelectedProperties,
  VisualizerRoomUploadedProperties,
  VisualizerToolUsedProperties,
} from "./types";

export function useAnalytics() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || null;

  // Generic raw dispatcher
  const track = useCallback(
    (eventName: AnalyticsEventName, options?: TrackEventOptions) => {
      trackEvent(eventName, {
        userId,
        ...options,
      });
    },
    [userId]
  );

  // ── Product Events ─────────────────────────────────────────────────────────

  const trackProductView = useCallback(
    (properties: ProductViewedProperties) => {
      trackEvent("product_viewed", {
        userId,
        productId: properties.productId,
        properties,
      });
    },
    [userId]
  );

  const trackVariantSelect = useCallback(
    (properties: ProductVariantSelectedProperties) => {
      trackEvent("product_variant_selected", {
        userId,
        productId: properties.productId,
        variationId: properties.variationId,
        properties,
      });
    },
    [userId]
  );

  const trackSizeSelect = useCallback(
    (properties: ProductSizeSelectedProperties) => {
      trackEvent("product_size_selected", {
        userId,
        productId: properties.productId,
        variationId: properties.variationId,
        properties,
      });
    },
    [userId]
  );

  const trackImageInteraction = useCallback(
    (properties: ProductImageInteractedProperties) => {
      trackEvent("product_image_interacted", {
        userId,
        productId: properties.productId,
        properties,
      });
    },
    [userId]
  );

  // ── Cart Events ───────────────────────────────────────────────────────────

  const trackAddToCart = useCallback(
    (properties: AddToCartProperties) => {
      trackEvent("add_to_cart", {
        userId,
        productId: properties.productId,
        variationId: properties.variationId,
        properties,
      });
    },
    [userId]
  );

  const trackCartView = useCallback(
    (properties: CartViewedProperties) => {
      trackEvent("cart_viewed", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackCartItemRemove = useCallback(
    (properties: CartItemRemovedProperties) => {
      trackEvent("cart_item_removed", {
        userId,
        productId: properties.productId,
        variationId: properties.variationId,
        properties,
      });
    },
    [userId]
  );

  const trackCartQuantityChange = useCallback(
    (properties: CartQuantityChangedProperties) => {
      trackEvent("cart_quantity_changed", {
        userId,
        productId: properties.productId,
        variationId: properties.variationId,
        properties,
      });
    },
    [userId]
  );

  // ── Checkout Events ───────────────────────────────────────────────────────

  const trackCheckoutStart = useCallback(
    (properties: CheckoutStartedProperties) => {
      trackEvent("checkout_started", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackPaymentMethodSelect = useCallback(
    (properties: PaymentMethodSelectedProperties) => {
      trackEvent("payment_method_selected", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackPaymentStart = useCallback(
    (properties: PaymentStartedProperties) => {
      trackEvent("payment_started", {
        userId,
        orderId: properties.orderId,
        properties,
      });
    },
    [userId]
  );

  const trackPaymentFailure = useCallback(
    (properties: PaymentFailedProperties) => {
      trackEvent("payment_failed", {
        userId,
        orderId: properties.orderId,
        properties,
      });
    },
    [userId]
  );

  const trackPurchase = useCallback(
    (properties: PurchaseCompletedProperties) => {
      // Deterministic evt_order_<orderId> + immediate non-blocking delivery
      trackEvent("purchase_completed", {
        userId,
        orderId: properties.orderId,
        properties,
        immediate: true,
      });
    },
    [userId]
  );

  // ── Discovery Events ──────────────────────────────────────────────────────

  const trackSearch = useCallback(
    (properties: SearchPerformedProperties) => {
      trackEvent("search_performed", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackSearchResultClick = useCallback(
    (properties: SearchResultClickedProperties) => {
      trackEvent("search_result_clicked", {
        userId,
        productId: properties.productId,
        properties,
      });
    },
    [userId]
  );

  const trackSearchNoResults = useCallback(
    (properties: SearchNoResultsProperties) => {
      trackEvent("search_no_results", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackCategorySelect = useCallback(
    (properties: CategorySelectedProperties) => {
      trackEvent("category_selected", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackFilterApply = useCallback(
    (properties: FilterAppliedProperties) => {
      trackEvent("filter_applied", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackSortChange = useCallback(
    (properties: SortChangedProperties) => {
      trackEvent("sort_changed", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackProductCardClick = useCallback(
    (properties: ProductCardClickedProperties) => {
      trackEvent("product_card_clicked", {
        userId,
        productId: properties.productId,
        properties,
      });
    },
    [userId]
  );

  // ── Information Events ────────────────────────────────────────────────────

  const trackSizeGuideOpen = useCallback(
    (properties?: SizeGuideOpenedProperties) => {
      trackEvent("size_guide_opened", {
        userId,
        productId: properties?.productId,
        properties: properties || {},
      });
    },
    [userId]
  );

  const trackShippingInfoOpen = useCallback(
    (properties?: ShippingInfoOpenedProperties) => {
      trackEvent("shipping_info_opened", {
        userId,
        productId: properties?.productId,
        properties: properties || {},
      });
    },
    [userId]
  );

  const trackContactClick = useCallback(
    (properties: ContactClickedProperties) => {
      trackEvent("contact_clicked", {
        userId,
        properties,
      });
    },
    [userId]
  );

  // ── Room Visualizer Events ────────────────────────────────────────────────

  const trackVisualizerOpen = useCallback(
    (properties: VisualizerOpenedProperties) => {
      trackEvent("visualizer_opened", {
        userId,
        productId: properties.productId,
        properties,
      });
    },
    [userId]
  );

  const trackVisualizerProductLoad = useCallback(
    (properties: VisualizerProductLoadedProperties) => {
      trackEvent("visualizer_product_loaded", {
        userId,
        productId: properties.productId,
        properties,
      });
    },
    [userId]
  );

  const trackVisualizerRoomSelect = useCallback(
    (properties: VisualizerRoomSelectedProperties) => {
      trackEvent("visualizer_room_selected", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackVisualizerRoomUpload = useCallback(
    (properties?: VisualizerRoomUploadedProperties) => {
      trackEvent("visualizer_room_uploaded", {
        userId,
        properties: properties || {},
      });
    },
    [userId]
  );

  const trackVisualizerToolUse = useCallback(
    (properties: VisualizerToolUsedProperties) => {
      trackEvent("visualizer_tool_used", {
        userId,
        properties,
      });
    },
    [userId]
  );

  const trackVisualizerPerspectiveAdjust = useCallback(
    (properties?: VisualizerPerspectiveAdjustedProperties) => {
      trackEvent("visualizer_perspective_adjusted", {
        userId,
        productId: properties?.productId,
        properties: properties || {},
      });
    },
    [userId]
  );

  const trackVisualizerExport = useCallback(
    (properties: VisualizerExportedProperties) => {
      trackEvent("visualizer_exported", {
        userId,
        productId: properties.productId,
        properties,
      });
    },
    [userId]
  );

  const trackVisualizerAddToCart = useCallback(
    (properties: VisualizerAddToCartProperties) => {
      trackEvent("visualizer_add_to_cart", {
        userId,
        productId: properties.productId,
        variationId: properties.variationId,
        properties,
      });
    },
    [userId]
  );

  const trackVisualizerClose = useCallback(
    (properties: VisualizerClosedProperties) => {
      trackEvent("visualizer_closed", {
        userId,
        properties,
      });
    },
    [userId]
  );

  // ── Error Events ──────────────────────────────────────────────────────────

  const trackError = useCallback(
    (errorName: ErrorEventName, properties: GenericErrorProperties) => {
      trackEvent(errorName, {
        userId,
        productId: properties.productId,
        variationId: properties.variationId,
        properties,
      });
    },
    [userId]
  );

  return {
    track,
    getSessionId: getActiveSessionId,
    // Product
    trackProductView,
    trackVariantSelect,
    trackSizeSelect,
    trackImageInteraction,
    // Cart
    trackAddToCart,
    trackCartView,
    trackCartItemRemove,
    trackCartQuantityChange,
    // Checkout
    trackCheckoutStart,
    trackPaymentMethodSelect,
    trackPaymentStart,
    trackPaymentFailure,
    trackPurchase,
    // Discovery
    trackSearch,
    trackSearchResultClick,
    trackSearchNoResults,
    trackCategorySelect,
    trackFilterApply,
    trackSortChange,
    trackProductCardClick,
    // Information
    trackSizeGuideOpen,
    trackShippingInfoOpen,
    trackContactClick,
    // Room Visualizer
    trackVisualizerOpen,
    trackVisualizerProductLoad,
    trackVisualizerRoomSelect,
    trackVisualizerRoomUpload,
    trackVisualizerToolUse,
    trackVisualizerPerspectiveAdjust,
    trackVisualizerExport,
    trackVisualizerAddToCart,
    trackVisualizerClose,
    // Errors
    trackError,
  };
}
