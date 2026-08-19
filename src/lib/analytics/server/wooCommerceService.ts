/**
 * Server-Side WooCommerce Analytics Client
 * Communicates directly with WooCommerce REST APIs using secure server-side credentials.
 */

import { API_CONFIG } from "@/src/lib/api/api";

export interface WcSalesReportItem {
  total_sales: string;
  net_sales: string;
  average_sales: string;
  total_orders: number;
  total_items: number;
  total_tax: string;
  total_shipping: string;
  total_discount: string;
  totals_grouped_by: string;
  totals: Record<
    string,
    {
      sales: string;
      orders: number;
      items: number;
      tax: string;
      shipping: string;
      discount: string;
      customers: number;
    }
  >;
}

export interface WcTopSellerItem {
  title: string;
  product_id: number;
  quantity: number;
}

export interface WcOrderLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  subtotal: string;
  total: string;
  sku?: string;
  price: number;
  meta_data?: Array<{ key: string; value: any }>;
}

export interface WcOrder {
  id: number;
  status: string;
  currency: string;
  date_created: string;
  date_modified: string;
  discount_total: string;
  shipping_total: string;
  total: string;
  total_tax: string;
  customer_id: number;
  payment_method: string;
  payment_method_title: string;
  line_items: WcOrderLineItem[];
  billing: {
    first_name: string;
    last_name: string;
    city: string;
    country: string;
    email: string;
  };
}

export interface WcProduct {
  id: number;
  name: string;
  slug: string;
  type: string;
  status: string;
  price: string;
  regular_price: string;
  sale_price: string;
  total_sales: number;
  stock_status: string;
  stock_quantity: number | null;
  categories: Array<{ id: number; name: string; slug: string }>;
  images: Array<{ id: number; src: string; name: string }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  variations: number[];
}

export interface WcCustomer {
  id: number;
  date_created: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  orders_count: number;
  total_spent: string;
  avatar_url: string;
}

function getAuthHeaders(): HeadersInit {
  const { consumerKey, consumerSecret } = API_CONFIG;
  if (!consumerKey || !consumerSecret) {
    throw new Error("[WooCommerce Service] Missing WC_CONSUMER_KEY or WC_CONSUMER_SECRET");
  }
  const token = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  return {
    Authorization: `Basic ${token}`,
    Accept: "application/json",
    "User-Agent": "Next.js-Analytics-Query-Layer/1.0",
  };
}

function getBaseUrl(): string {
  return (API_CONFIG.baseUrl || "https://store.houseofdecor.ae").replace(/\/$/, "");
}

export const wooCommerceService = {
  /**
   * Fetches sales reports summary from WooCommerce (/wp-json/wc/v3/reports/sales)
   */
  async getSalesReport(params: {
    date_min?: string;
    date_max?: string;
  }): Promise<WcSalesReportItem[]> {
    try {
      const baseUrl = getBaseUrl();
      const searchParams = new URLSearchParams();
      if (params.date_min) searchParams.set("date_min", params.date_min);
      if (params.date_max) searchParams.set("date_max", params.date_max);

      const url = `${baseUrl}/wp-json/wc/v3/reports/sales?${searchParams.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`[WooCommerce Service] getSalesReport failed: ${res.status} ${res.statusText}`);
        return [];
      }

      return await res.json();
    } catch (error) {
      console.error("[WooCommerce Service] Error fetching sales report:", error);
      return [];
    }
  },

  /**
   * Fetches top selling products report (/wp-json/wc/v3/reports/top_sellers)
   */
  async getTopSellers(params: {
    date_min?: string;
    date_max?: string;
    period?: string;
  }): Promise<WcTopSellerItem[]> {
    try {
      const baseUrl = getBaseUrl();
      const searchParams = new URLSearchParams();
      if (params.date_min) searchParams.set("date_min", params.date_min);
      if (params.date_max) searchParams.set("date_max", params.date_max);
      if (params.period) searchParams.set("period", params.period);

      const url = `${baseUrl}/wp-json/wc/v3/reports/top_sellers?${searchParams.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`[WooCommerce Service] getTopSellers failed: ${res.status}`);
        return [];
      }

      return await res.json();
    } catch (error) {
      console.error("[WooCommerce Service] Error fetching top sellers:", error);
      return [];
    }
  },

  /**
   * Fetches orders with optional filtering (/wp-json/wc/v3/orders)
   */
  async getOrders(params: {
    after?: string;
    before?: string;
    status?: string;
    per_page?: number;
    page?: number;
  }): Promise<WcOrder[]> {
    try {
      const baseUrl = getBaseUrl();
      const searchParams = new URLSearchParams();
      if (params.after) {
        const afterIso = params.after.includes("T")
          ? new Date(params.after).toISOString()
          : new Date(params.after + "T00:00:00.000Z").toISOString();
        searchParams.set("after", afterIso);
      }
      if (params.before) {
        const beforeIso = params.before.includes("T")
          ? new Date(params.before).toISOString()
          : new Date(params.before + "T23:59:59.999Z").toISOString();
        searchParams.set("before", beforeIso);
      }
      if (params.status) searchParams.set("status", params.status);
      searchParams.set("per_page", String(params.per_page || 100));
      searchParams.set("page", String(params.page || 1));

      const url = `${baseUrl}/wp-json/wc/v3/orders?${searchParams.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`[WooCommerce Service] getOrders failed: ${res.status}`);
        return [];
      }

      return await res.json();
    } catch (error) {
      console.error("[WooCommerce Service] Error fetching orders:", error);
      return [];
    }
  },

  /**
   * Fetches product catalog details (/wp-json/wc/v3/products)
   */
  async getProducts(params: {
    per_page?: number;
    page?: number;
    status?: string;
  }): Promise<WcProduct[]> {
    try {
      const baseUrl = getBaseUrl();
      const searchParams = new URLSearchParams();
      searchParams.set("per_page", String(params.per_page || 100));
      searchParams.set("page", String(params.page || 1));
      if (params.status) searchParams.set("status", params.status);

      const url = `${baseUrl}/wp-json/wc/v3/products?${searchParams.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        console.warn(`[WooCommerce Service] getProducts failed: ${res.status}`);
        return [];
      }

      return await res.json();
    } catch (error) {
      console.error("[WooCommerce Service] Error fetching products:", error);
      return [];
    }
  },

  /**
   * Fetches customer list (/wp-json/wc/v3/customers)
   */
  async getCustomers(params: {
    per_page?: number;
    page?: number;
    role?: string;
  }): Promise<WcCustomer[]> {
    try {
      const baseUrl = getBaseUrl();
      const searchParams = new URLSearchParams();
      searchParams.set("per_page", String(params.per_page || 100));
      searchParams.set("page", String(params.page || 1));
      if (params.role) searchParams.set("role", params.role);

      const url = `${baseUrl}/wp-json/wc/v3/customers?${searchParams.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        console.warn(`[WooCommerce Service] getCustomers failed: ${res.status}`);
        return [];
      }

      return await res.json();
    } catch (error) {
      console.error("[WooCommerce Service] Error fetching customers:", error);
      return [];
    }
  },

  /**
   * Fetches single order by ID
   */
  async getOrder(orderId: number): Promise<WcOrder | null> {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/wp-json/wc/v3/orders/${orderId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        next: { revalidate: 60 },
      });

      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error(`[WooCommerce Service] Error fetching order ${orderId}:`, error);
      return null;
    }
  },
};
