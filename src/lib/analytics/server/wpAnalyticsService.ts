/**
 * Server-Side WordPress HOD Custom Analytics Client
 * Communicates with WordPress custom analytics endpoints (/wp-json/hod/v1/analytics/*)
 * using server-side Basic Auth credentials.
 */

import { API_CONFIG } from "@/src/lib/api/api";

export interface WpFunnelStep {
  step: string;
  name: string;
  count: number;
  dropoff_rate?: number;
  conversion_rate?: number;
}

export interface WpFunnelResponse {
  from: string;
  to: string;
  total_sessions: number;
  steps: WpFunnelStep[];
  step_conversion: Record<string, number>;
}

export interface WpVisualizerToolMetric {
  tool: string;
  uses: number;
}

export interface WpVisualizerResponse {
  from: string;
  to: string;
  total_visualizer_sessions: number;
  total_opens: number;
  total_room_uploads: number;
  total_exports: number;
  total_add_to_cart: number;
  tools_breakdown: WpVisualizerToolMetric[];
  most_visualized_products: Array<{
    product_id: number;
    views: number;
    atc_count: number;
  }>;
  assisted_orders_count?: number;
  assisted_order_ids?: number[];
}

export interface WpBehaviorResponse {
  from: string;
  to: string;
  top_searches: Array<{ query: string; count: number }>;
  zero_result_searches: Array<{ query: string; count: number }>;
  top_filters: Array<{ filter_type: string; filter_value: string; count: number }>;
  error_logs: Array<{
    event_name: string;
    error_type: string;
    error_message: string;
    count: number;
    last_occurred: string;
  }>;
}

export interface WpAttributionCampaign {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  sessions_count: number;
  add_to_cart_count: number;
  checkout_started_count: number;
  purchase_count: number;
  revenue?: number;
}

export interface WpAttributionResponse {
  from: string;
  to: string;
  campaigns: WpAttributionCampaign[];
  top_referrers: Array<{ referrer: string; sessions: number }>;
  top_landing_pages: Array<{ landing_page: string; sessions: number }>;
}

function getAuthHeaders(): HeadersInit {
  const { consumerKey, consumerSecret } = API_CONFIG;
  if (!consumerKey || !consumerSecret) {
    throw new Error("[WP Analytics Service] Missing WC_CONSUMER_KEY or WC_CONSUMER_SECRET");
  }
  const token = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  return {
    Authorization: `Basic ${token}`,
    Accept: "application/json",
    "User-Agent": "Next.js-WP-Analytics-Service/1.0",
  };
}

function getBaseUrl(): string {
  return (API_CONFIG.baseUrl || "https://store.houseofdecor.ae").replace(/\/$/, "");
}

export const wpAnalyticsService = {
  /**
   * Queries conversion funnel metrics from WordPress (/wp-json/hod/v1/analytics/funnel)
   */
  async getFunnel(from: string, to: string): Promise<WpFunnelResponse | null> {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/wp-json/hod/v1/analytics/funnel?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`[WP Analytics Service] getFunnel returned ${res.status}`);
        return null;
      }

      return await res.json();
    } catch (error) {
      console.error("[WP Analytics Service] Error querying funnel metrics:", error);
      return null;
    }
  },

  /**
   * Queries room visualizer telemetry from WordPress (/wp-json/hod/v1/analytics/visualizer)
   */
  async getVisualizer(from: string, to: string): Promise<WpVisualizerResponse | null> {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/wp-json/hod/v1/analytics/visualizer?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`[WP Analytics Service] getVisualizer returned ${res.status}`);
        return null;
      }

      return await res.json();
    } catch (error) {
      console.error("[WP Analytics Service] Error querying visualizer metrics:", error);
      return null;
    }
  },

  /**
   * Queries user behavior (search, filters, errors) from WordPress (/wp-json/hod/v1/analytics/behavior)
   */
  async getBehavior(from: string, to: string): Promise<WpBehaviorResponse | null> {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/wp-json/hod/v1/analytics/behavior?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`[WP Analytics Service] getBehavior returned ${res.status}`);
        return null;
      }

      return await res.json();
    } catch (error) {
      console.error("[WP Analytics Service] Error querying behavior metrics:", error);
      return null;
    }
  },

  /**
   * Queries UTM & attribution metrics from WordPress (/wp-json/hod/v1/analytics/attribution)
   */
  async getAttribution(from: string, to: string): Promise<WpAttributionResponse | null> {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/wp-json/hod/v1/analytics/attribution?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`[WP Analytics Service] getAttribution returned ${res.status}`);
        return null;
      }

      return await res.json();
    } catch (error) {
      console.error("[WP Analytics Service] Error querying attribution metrics:", error);
      return null;
    }
  },
};
