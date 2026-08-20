/**
 * Comprehensive Read-Only Audit of All 9 Dashboard Tabs
 * Validates exact field-by-field contract between:
 * 1. UI Component expectations
 * 2. Next.js API route data outputs
 * 3. WordPress & WooCommerce backend responses
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { API_CONFIG } from "../lib/api/api";
if (!API_CONFIG.consumerKey && process.env.WC_CONSUMER_KEY) {
  API_CONFIG.consumerKey = process.env.WC_CONSUMER_KEY || "";
  API_CONFIG.consumerSecret = process.env.WC_CONSUMER_SECRET || "";
  API_CONFIG.baseUrl = process.env.WC_BASE_URL || "";
}

import { analyticsQueryLayer } from "../lib/analytics/server/analyticsQueryLayer";

const fromDate = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
const toDate = new Date().toISOString().split("T")[0];
const compareFromDate = new Date(Date.now() - 180 * 86400000).toISOString().split("T")[0];
const compareToDate = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];

const range = {
  from: `${fromDate}T00:00:00Z`,
  to: `${toDate}T23:59:59Z`,
  compareFrom: `${compareFromDate}T00:00:00Z`,
  compareTo: `${compareToDate}T23:59:59Z`,
  period: "last90",
};

interface AuditResult {
  tab: string;
  endpoint: string;
  status: "PASS" | "FAIL" | "WARN";
  checks: Array<{ field: string; status: "OK" | "FAIL" | "WARN"; valuePreview: string; detail?: string }>;
}

const results: AuditResult[] = [];

function assertField(
  checks: AuditResult["checks"],
  field: string,
  value: any,
  expectedType: "string" | "number" | "array" | "object" | "nullable_number" | "boolean",
  options?: { minLength?: number; allowEmpty?: boolean }
) {
  if (value === undefined) {
    checks.push({ field, status: "FAIL", valuePreview: "undefined", detail: "Field is missing from response" });
    return;
  }

  if (expectedType === "array") {
    if (!Array.isArray(value)) {
      checks.push({ field, status: "FAIL", valuePreview: typeof value, detail: "Expected array" });
    } else {
      const len = value.length;
      checks.push({
        field,
        status: "OK",
        valuePreview: `Array(${len}) [${JSON.stringify(value.slice(0, 2))}...]`,
      });
    }
    return;
  }

  if (expectedType === "nullable_number") {
    if (value === null || typeof value === "number") {
      checks.push({ field, status: "OK", valuePreview: String(value) });
    } else {
      checks.push({ field, status: "FAIL", valuePreview: typeof value, detail: "Expected number or null" });
    }
    return;
  }

  if (typeof value !== expectedType) {
    checks.push({ field, status: "FAIL", valuePreview: `${typeof value} (${value})`, detail: `Expected ${expectedType}` });
  } else {
    checks.push({ field, status: "OK", valuePreview: typeof value === "object" ? JSON.stringify(value) : String(value) });
  }
}

async function auditTab1Overview() {
  const checks: AuditResult["checks"] = [];
  const data = await analyticsQueryLayer.getOverviewData(range);

  // OverviewTab reads:
  // summary: netRevenue, grossRevenue, totalOrders, averageOrderValue, conversionRate, sessionsCount, refundsCount, revenueChange, ordersChange, aovChange, conversionRateChange
  // revenueTrend: [{ date, label, revenue, compareRevenue }]
  // funnelSnapshot: [{ stage, label, count, conversionFromPrev, conversionOverall, dropoffRate }]
  // topProducts: [{ id, name, totalRevenue, unitsSold }]
  // visualizerSnapshot: { totalSessions, productsLoaded, customUploads, visualizerAddToCartCount }
  assertField(checks, "summary", data.summary, "object");
  assertField(checks, "summary.netRevenue", data.summary?.netRevenue, "number");
  assertField(checks, "summary.grossRevenue", data.summary?.grossRevenue, "number");
  assertField(checks, "summary.totalOrders", data.summary?.totalOrders, "number");
  assertField(checks, "summary.averageOrderValue", data.summary?.averageOrderValue, "number");
  assertField(checks, "summary.conversionRate", data.summary?.conversionRate, "number");
  assertField(checks, "summary.sessionsCount", data.summary?.sessionsCount, "number");
  assertField(checks, "summary.refundsCount", data.summary?.refundsCount, "number");
  assertField(checks, "summary.revenueChange", data.summary?.revenueChange, "nullable_number");

  assertField(checks, "revenueTrend", data.revenueTrend, "array");
  assertField(checks, "funnelSnapshot", data.funnelSnapshot, "array");
  assertField(checks, "topProducts", data.topProducts, "array");
  assertField(checks, "visualizerSnapshot", data.visualizerSnapshot, "object");
  assertField(checks, "visualizerSnapshot.totalSessions", data.visualizerSnapshot?.totalSessions, "number");
  assertField(checks, "visualizerSnapshot.productsLoaded", data.visualizerSnapshot?.productsLoaded, "number");
  assertField(checks, "visualizerSnapshot.customUploads", data.visualizerSnapshot?.customUploads, "number");
  assertField(checks, "visualizerSnapshot.visualizerAddToCartCount", data.visualizerSnapshot?.visualizerAddToCartCount, "number");

  const hasFail = checks.some((c) => c.status === "FAIL");
  results.push({ tab: "1. Overview", endpoint: "/api/analytics/overview", status: hasFail ? "FAIL" : "PASS", checks });
}

async function auditTab2Sales() {
  const checks: AuditResult["checks"] = [];
  const data = await analyticsQueryLayer.getRevenueData(range);

  // SalesTab reads:
  // kpis: grossSales, netSales, refunds, refundsCount, discounts, ordersCount, aov, totalTax, totalShipping, grossSalesChange, netSalesChange, ordersCountChange, aovChange
  // trend: [{ date, label, value, compareRevenue }]
  // paymentMethods: [{ label, value / name, total }]
  // recentOrders: [{ id, status, total, date, customerName }]
  assertField(checks, "kpis", data.kpis, "object");
  assertField(checks, "kpis.grossSales", data.kpis?.grossSales, "number");
  assertField(checks, "kpis.netSales", data.kpis?.netSales, "number");
  assertField(checks, "kpis.refunds", data.kpis?.refunds, "number");
  assertField(checks, "kpis.ordersCount", data.kpis?.ordersCount, "number");
  assertField(checks, "kpis.aov", data.kpis?.aov, "number");
  assertField(checks, "kpis.totalTax", data.kpis?.totalTax, "number");
  assertField(checks, "kpis.totalShipping", data.kpis?.totalShipping, "number");
  assertField(checks, "trend", data.trend, "array");
  assertField(checks, "paymentMethods", data.paymentMethods, "array");
  assertField(checks, "recentOrders", data.recentOrders, "array");

  const hasFail = checks.some((c) => c.status === "FAIL");
  results.push({ tab: "2. Sales & Revenue", endpoint: "/api/analytics/revenue", status: hasFail ? "FAIL" : "PASS", checks });
}

async function auditTab3Products() {
  const checks: AuditResult["checks"] = [];
  const data = await analyticsQueryLayer.getProductAnalyticsData(range);

  // ProductsTab reads:
  // topByRevenue: [{ label/name, value/totalRevenue, secondaryValue/unitsSold }]
  // topByUnits: [{ label/name, value/unitsSold, secondaryValue/totalRevenue }]
  // topByOrders: [{ label/name, value/ordersCount, secondaryValue/totalRevenue }]
  // opportunityMatrix: { highViewsLowPurchases: [{ name, views, purchases, conversionRate }], lowViewsHighPurchases: [...] }
  // sizes: [{ label/size, count/ordersCount }]
  // variations: [{ name/color, selections/count }]
  assertField(checks, "topByRevenue", data.topByRevenue, "array");
  assertField(checks, "topByUnits", data.topByUnits, "array");
  assertField(checks, "topByOrders", data.topByOrders, "array");
  assertField(checks, "opportunityMatrix", data.opportunityMatrix, "object");
  assertField(checks, "opportunityMatrix.highViewsLowPurchases", data.opportunityMatrix?.highViewsLowPurchases, "array");
  assertField(checks, "opportunityMatrix.lowViewsHighPurchases", data.opportunityMatrix?.lowViewsHighPurchases, "array");
  assertField(checks, "sizes", data.sizes, "array");
  assertField(checks, "variations", data.variations, "array");

  const hasFail = checks.some((c) => c.status === "FAIL");
  results.push({ tab: "3. Products", endpoint: "/api/analytics/products", status: hasFail ? "FAIL" : "PASS", checks });
}

async function auditTab4Funnel() {
  const checks: AuditResult["checks"] = [];
  const data = await analyticsQueryLayer.getFunnelData(range);

  // FunnelTab reads:
  // totalSessions: number
  // overallConversionRate: number
  // stages: [{ stage, label, count, conversionFromPrev, conversionOverall, dropoffRate }]
  assertField(checks, "totalSessions", data.totalSessions, "number");
  assertField(checks, "overallConversionRate", data.overallConversionRate, "number");
  assertField(checks, "stages", data.stages, "array");

  if (data.stages?.length > 0) {
    const s0 = data.stages[0];
    assertField(checks, "stages[0].stage", s0.stage, "string");
    assertField(checks, "stages[0].label", s0.label, "string");
    assertField(checks, "stages[0].count", s0.count, "number");
    assertField(checks, "stages[0].conversionFromPrev", s0.conversionFromPrev, "number");
    assertField(checks, "stages[0].conversionOverall", s0.conversionOverall, "number");
    assertField(checks, "stages[0].dropoffRate", s0.dropoffRate, "number");
  }

  const hasFail = checks.some((c) => c.status === "FAIL");
  results.push({ tab: "4. Funnel", endpoint: "/api/analytics/funnel", status: hasFail ? "FAIL" : "PASS", checks });
}

async function auditTab5Visualizer() {
  const checks: AuditResult["checks"] = [];
  const data = await analyticsQueryLayer.getVisualizerData(range);

  // VisualizerTab reads:
  // metrics: { totalSessions, productsLoaded, customUploads, presetSelections, exportsCount, visualizerAddToCartCount, sessionsChange }
  // comparison: { visualizerUsers: { addToCartRate, purchaseRate, aov, revenue }, nonVisualizerUsers: { ... } }
  // topVisualized: [{ id, name, visualizerSessions, addToCartCount }]
  // toolsBreakdown: [{ name, count }]
  // visualizerAssistedRevenue: number
  assertField(checks, "metrics", data.metrics, "object");
  assertField(checks, "metrics.totalSessions", data.metrics?.totalSessions, "number");
  assertField(checks, "metrics.productsLoaded", data.metrics?.productsLoaded, "number");
  assertField(checks, "metrics.customUploads", data.metrics?.customUploads, "number");
  assertField(checks, "metrics.presetSelections", data.metrics?.presetSelections, "number");
  assertField(checks, "metrics.exportsCount", data.metrics?.exportsCount, "number");
  assertField(checks, "metrics.visualizerAddToCartCount", data.metrics?.visualizerAddToCartCount, "number");
  assertField(checks, "comparison", data.comparison, "object");
  assertField(checks, "comparison.visualizerUsers.aov", data.comparison?.visualizerUsers?.aov, "number");
  assertField(checks, "topVisualized", data.topVisualized, "array");
  assertField(checks, "toolsBreakdown", data.toolsBreakdown, "array");
  assertField(checks, "visualizerAssistedRevenue", data.visualizerAssistedRevenue, "number");

  const hasFail = checks.some((c) => c.status === "FAIL");
  results.push({ tab: "5. Room Visualizer", endpoint: "/api/analytics/visualizer", status: hasFail ? "FAIL" : "PASS", checks });
}

async function auditTab6Customers() {
  const checks: AuditResult["checks"] = [];
  const data = await analyticsQueryLayer.getCustomerData(range);

  // CustomersTab reads:
  // totalCustomers: number
  // segments: { vip, returning, new }
  // topCustomers: [{ id, name, email, ordersCount, totalSpent, averageOrderValue, lastOrderDate, segment }]
  assertField(checks, "totalCustomers", data.totalCustomers, "number");
  assertField(checks, "segments", data.segments, "object");
  assertField(checks, "segments.vip", data.segments?.vip, "number");
  assertField(checks, "segments.returning", data.segments?.returning, "number");
  assertField(checks, "segments.new", data.segments?.new, "number");
  assertField(checks, "topCustomers", data.topCustomers, "array");

  if (data.topCustomers?.length > 0) {
    const c0 = data.topCustomers[0];
    assertField(checks, "topCustomers[0].name", c0.name, "string");
    assertField(checks, "topCustomers[0].ordersCount", c0.ordersCount, "number");
    assertField(checks, "topCustomers[0].totalSpent", c0.totalSpent, "number");
    assertField(checks, "topCustomers[0].segment", c0.segment, "string");
  }

  const hasFail = checks.some((c) => c.status === "FAIL");
  results.push({ tab: "6. Customers", endpoint: "/api/analytics/customers", status: hasFail ? "FAIL" : "PASS", checks });
}

async function auditTab7Attribution() {
  const checks: AuditResult["checks"] = [];
  const data = await analyticsQueryLayer.getAttributionData(range);

  // AttributionTab reads:
  // utmSources: [{ source, sessions, productViews, addToCart, purchases, revenue }]
  // utmCampaigns: [{ campaign, sessions, purchases, revenue }]
  // referrers: [{ referrer, sessions }]
  assertField(checks, "utmSources", data.utmSources, "array");
  assertField(checks, "utmCampaigns", data.utmCampaigns, "array");
  assertField(checks, "referrers", data.referrers, "array");

  if (data.utmSources?.length > 0) {
    const s0 = data.utmSources[0];
    assertField(checks, "utmSources[0].source", s0.source, "string");
    assertField(checks, "utmSources[0].sessions", s0.sessions, "number");
    assertField(checks, "utmSources[0].productViews", s0.productViews, "number");
    assertField(checks, "utmSources[0].addToCart", s0.addToCart, "number");
    assertField(checks, "utmSources[0].purchases", s0.purchases, "number");
    assertField(checks, "utmSources[0].revenue", s0.revenue, "number");
  }

  if (data.utmCampaigns?.length > 0) {
    const c0 = data.utmCampaigns[0];
    assertField(checks, "utmCampaigns[0].campaign", c0.campaign, "string");
    assertField(checks, "utmCampaigns[0].sessions", c0.sessions, "number");
    assertField(checks, "utmCampaigns[0].purchases", c0.purchases, "number");
    assertField(checks, "utmCampaigns[0].revenue", c0.revenue, "number");
  }

  const hasFail = checks.some((c) => c.status === "FAIL");
  results.push({ tab: "7. Attribution", endpoint: "/api/analytics/attribution", status: hasFail ? "FAIL" : "PASS", checks });
}

async function auditTab8Behavior() {
  const checks: AuditResult["checks"] = [];
  const data = await analyticsQueryLayer.getBehaviorData(range);

  // BehaviorTab reads:
  // topSearches: [{ query/term, count/searches, resultCount }]
  // zeroResultSearches: [{ query/term, count/searches }]
  // filterUsage: [{ filterType/category, filterValue/value, count }]
  assertField(checks, "topSearches", data.topSearches, "array");
  assertField(checks, "zeroResultSearches", data.zeroResultSearches, "array");
  assertField(checks, "filterUsage", data.filterUsage, "array");

  if (data.filterUsage?.length > 0) {
    const f0 = data.filterUsage[0];
    assertField(checks, "filterUsage[0].filterType", f0.filterType, "string");
    assertField(checks, "filterUsage[0].filterValue", f0.filterValue, "string");
    assertField(checks, "filterUsage[0].count", f0.count, "number");
  }

  const hasFail = checks.some((c) => c.status === "FAIL");
  results.push({ tab: "8. Behavior", endpoint: "/api/analytics/behavior", status: hasFail ? "FAIL" : "PASS", checks });
}

async function auditTab9Errors() {
  const checks: AuditResult["checks"] = [];
  const data = await analyticsQueryLayer.getErrorData(range);

  // ErrorsTab reads:
  // summary: { totalErrors, affectedSessions, healthScore }
  // errorEvents: [{ errorName, errorMessage, count, affectedSessions }]
  // breakdownByType: [{ type, count }]
  assertField(checks, "summary", data.summary, "object");
  assertField(checks, "summary.totalErrors", data.summary?.totalErrors, "number");
  assertField(checks, "summary.affectedSessions", data.summary?.affectedSessions, "number");
  assertField(checks, "summary.healthScore", data.summary?.healthScore, "number");
  assertField(checks, "errorEvents", data.errorEvents, "array");
  assertField(checks, "breakdownByType", data.breakdownByType, "array");

  const hasFail = checks.some((c) => c.status === "FAIL");
  results.push({ tab: "9. Errors & Stability", endpoint: "/api/analytics/errors", status: hasFail ? "FAIL" : "PASS", checks });
}

async function runFullAudit() {
  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║     PRE-MERGE READ-ONLY AUDIT: ALL 9 ANALYTICS DASHBOARD TABS    ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝\n");

  await auditTab1Overview();
  await auditTab2Sales();
  await auditTab3Products();
  await auditTab4Funnel();
  await auditTab5Visualizer();
  await auditTab6Customers();
  await auditTab7Attribution();
  await auditTab8Behavior();
  await auditTab9Errors();

  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;

  results.forEach((res) => {
    console.log(`\n──────────────────────────────────────────────────────────────────`);
    console.log(`Tab: ${res.tab} [${res.endpoint}] => Status: ${res.status === "PASS" ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`──────────────────────────────────────────────────────────────────`);
    res.checks.forEach((c) => {
      totalChecks++;
      if (c.status === "OK") {
        passedChecks++;
        console.log(`  ✓ ${c.field.padEnd(38)} : ${c.valuePreview}`);
      } else {
        failedChecks++;
        console.log(`  ✗ ${c.field.padEnd(38)} : FAIL - ${c.detail} (${c.valuePreview})`);
      }
    });
  });

  console.log(`\n══════════════════════════════════════════════════════════════════`);
  console.log(`AUDIT SUMMARY: ${passedChecks}/${totalChecks} checks passed. (${failedChecks} failures)`);
  console.log(`Overall System Health: ${failedChecks === 0 ? "100% READY FOR MAIN MERGE ✅" : "FIXES NEEDED ❌"}`);
  console.log(`══════════════════════════════════════════════════════════════════\n`);
}

runFullAudit().catch(console.error);
