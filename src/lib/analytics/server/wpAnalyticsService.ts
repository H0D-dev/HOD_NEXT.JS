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
  total_preset_selections?: number;
  total_room_selects?: number;
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
  sessions: number;
  product_views?: number;
  add_to_cart?: number;
  purchases: number;
  order_ids?: number[];
  revenue?: number;
  sessions_count?: number;
  add_to_cart_count?: number;
  checkout_started_count?: number;
  purchase_count?: number;
}

export interface WpAttributionResponse {
  from: string;
  to: string;
  campaigns: WpAttributionCampaign[];
  top_referrers: Array<{ referrer: string; sessions: number }>;
  top_landing_pages: Array<{ landing_page: string; sessions: number }>;
  countries?: Array<{ country_code: string; country?: string; sessions: number }>;
  cities?: Array<{ city: string; country_code?: string; sessions: number }>;
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
   * WordPress returns: { success, data: { total_sessions, steps: [{stage, label, sessions, conversion_from_prev}], overall_conversion_rate } }
   * We normalize into WpFunnelResponse.
   */
  async getFunnel(from: string, to: string): Promise<WpFunnelResponse | null> {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/wp-json/hod/v1/analytics/funnel?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        console.warn(`[WP Analytics Service] getFunnel returned ${res.status}`);
        return null;
      }

      const raw = await res.json();

      // WordPress wraps response in { success, data: { ... } }
      const envelope = raw?.data || raw;

      // Normalize steps: WP uses {stage, label, sessions} but interface expects {step, name, count}
      const rawSteps = envelope?.steps || [];
      const steps: WpFunnelStep[] = rawSteps.map((s: any) => ({
        step: s.stage || s.step || "",
        name: s.label || s.name || "",
        count: s.sessions ?? s.count ?? 0,
        dropoff_rate: s.dropoff_rate,
        conversion_rate: s.conversion_from_prev ?? s.conversion_rate,
      }));

      // Build step_conversion map
      const stepConversion: Record<string, number> = {};
      steps.forEach((s) => {
        stepConversion[s.step] = s.conversion_rate ?? 0;
      });

      return {
        from: envelope?.from || from,
        to: envelope?.to || to,
        total_sessions: envelope?.total_sessions ?? 0,
        steps,
        step_conversion: envelope?.step_conversion || stepConversion,
      };
    } catch (error) {
      console.error("[WP Analytics Service] Error querying funnel metrics:", error);
      return null;
    }
  },

  /**
   * Queries room visualizer telemetry from WordPress (/wp-json/hod/v1/analytics/visualizer)
   * WordPress returns: { success, data: { summary: {...}, tool_usage: [...], top_visualized_products: [...] } }
   * We normalize this into WpVisualizerResponse.
   */
  async getVisualizer(from: string, to: string): Promise<WpVisualizerResponse | null> {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/wp-json/hod/v1/analytics/visualizer?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        console.warn(`[WP Analytics Service] getVisualizer returned ${res.status}`);
        return null;
      }

      const raw = await res.json();

      // WordPress wraps response in { success, data: { ... } }
      const envelope = raw?.data || raw;
      const summary = envelope?.summary || envelope;

      // Normalize tool_usage → tools_breakdown
      const toolUsage = envelope?.tool_usage || envelope?.tools_breakdown || [];
      const toolsBreakdown: WpVisualizerToolMetric[] = toolUsage.map((t: any) => ({
        tool: t.tool || t.name || "unknown",
        uses: t.count || t.uses || t.usage || 0,
      }));

      // Normalize top_visualized_products → most_visualized_products
      const topProducts = envelope?.top_visualized_products || envelope?.most_visualized_products || [];
      const mostVisualized = topProducts.map((p: any) => ({
        product_id: p.product_id || p.id || 0,
        views: p.sessions || p.views || p.count || 0,
        atc_count: p.atc_count || p.add_to_cart || p.interactions || 0,
      }));

      return {
        from: envelope?.from || from,
        to: envelope?.to || to,
        total_visualizer_sessions: summary?.visualizer_sessions ?? summary?.total_visualizer_sessions ?? 0,
        total_opens: summary?.products_loaded ?? summary?.total_opens ?? 0,
        total_room_uploads: summary?.custom_rooms_uploaded ?? summary?.total_room_uploads ?? 0,
        total_preset_selections: summary?.presets_selected ?? summary?.total_preset_selections ?? 0,
        total_room_selects: summary?.presets_selected ?? summary?.total_room_selects ?? 0,
        total_exports: summary?.exports_count ?? summary?.total_exports ?? 0,
        total_add_to_cart: summary?.visualizer_add_to_cart_count ?? summary?.total_add_to_cart ?? 0,
        tools_breakdown: toolsBreakdown,
        most_visualized_products: mostVisualized,
        assisted_orders_count: summary?.assisted_orders_count,
        assisted_order_ids: summary?.assisted_order_ids || envelope?.assisted_order_ids,
      };
    } catch (error) {
      console.error("[WP Analytics Service] Error querying visualizer metrics:", error);
      return null;
    }
  },

  /**
   * Queries user behavior (search, filters, errors) from WordPress (/wp-json/hod/v1/analytics/behavior)
   * WordPress returns: { success, data: { searches: [], filters: [], errors: [] } }
   */
  async getBehavior(from: string, to: string): Promise<WpBehaviorResponse | null> {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/wp-json/hod/v1/analytics/behavior?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        console.warn(`[WP Analytics Service] getBehavior returned ${res.status}`);
        return null;
      }

      const raw = await res.json();
      // WordPress wraps response in { success, data: { ... } }
      const envelope = raw?.data || raw;

      const rawSearches = envelope?.searches || envelope?.top_searches || [];
      const topSearches = rawSearches
        .filter((s: any) => !s.zero_results)
        .map((s: any) => ({
          query: s.query || s.term || s.search_term || "",
          count: s.count ?? s.searches ?? s.total ?? 0,
          resultCount: s.result_count ?? s.resultCount ?? 0,
        }));

      const rawZeroSearches = envelope?.zero_result_searches || envelope?.zero_searches || rawSearches.filter((s: any) => s.zero_results);
      const zeroResultSearches = rawZeroSearches.map((s: any) => ({
        query: s.query || s.term || s.search_term || "",
        count: s.count ?? s.searches ?? s.total ?? 0,
      }));

      const rawFilters = envelope?.filters || envelope?.top_filters || [];
      const topFilters = rawFilters.map((f: any) => ({
        filter_type: f.filter_type || f.type || f.category || "filter",
        filter_value: f.filter_value || f.value || f.label || "",
        count: f.count ?? f.uses ?? f.applied_count ?? 0,
      }));

      const rawErrors = envelope?.errors || envelope?.error_logs || [];
      const errorLogs = rawErrors.map((e: any) => ({
        event_name: e.event_name || e.event || "error_occurred",
        error_type: e.error_type || e.type || "general_error",
        error_message: e.error_message || e.message || e.error || "Unknown error",
        count: e.count ?? e.occurrences ?? 1,
        last_occurred: e.last_occurred || e.timestamp || new Date().toISOString(),
      }));

      return {
        from: envelope?.from || from,
        to: envelope?.to || to,
        top_searches: topSearches,
        zero_result_searches: zeroResultSearches,
        top_filters: topFilters,
        error_logs: errorLogs,
      };
    } catch (error) {
      console.error("[WP Analytics Service] Error querying behavior metrics:", error);
      return null;
    }
  },

  /**
   * Queries UTM & attribution metrics from WordPress (/wp-json/hod/v1/analytics/attribution)
   * WordPress returns: { success, data: { campaigns: [{ utm_source, utm_medium, utm_campaign, sessions, product_views, add_to_cart, purchases, order_ids }] } }
   */
  async getAttribution(from: string, to: string): Promise<WpAttributionResponse | null> {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/wp-json/hod/v1/analytics/attribution?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        console.warn(`[WP Analytics Service] getAttribution returned ${res.status}`);
        return null;
      }

      const raw = await res.json();
      // WordPress wraps response in { success, data: { ... } }
      const envelope = raw?.data || raw;

      const rawCampaigns = envelope?.campaigns || [];
      const campaigns: WpAttributionCampaign[] = rawCampaigns.map((c: any) => ({
        utm_source: c.utm_source ?? "",
        utm_medium: c.utm_medium ?? "",
        utm_campaign: c.utm_campaign ?? "",
        sessions: c.sessions ?? c.sessions_count ?? 0,
        product_views: c.product_views ?? c.views ?? 0,
        add_to_cart: c.add_to_cart ?? c.add_to_cart_count ?? 0,
        purchases: c.purchases ?? c.purchase_count ?? 0,
        order_ids: c.order_ids ?? [],
        revenue: c.revenue ?? 0,
        // Backward compatibility
        sessions_count: c.sessions ?? c.sessions_count ?? 0,
        add_to_cart_count: c.add_to_cart ?? c.add_to_cart_count ?? 0,
        purchase_count: c.purchases ?? c.purchase_count ?? 0,
      }));

      const topReferrers = envelope?.top_referrers || envelope?.referrers || [];
      const topLandingPages = envelope?.top_landing_pages || envelope?.landing_pages || [];
      const rawCountries = envelope?.countries || envelope?.top_countries || [];
      const rawCities = envelope?.cities || envelope?.top_cities || [];

      return {
        from: envelope?.from || from,
        to: envelope?.to || to,
        campaigns,
        top_referrers: topReferrers.map((r: any) => ({
          referrer: r.referrer || r.source || "Direct",
          sessions: r.sessions ?? r.count ?? 0,
        })),
        top_landing_pages: topLandingPages.map((lp: any) => ({
          landing_page: lp.landing_page || lp.page || "/",
          sessions: lp.sessions ?? lp.count ?? 0,
        })),
        countries: rawCountries.map((c: any) => ({
          country_code: c.country_code || c.code || "AE",
          country: c.country || c.name || "United Arab Emirates",
          sessions: c.sessions ?? c.count ?? 0,
        })),
        cities: rawCities.map((ct: any) => ({
          city: ct.city || ct.name || "Dubai",
          country_code: ct.country_code || ct.code || "AE",
          sessions: ct.sessions ?? ct.count ?? 0,
        })),
      };
    } catch (error) {
      console.error("[WP Analytics Service] Error querying attribution metrics:", error);
      return null;
    }
  },
};
