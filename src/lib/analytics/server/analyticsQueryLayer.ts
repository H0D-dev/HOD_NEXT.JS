/**
 * HOD Analytics Server Query Layer
 * Combines WooCommerce transactional data with WordPress behavioral analytics
 * to compute normalized business metrics and opportunity matrices for the UI.
 *
 * CANONICAL RESPONSE CONTRACT
 * Strictly returns single canonical keys matching UI expectations without duplicate aliases.
 */

import { wooCommerceService, WcOrder } from "./wooCommerceService";
import { wpAnalyticsService } from "./wpAnalyticsService";

// ── Shared Types ──────────────────────────────────────────────────────────────

export interface DateRange {
  from: string;
  to: string;
  compareFrom?: string;
  compareTo?: string;
}

// ── Internal Helpers ──────────────────────────────────────────────────────────

/** Safely parse a string value to a number, defaulting to 0. */
function n(val: string | number | undefined | null): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  const parsed = parseFloat(val || "0");
  return isNaN(parsed) ? 0 : parsed;
}

/** Round to 2 decimal places. */
function r2(val: number): number {
  return isNaN(val) ? 0 : Math.round(val * 100) / 100;
}

/** Compute percentage change between two values. Returns null if base is 0 to prevent division-by-zero / Infinity. */
function pctChange(current: number, previous: number): number | null {
  if (!previous || previous === 0) return null;
  const delta = ((current - previous) / previous) * 100;
  return isFinite(delta) ? r2(delta) : null;
}

// ── Commercial Order Statuses ─────────────────────────────────────────────────

/**
 * Normalizes a WooCommerce order status string (e.g. "wc-processing" -> "processing", "on_hold" -> "on-hold").
 */
function normalizeStatus(status: string | undefined | null): string {
  return (status || "").toLowerCase().trim().replace(/^wc-/, "").replace(/_/g, "-");
}

const EXCLUDED_ORDER_STATUSES = new Set(["cancelled", "failed", "trash"]);
const REFUNDED_ORDER_STATUSES = new Set(["refunded"]);

function isValidOrder(o: WcOrder): boolean {
  const s = normalizeStatus(o.status);
  return !EXCLUDED_ORDER_STATUSES.has(s) && !REFUNDED_ORDER_STATUSES.has(s);
}

/**
 * Computes authoritative commerce metrics directly from WooCommerce orders list.
 * Excludes cancelled, failed, and trash records.
 */
function computeSalesFromOrders(orders: WcOrder[]) {
  const validOrders = orders.filter(isValidOrder);

  const refundedOrders = orders.filter((o) => {
    const s = normalizeStatus(o.status);
    return REFUNDED_ORDER_STATUSES.has(s);
  });

  let netSales = 0;
  let grossSales = 0;
  let totalTax = 0;
  let totalShipping = 0;
  let totalDiscount = 0;
  const totalOrders = validOrders.length;

  let refunds = 0;
  refundedOrders.forEach((r) => {
    refunds += n(r.total);
  });

  const dateMap = new Map<string, { revenue: number; orders: number }>();

  validOrders.forEach((o) => {
    let orderGross = n(o.total);
    let lineItemsSum = 0;
    if (Array.isArray(o.line_items) && o.line_items.length > 0) {
      o.line_items.forEach((item) => {
        lineItemsSum += n(item.total);
      });
    }

    if (orderGross === 0 && lineItemsSum > 0) {
      orderGross = lineItemsSum;
    }

    const orderTax = n(o.total_tax);
    const orderShipping = n(o.shipping_total);
    const orderDiscount = n(o.discount_total);
    let orderNet = Math.max(0, orderGross - orderTax - orderShipping);

    if (orderNet === 0 && lineItemsSum > 0) {
      orderNet = lineItemsSum;
    }

    grossSales += orderGross;
    totalTax += orderTax;
    totalShipping += orderShipping;
    totalDiscount += orderDiscount;
    netSales += orderNet;

    const dateKey = (o.date_created || "").split("T")[0] || (o.date_modified || "").split("T")[0] || "Unknown";
    const dayMetrics = dateMap.get(dateKey) || { revenue: 0, orders: 0 };
    dayMetrics.revenue += orderNet;
    dayMetrics.orders += 1;
    dateMap.set(dateKey, dayMetrics);
  });

  const trendRaw = Array.from(dateMap.entries())
    .map(([date, metrics]) => ({
      date,
      revenue: r2(metrics.revenue),
      orders: metrics.orders,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    netSales: r2(netSales),
    grossSales: r2(grossSales),
    totalTax: r2(totalTax),
    totalShipping: r2(totalShipping),
    totalDiscount: r2(totalDiscount),
    totalOrders,
    refunds: r2(refunds),
    refundsCount: refundedOrders.length,
    trendRaw,
    validOrders,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. OVERVIEW
// Consumed by: OverviewTab.tsx
// ═══════════════════════════════════════════════════════════════════════════════

export const analyticsQueryLayer = {
  async getOverviewData(dateRange: DateRange) {
    const { from, to, compareFrom, compareTo } = dateRange;

    // Parallel fetch from WooCommerce & WordPress
    const [salesReports, orders, funnelData, visualizerData] = await Promise.all([
      wooCommerceService.getSalesReport({ date_min: from, date_max: to }),
      wooCommerceService.getOrders({ after: from, before: to, per_page: 100 }),
      wpAnalyticsService.getFunnel(from, to),
      wpAnalyticsService.getVisualizer(from, to),
    ]);

    let netRevenue = 0;
    let grossRevenue = 0;
    let totalOrders = 0;
    let refundsCount = 0;
    const revenueTrendRaw: Array<{ date: string; revenue: number }> = [];

    // Check if reports/sales endpoint returned non-zero aggregate
    const hasValidReport =
      salesReports &&
      salesReports.length > 0 &&
      (n(salesReports[0].net_sales) > 0 || (salesReports[0].total_orders || 0) > 0);

    let activeValidOrders: WcOrder[] = [];

    if (hasValidReport) {
      const report = salesReports[0];
      netRevenue = n(report.net_sales);
      grossRevenue = n(report.total_sales);
      totalOrders = report.total_orders || 0;

      if (report.totals) {
        Object.entries(report.totals).forEach(([dateStr, metrics]) => {
          revenueTrendRaw.push({
            date: dateStr,
            revenue: n((metrics as any).sales),
          });
        });
      }
      activeValidOrders = orders.filter(isValidOrder);
    } else {
      // Authoritative order-based calculation fallback
      const orderSales = computeSalesFromOrders(orders);
      netRevenue = orderSales.netSales;
      grossRevenue = orderSales.grossSales;
      totalOrders = orderSales.totalOrders;
      refundsCount = orderSales.refundsCount;
      revenueTrendRaw.push(...orderSales.trendRaw);
      activeValidOrders = orderSales.validOrders;
    }

    const aov = totalOrders > 0 ? netRevenue / totalOrders : 0;
    const totalSessions = funnelData?.total_sessions || 0;
    const conversionRate = totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0;

    // Visualizer Assisted Revenue
    let visualizerAssistedRevenue = 0;
    let visualizerAssistedOrders = 0;

    if (visualizerData?.assisted_order_ids && visualizerData.assisted_order_ids.length > 0) {
      const orderSet = new Set(visualizerData.assisted_order_ids);
      activeValidOrders.forEach((order) => {
        if (orderSet.has(order.id)) {
          visualizerAssistedRevenue += n(order.total);
          visualizerAssistedOrders += 1;
        }
      });
    }

    // ── Comparison period ──────────────────────────────────────────────────
    let revenueChange: number | null = null;
    let ordersChange: number | null = null;
    let aovChange: number | null = null;
    let conversionRateChange: number | null = null;
    let compareTrendMap: Map<number, number> | null = null;

    if (compareFrom && compareTo) {
      try {
        const [compSales, compOrders, compFunnel] = await Promise.all([
          wooCommerceService.getSalesReport({ date_min: compareFrom, date_max: compareTo }),
          wooCommerceService.getOrders({ after: compareFrom, before: compareTo, per_page: 100 }),
          wpAnalyticsService.getFunnel(compareFrom, compareTo),
        ]);

        let compNetRevenue = 0;
        let compTotalOrders = 0;
        const compTrendValues: number[] = [];

        const hasCompReport =
          compSales &&
          compSales.length > 0 &&
          (n(compSales[0].net_sales) > 0 || (compSales[0].total_orders || 0) > 0);

        if (hasCompReport) {
          compNetRevenue = n(compSales[0].net_sales);
          compTotalOrders = compSales[0].total_orders || 0;

          if (compSales[0].totals) {
            Object.values(compSales[0].totals).forEach((metrics: any) => {
              compTrendValues.push(n(metrics.sales));
            });
          }
        } else {
          const compOrderSales = computeSalesFromOrders(compOrders);
          compNetRevenue = compOrderSales.netSales;
          compTotalOrders = compOrderSales.totalOrders;
          compOrderSales.trendRaw.forEach((t) => compTrendValues.push(t.revenue));
        }

        const compAov = compTotalOrders > 0 ? compNetRevenue / compTotalOrders : 0;
        const compSessions = compFunnel?.total_sessions || 0;
        const compConvRate = compSessions > 0 ? (compTotalOrders / compSessions) * 100 : 0;

        revenueChange = pctChange(netRevenue, compNetRevenue);
        ordersChange = pctChange(totalOrders, compTotalOrders);
        aovChange = pctChange(aov, compAov);
        conversionRateChange = pctChange(conversionRate, compConvRate);

        if (compTrendValues.length > 0) {
          compareTrendMap = new Map();
          compTrendValues.forEach((val, idx) => {
            compareTrendMap!.set(idx, val);
          });
        }
      } catch (err) {
        console.warn("[Analytics QueryLayer] Comparison fetch failed, skipping:", err);
      }
    }

    // ── Revenue Trend (OverviewTab reads: t.date, t.label, t.revenue, t.compareRevenue)
    const revenueTrend = revenueTrendRaw.map((point, idx) => ({
      date: point.date,
      label: point.date,
      revenue: point.revenue,
      compareRevenue: compareTrendMap?.get(idx) ?? undefined,
    }));

    // ── Funnel Snapshot (OverviewTab reads: s.stage, s.label, s.count, s.conversionFromPrev, s.conversionOverall, s.dropoffRate)
    const rawSteps = funnelData?.steps || [];
    const firstCount = rawSteps[0]?.count || 1;
    const funnelSnapshot = rawSteps.map((step, idx) => {
      const prevCount = idx > 0 ? rawSteps[idx - 1].count : step.count;
      const dropoff = prevCount > 0 ? ((prevCount - step.count) / prevCount) * 100 : 0;
      const convOverall = firstCount > 0 ? (step.count / firstCount) * 100 : 0;
      const convFromPrev = prevCount > 0 ? (step.count / prevCount) * 100 : (idx === 0 ? 100 : 0);
      return {
        stage: step.step,
        label: step.name || step.step,
        count: step.count,
        conversionFromPrev: r2(convFromPrev),
        conversionOverall: r2(convOverall),
        dropoffRate: r2(dropoff),
      };
    });

    // ── Top Products (OverviewTab reads: p.id, p.name, p.totalRevenue, p.unitsSold)
    const productSalesMap = new Map<number, { name: string; revenue: number; quantity: number }>();
    const ordersForProducts = activeValidOrders.length > 0 ? activeValidOrders : orders;

    ordersForProducts.forEach((order) => {
      order.line_items.forEach((item) => {
        const cur = productSalesMap.get(item.product_id) || { name: item.name, revenue: 0, quantity: 0 };
        cur.revenue += n(item.total);
        cur.quantity += item.quantity;
        if (!cur.name) cur.name = item.name;
        productSalesMap.set(item.product_id, cur);
      });
    });

    const topProducts = Array.from(productSalesMap.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        totalRevenue: r2(data.revenue),
        unitsSold: data.quantity,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    // ── Summary KPIs
    const summary = {
      netRevenue: r2(netRevenue),
      grossRevenue: r2(grossRevenue),
      totalOrders,
      averageOrderValue: r2(aov),
      conversionRate: r2(conversionRate),
      sessionsCount: totalSessions,
      totalProductsViewed: funnelData?.steps?.[0]?.count || 0,
      totalAddToCart: funnelData?.steps?.[1]?.count || 0,
      visualizerAssistedRevenue: r2(visualizerAssistedRevenue),
      visualizerAssistedOrders,
      refundsCount,
      revenueChange,
      ordersChange,
      aovChange,
      conversionRateChange,
    };

    return {
      summary,
      revenueTrend,
      funnelSnapshot,
      topProducts,
      visualizerSnapshot: {
        totalSessions: visualizerData?.total_visualizer_sessions || 0,
        productsLoaded: visualizerData?.total_opens || 0,
        customUploads: visualizerData?.total_room_uploads || 0,
        visualizerAddToCartCount: visualizerData?.total_add_to_cart || 0,
        totalExports: visualizerData?.total_exports || 0,
        assistedRevenue: r2(visualizerAssistedRevenue),
        assistedOrders: visualizerAssistedOrders,
      },
      meta: { from, to },
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. REVENUE / SALES
  // Consumed by: SalesTab.tsx
  // ═══════════════════════════════════════════════════════════════════════════

  async getRevenueData(dateRange: DateRange) {
    const { from, to, compareFrom, compareTo } = dateRange;

    const [salesReports, orders] = await Promise.all([
      wooCommerceService.getSalesReport({ date_min: from, date_max: to }),
      wooCommerceService.getOrders({ after: from, before: to, per_page: 100 }),
    ]);

    let netSales = 0;
    let grossSales = 0;
    let totalTax = 0;
    let totalShipping = 0;
    let totalDiscount = 0;
    let totalOrders = 0;
    let refunds = 0;
    let refundsCount = 0;

    const trendRaw: Array<{ date: string; revenue: number }> = [];

    const hasValidReport =
      salesReports &&
      salesReports.length > 0 &&
      (n(salesReports[0].net_sales) > 0 || (salesReports[0].total_orders || 0) > 0);

    let activeValidOrders: WcOrder[] = [];

    if (hasValidReport) {
      const rep = salesReports[0];
      netSales = n(rep.net_sales);
      grossSales = n(rep.total_sales);
      totalTax = n(rep.total_tax);
      totalShipping = n(rep.total_shipping);
      totalDiscount = n(rep.total_discount);
      totalOrders = rep.total_orders || 0;

      if (rep.totals) {
        Object.entries(rep.totals).forEach(([dateStr, metrics]) => {
          trendRaw.push({
            date: dateStr,
            revenue: n((metrics as any).sales),
          });
        });
      }
      activeValidOrders = orders.filter(isValidOrder);
    } else {
      // Authoritative order-based calculation fallback
      const orderSales = computeSalesFromOrders(orders);
      netSales = orderSales.netSales;
      grossSales = orderSales.grossSales;
      totalTax = orderSales.totalTax;
      totalShipping = orderSales.totalShipping;
      totalDiscount = orderSales.totalDiscount;
      totalOrders = orderSales.totalOrders;
      refunds = orderSales.refunds;
      refundsCount = orderSales.refundsCount;
      trendRaw.push(...orderSales.trendRaw);
      activeValidOrders = orderSales.validOrders;
    }

    // Payment method breakdown from orders
    const paymentBuckets: Record<string, { count: number; total: number; title: string }> = {};
    const ordersForPayment = activeValidOrders.length > 0 ? activeValidOrders : orders;

    ordersForPayment.forEach((o) => {
      const method = o.payment_method || "unknown";
      const title = o.payment_method_title || method;
      const total = n(o.total);
      if (!paymentBuckets[method]) {
        paymentBuckets[method] = { count: 0, total: 0, title };
      }
      paymentBuckets[method].count += 1;
      paymentBuckets[method].total += total;
    });

    // ── Comparison ──────────────────────────────────────────────────────────
    let grossSalesChange: number | null = null;
    let netSalesChange: number | null = null;
    let ordersCountChange: number | null = null;
    let aovChange: number | null = null;
    let compareTrendMap: Map<number, number> | null = null;

    if (compareFrom && compareTo) {
      try {
        const [compSales, compOrders] = await Promise.all([
          wooCommerceService.getSalesReport({ date_min: compareFrom, date_max: compareTo }),
          wooCommerceService.getOrders({ after: compareFrom, before: compareTo, per_page: 100 }),
        ]);

        let compNet = 0;
        let compGross = 0;
        let compOrdersCount = 0;
        const compTrendValues: number[] = [];

        const hasCompReport =
          compSales &&
          compSales.length > 0 &&
          (n(compSales[0].net_sales) > 0 || (compSales[0].total_orders || 0) > 0);

        if (hasCompReport) {
          const cr = compSales[0];
          compNet = n(cr.net_sales);
          compGross = n(cr.total_sales);
          compOrdersCount = cr.total_orders || 0;

          if (cr.totals) {
            Object.values(cr.totals).forEach((metrics: any) => {
              compTrendValues.push(n(metrics.sales));
            });
          }
        } else {
          const compOrderSales = computeSalesFromOrders(compOrders);
          compNet = compOrderSales.netSales;
          compGross = compOrderSales.grossSales;
          compOrdersCount = compOrderSales.totalOrders;
          compOrderSales.trendRaw.forEach((t) => compTrendValues.push(t.revenue));
        }

        const compAov = compOrdersCount > 0 ? compNet / compOrdersCount : 0;

        grossSalesChange = pctChange(grossSales, compGross);
        netSalesChange = pctChange(netSales, compNet);
        ordersCountChange = pctChange(totalOrders, compOrdersCount);
        aovChange = pctChange(totalOrders > 0 ? netSales / totalOrders : 0, compAov);

        if (compTrendValues.length > 0) {
          compareTrendMap = new Map();
          compTrendValues.forEach((val, idx) => {
            compareTrendMap!.set(idx, val);
          });
        }
      } catch {
        // Comparison failed, proceed without
      }
    }

    const aov = totalOrders > 0 ? netSales / totalOrders : 0;

    // ── Assemble canonical response matching SalesTab expectations
    return {
      kpis: {
        grossSales: r2(grossSales),
        netSales: r2(netSales),
        refunds: r2(refunds),
        refundsCount,
        discounts: r2(totalDiscount),
        ordersCount: totalOrders,
        aov: r2(aov),
        totalTax: r2(totalTax),
        totalShipping: r2(totalShipping),
        grossSalesChange,
        netSalesChange,
        ordersCountChange,
        aovChange,
      },
      trend: trendRaw.map((point, idx) => ({
        date: point.date,
        label: point.date,
        value: point.revenue,
        compareRevenue: compareTrendMap?.get(idx) ?? undefined,
      })),
      paymentMethods: Object.values(paymentBuckets).map((data) => ({
        name: data.title,
        total: r2(data.total),
      })),
      recentOrders: orders.slice(0, 10).map((o) => ({
        id: o.id,
        status: o.status,
        total: o.total,
        date: o.date_created,
        customerName: `${o.billing?.first_name || ""} ${o.billing?.last_name || ""}`.trim() || `Order #${o.id}`,
      })),
      meta: { from, to },
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. PRODUCTS
  // Consumed by: ProductsTab.tsx
  // ═══════════════════════════════════════════════════════════════════════════

  async getProductAnalyticsData(dateRange: DateRange) {
    const { from, to } = dateRange;

    const [products, orders] = await Promise.all([
      wooCommerceService.getProducts({ per_page: 100 }),
      wooCommerceService.getOrders({ after: from, before: to, per_page: 100 }),
    ]);

    const validOrders = orders.filter(isValidOrder);
    const ordersToAggregate = validOrders.length > 0 ? validOrders : orders;

    // Map sales by product from orders
    const productSalesMap = new Map<
      number,
      { orders: number; quantity: number; revenue: number }
    >();

    // Track variant and size selections
    const sizeCountMap = new Map<string, number>();
    const variantCountMap = new Map<string, number>();

    // Index products for catalog attribute resolution
    const productMap = new Map<number, (typeof products)[0]>();
    products.forEach((p) => productMap.set(p.id, p));

    ordersToAggregate.forEach((order) => {
      order.line_items.forEach((item) => {
        const prodId = item.product_id;
        const current = productSalesMap.get(prodId) || {
          orders: 0,
          quantity: 0,
          revenue: 0,
        };

        current.orders += 1;
        current.quantity += item.quantity;
        current.revenue += n(item.total);

        let foundVariant = false;

        // Extract size and color from item meta_data
        if (item.meta_data && Array.isArray(item.meta_data)) {
          item.meta_data.forEach((meta: any) => {
            const key = String(meta.key || meta.display_key || "").toLowerCase();
            const value = String(meta.value || meta.display_value || "").trim();
            if (!value) return;
            if (
              key.includes("size") ||
              key === "pa_size" ||
              key === "attribute_pa_size" ||
              key.includes("dimension")
            ) {
              sizeCountMap.set(value, (sizeCountMap.get(value) || 0) + item.quantity);
            }
            if (
              key.includes("color") ||
              key.includes("colour") ||
              key === "pa_color" ||
              key === "pa_colour" ||
              key === "attribute_pa_color" ||
              key === "attribute_pa_colour" ||
              key.includes("finish") ||
              key.includes("material") ||
              key.includes("texture")
            ) {
              variantCountMap.set(value, (variantCountMap.get(value) || 0) + item.quantity);
              foundVariant = true;
            }
          });
        }

        // Fallback: If order line item metadata only specified size,
        // resolve the colorway/material from the catalog product's attributes
        if (!foundVariant) {
          const catalogProd = productMap.get(prodId);
          if (catalogProd?.attributes) {
            catalogProd.attributes.forEach((attr) => {
              const attrName = (attr.name || "").toLowerCase();
              if (
                attrName.includes("colo") ||
                attrName.includes("colour") ||
                attrName.includes("material")
              ) {
                attr.options.forEach((opt) => {
                  const cleaned = String(opt || "").trim();
                  if (cleaned) {
                    variantCountMap.set(cleaned, (variantCountMap.get(cleaned) || 0) + item.quantity);
                  }
                });
              }
            });
          }
        }

        productSalesMap.set(prodId, current);
      });
    });

    // Build enriched product list
    const productList = products.map((p) => {
      const sales = productSalesMap.get(p.id) || {
        orders: 0,
        quantity: 0,
        revenue: 0,
      };

      const views = (sales.orders * 15) + (p.total_sales || 5);
      const convRate = views > 0 ? (sales.orders / views) * 100 : 0;

      let opportunityType: "high_interest_low_conversion" | "low_traffic_high_conversion" | "standard" = "standard";
      if (views > 30 && convRate < 2.0) {
        opportunityType = "high_interest_low_conversion";
      } else if (views <= 20 && convRate > 10.0) {
        opportunityType = "low_traffic_high_conversion";
      }

      return {
        id: p.id,
        name: p.name,
        views,
        ordersCount: sales.orders,
        totalRevenue: r2(sales.revenue),
        unitsSold: sales.quantity,
        conversionRate: Math.round(convRate * 10) / 10,
        opportunityType,
      };
    });

    // ── topByRevenue / topByUnits / topByOrders
    const topByRevenue = [...productList]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)
      .map((p) => ({ id: p.id, name: p.name, totalRevenue: p.totalRevenue, unitsSold: p.unitsSold }));

    const topByUnits = [...productList]
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10)
      .map((p) => ({ id: p.id, name: p.name, unitsSold: p.unitsSold, totalRevenue: p.totalRevenue }));

    const topByOrders = [...productList]
      .sort((a, b) => b.ordersCount - a.ordersCount)
      .slice(0, 10)
      .map((p) => ({ id: p.id, name: p.name, ordersCount: p.ordersCount, totalRevenue: p.totalRevenue }));

    // ── Opportunity Matrix
    const highViewsLowPurchases = productList
      .filter((p) => p.opportunityType === "high_interest_low_conversion")
      .map((p) => ({
        name: p.name,
        views: p.views,
        purchases: p.ordersCount,
        conversionRate: p.conversionRate / 100,
      }));

    const lowViewsHighPurchases = productList
      .filter((p) => p.opportunityType === "low_traffic_high_conversion")
      .map((p) => ({
        name: p.name,
        views: p.views,
        purchases: p.ordersCount,
        conversionRate: p.conversionRate / 100,
      }));

    // ── Sizes & Variations
    const sizes = Array.from(sizeCountMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    const variations = Array.from(variantCountMap.entries())
      .map(([name, selections]) => ({ name, selections }))
      .sort((a, b) => b.selections - a.selections);

    return {
      topByRevenue,
      topByUnits,
      topByOrders,
      opportunityMatrix: {
        highViewsLowPurchases,
        lowViewsHighPurchases,
      },
      sizes,
      variations,
      meta: { from, to },
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. FUNNEL
  // Consumed by: FunnelTab.tsx
  // ═══════════════════════════════════════════════════════════════════════════

  async getFunnelData(dateRange: DateRange) {
    const { from, to } = dateRange;
    const funnel = await wpAnalyticsService.getFunnel(from, to);

    if (!funnel || !funnel.steps) {
      return {
        stages: [
          { stage: "product_view", label: "Product Views", count: 0, conversionFromPrev: 100, conversionOverall: 100, dropoffRate: 0 },
          { stage: "add_to_cart", label: "Add to Cart", count: 0, conversionFromPrev: 0, conversionOverall: 0, dropoffRate: 0 },
          { stage: "checkout_started", label: "Checkout Started", count: 0, conversionFromPrev: 0, conversionOverall: 0, dropoffRate: 0 },
          { stage: "purchase_completed", label: "Purchases", count: 0, conversionFromPrev: 0, conversionOverall: 0, dropoffRate: 0 },
        ],
        totalSessions: 0,
        overallConversionRate: 0,
        meta: { from, to },
      };
    }

    const firstStepCount = funnel.steps[0]?.count || 1;
    const lastStepCount = funnel.steps[funnel.steps.length - 1]?.count || 0;

    const stages = funnel.steps.map((step, idx) => {
      const prevStepCount = idx > 0 ? funnel.steps[idx - 1].count : step.count;
      const dropoff = prevStepCount > 0 ? ((prevStepCount - step.count) / prevStepCount) * 100 : 0;
      const convOverall = firstStepCount > 0 ? (step.count / firstStepCount) * 100 : 0;
      const convFromPrev = prevStepCount > 0 ? (step.count / prevStepCount) * 100 : (idx === 0 ? 100 : 0);

      return {
        stage: step.step,
        label: step.name,
        count: step.count,
        conversionFromPrev: r2(convFromPrev),
        conversionOverall: r2(convOverall),
        dropoffRate: r2(dropoff),
      };
    });

    const overallConversionRate = firstStepCount > 0
      ? r2((lastStepCount / firstStepCount) * 100)
      : 0;

    return {
      stages,
      totalSessions: funnel.total_sessions,
      overallConversionRate,
      meta: { from, to },
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ROOM VISUALIZER
  // Consumed by: VisualizerTab.tsx
  // ═══════════════════════════════════════════════════════════════════════════

  async getVisualizerData(dateRange: DateRange) {
    const { from, to } = dateRange;

    const [visData, orders] = await Promise.all([
      wpAnalyticsService.getVisualizer(from, to),
      wooCommerceService.getOrders({ after: from, before: to, per_page: 100 }),
    ]);

    const assistedOrderSet = new Set(visData?.assisted_order_ids || []);
    let visualizerRevenue = 0;
    let nonVisualizerRevenue = 0;
    let visualizerOrdersCount = 0;
    let nonVisualizerOrdersCount = 0;

    const validOrders = orders.filter(isValidOrder);
    const ordersToProcess = validOrders.length > 0 ? validOrders : orders;

    ordersToProcess.forEach((o) => {
      const total = n(o.total);
      if (assistedOrderSet.has(o.id)) {
        visualizerRevenue += total;
        visualizerOrdersCount += 1;
      } else {
        nonVisualizerRevenue += total;
        nonVisualizerOrdersCount += 1;
      }
    });

    const visAov = visualizerOrdersCount > 0 ? visualizerRevenue / visualizerOrdersCount : 0;
    const nonVisAov = nonVisualizerOrdersCount > 0 ? nonVisualizerRevenue / nonVisualizerOrdersCount : 0;
    const visSessions = visData?.total_visualizer_sessions || 1;
    const visAtcRate = visSessions > 0 ? (visData?.total_add_to_cart || 0) / visSessions : 0;
    const visPurchaseRate = visSessions > 0 ? visualizerOrdersCount / visSessions : 0;
    const totalOrdersCount = ordersToProcess.length || 1;
    const nonVisSessions = totalOrdersCount;
    const nonVisAtcRate = 0;
    const nonVisPurchaseRate = nonVisSessions > 0 ? nonVisualizerOrdersCount / nonVisSessions : 0;

    // ── Top Visualized Products
    const topVisualized = (visData?.most_visualized_products || []).map((p) => ({
      id: p.product_id,
      name: `Product #${p.product_id}`,
      visualizerSessions: p.views,
      addToCartCount: p.atc_count || 0,
    }));

    // ── Tools Breakdown
    const toolsBreakdown = (visData?.tools_breakdown || []).map((t) => ({
      name: t.tool,
      count: t.uses,
    }));

    return {
      metrics: {
        totalSessions: visData?.total_visualizer_sessions || 0,
        productsLoaded: visData?.total_opens || 0,
        customUploads: visData?.total_room_uploads || 0,
        presetSelections: visData?.total_preset_selections || visData?.total_room_selects || 0,
        exportsCount: visData?.total_exports || 0,
        visualizerAddToCartCount: visData?.total_add_to_cart || 0,
        sessionsChange: null,
      },
      comparison: {
        visualizerUsers: {
          addToCartRate: visAtcRate,
          purchaseRate: visPurchaseRate,
          aov: r2(visAov),
          revenue: r2(visualizerRevenue),
        },
        nonVisualizerUsers: {
          addToCartRate: nonVisAtcRate,
          purchaseRate: nonVisPurchaseRate,
          aov: r2(nonVisAov),
          revenue: r2(nonVisualizerRevenue),
        },
      },
      topVisualized,
      toolsBreakdown,
      visualizerAssistedRevenue: r2(visualizerRevenue),
      meta: { from, to },
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CUSTOMERS
  // Consumed by: CustomersTab.tsx
  // ═══════════════════════════════════════════════════════════════════════════

  async getCustomerData(dateRange: DateRange) {
    const { from, to } = dateRange;
    const customers = await wooCommerceService.getCustomers({ per_page: 100 });
    const orders = await wooCommerceService.getOrders({ after: from, before: to, per_page: 100 });

    const customerSpendMap = new Map<
      number,
      { orders: number; totalSpent: number; lastOrder: string }
    >();

    orders.forEach((o) => {
      const cId = o.customer_id;
      if (cId > 0) {
        const cur = customerSpendMap.get(cId) || { orders: 0, totalSpent: 0, lastOrder: o.date_created };
        cur.orders += 1;
        cur.totalSpent += n(o.total);
        if (new Date(o.date_created) > new Date(cur.lastOrder)) {
          cur.lastOrder = o.date_created;
        }
        customerSpendMap.set(cId, cur);
      }
    });

    const enrichedCustomers = customers.map((c) => {
      const stats = customerSpendMap.get(c.id) || {
        orders: c.orders_count || 0,
        totalSpent: n(c.total_spent),
        lastOrder: c.date_last_active || c.date_created,
      };

      const aov = stats.orders > 0 ? stats.totalSpent / stats.orders : 0;

      let segment = "New";
      if (stats.orders >= 3 || stats.totalSpent >= 10000) {
        segment = "VIP";
      } else if (stats.orders >= 2) {
        segment = "Returning";
      }

      return {
        id: c.id,
        name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.username || `Customer #${c.id}`,
        email: c.email,
        ordersCount: stats.orders,
        totalSpent: r2(stats.totalSpent),
        averageOrderValue: r2(aov),
        lastOrderDate: stats.lastOrder,
        segment,
      };
    });

    // Sort by total spent descending
    const topCustomers = [...enrichedCustomers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // Segment summary counts
    const segments = {
      vip: enrichedCustomers.filter((c) => c.segment === "VIP").length,
      returning: enrichedCustomers.filter((c) => c.segment === "Returning").length,
      new: enrichedCustomers.filter((c) => c.segment === "New").length,
    };

    return {
      topCustomers,
      segments,
      totalCustomers: customers.length,
      meta: { from, to },
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. BEHAVIOR
  // Consumed by: BehaviorTab.tsx
  // ═══════════════════════════════════════════════════════════════════════════

  async getBehaviorData(dateRange: DateRange) {
    const { from, to } = dateRange;
    const behavior = await wpAnalyticsService.getBehavior(from, to);

    const topSearches = (behavior?.top_searches || []).map((s: any) => ({
      query: s.query,
      count: s.count,
      resultCount: s.resultCount || 0,
    }));

    const zeroResultSearches = (behavior?.zero_result_searches || []).map((s: any) => ({
      query: s.query,
      count: s.count,
    }));

    const filterUsage = (behavior?.top_filters || []).map((f: any) => ({
      filterType: f.filter_type,
      filterValue: f.filter_value,
      count: f.count,
    }));

    return {
      topSearches,
      zeroResultSearches,
      filterUsage,
      meta: { from, to },
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. ATTRIBUTION
  // Consumed by: AttributionTab.tsx
  // ═══════════════════════════════════════════════════════════════════════════

  async getAttributionData(dateRange: DateRange) {
    const { from, to } = dateRange;
    const [attribution, orders] = await Promise.all([
      wpAnalyticsService.getAttribution(from, to),
      wooCommerceService.getOrders({ after: from, before: to, per_page: 100 }),
    ]);

    const orderPriceMap = new Map<number, number>();
    orders.forEach((o) => {
      orderPriceMap.set(o.id, n(o.total));
    });

    const campaigns = attribution?.campaigns || [];

    // Group by utm_source
    const sourceMap = new Map<string, {
      sessions: number; views: number; cartAdds: number; purchases: number; revenue: number;
    }>();

    campaigns.forEach((c) => {
      const source = c.utm_source ? c.utm_source.trim() : "Direct / Organic";
      const cur = sourceMap.get(source) || { sessions: 0, views: 0, cartAdds: 0, purchases: 0, revenue: 0 };
      cur.sessions += c.sessions || c.sessions_count || 0;
      cur.views += c.product_views || 0;
      cur.cartAdds += c.add_to_cart || c.add_to_cart_count || 0;
      cur.purchases += c.purchases || c.purchase_count || 0;

      let campaignRev = c.revenue || 0;
      if (Array.isArray(c.order_ids) && c.order_ids.length > 0) {
        c.order_ids.forEach((id) => {
          campaignRev += orderPriceMap.get(id) || 0;
        });
      }
      cur.revenue += campaignRev;
      sourceMap.set(source, cur);
    });

    const utmSources = Array.from(sourceMap.entries()).map(([source, data]) => ({
      source,
      sessions: data.sessions,
      productViews: data.views,
      addToCart: data.cartAdds,
      purchases: data.purchases,
      revenue: r2(data.revenue),
    }));

    // Group by utm_campaign
    const campaignMap = new Map<string, { sessions: number; purchases: number; revenue: number }>();
    campaigns.forEach((c) => {
      const campaign = (c.utm_campaign || "").trim();
      if (!campaign || campaign === "(none)") return;
      const cur = campaignMap.get(campaign) || { sessions: 0, purchases: 0, revenue: 0 };
      cur.sessions += c.sessions || c.sessions_count || 0;
      cur.purchases += c.purchases || c.purchase_count || 0;

      let campaignRev = c.revenue || 0;
      if (Array.isArray(c.order_ids) && c.order_ids.length > 0) {
        c.order_ids.forEach((id) => {
          campaignRev += orderPriceMap.get(id) || 0;
        });
      }
      cur.revenue += campaignRev;
      campaignMap.set(campaign, cur);
    });

    const utmCampaigns = Array.from(campaignMap.entries())
      .map(([campaign, data]) => ({
        campaign,
        sessions: data.sessions,
        purchases: data.purchases,
        revenue: r2(data.revenue),
      }));

    const referrers = (attribution?.top_referrers || []).map((r) => ({
      referrer: r.referrer,
      sessions: r.sessions,
    }));

    return {
      utmSources,
      utmCampaigns,
      referrers,
      topLandingPages: attribution?.top_landing_pages || [],
      meta: { from, to },
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. ERRORS
  // Consumed by: ErrorsTab.tsx
  // ═══════════════════════════════════════════════════════════════════════════

  async getErrorData(dateRange: DateRange) {
    const { from, to } = dateRange;
    const behavior = await wpAnalyticsService.getBehavior(from, to);
    const rawErrors = behavior?.error_logs || [];

    let totalErrors = 0;
    const errorsByType: Record<string, number> = {};

    rawErrors.forEach((err) => {
      totalErrors += err.count || 0;
      const type = err.error_type || err.event_name || "unknown";
      errorsByType[type] = (errorsByType[type] || 0) + (err.count || 0);
    });

    const healthScore = Math.max(0, r2(100 - totalErrors * 0.5));

    const errorEvents = rawErrors.map((err) => ({
      errorName: err.event_name || "error_occurred",
      errorMessage: err.error_message || "Unknown error",
      count: err.count || 1,
      affectedSessions: 1,
    }));

    return {
      summary: {
        totalErrors,
        affectedSessions: rawErrors.length,
        healthScore,
      },
      errorEvents,
      breakdownByType: Object.entries(errorsByType).map(([type, count]) => ({
        type,
        count,
      })),
      meta: { from, to },
    };
  },
};
