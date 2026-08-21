/**
 * Test all Analytics Query Layer methods
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

const range = {
  from: `${fromDate}T00:00:00Z`,
  to: `${toDate}T23:59:59Z`,
  period: "last90",
};

async function run() {
  console.log("=== 1. OVERVIEW DATA ===");
  const overview = await analyticsQueryLayer.getOverviewData(range);
  console.log("Overview summary:", overview.summary);
  console.log("Overview visualizerSnapshot:", overview.visualizerSnapshot);
  console.log("Overview funnelSnapshot:", overview.funnelSnapshot);

  console.log("\n=== 2. SALES DATA ===");
  const sales = await analyticsQueryLayer.getRevenueData(range);
  console.log("Sales kpis:", sales.kpis);

  console.log("\n=== 3. PRODUCTS DATA ===");
  const products = await analyticsQueryLayer.getProductAnalyticsData(range);
  console.log("Products topByRevenue count:", products.topByRevenue.length);
  console.log("Products sizes:", products.sizes);
  console.log("Products variations:", products.variations);

  console.log("\n=== 4. FUNNEL DATA ===");
  const funnel = await analyticsQueryLayer.getFunnelData(range);
  console.log("Funnel totalSessions:", funnel.totalSessions);
  console.log("Funnel stages:", funnel.stages);

  console.log("\n=== 5. VISUALIZER DATA ===");
  const vis = await analyticsQueryLayer.getVisualizerData(range);
  console.log("Visualizer metrics:", vis.metrics);
  console.log("Visualizer toolsBreakdown:", vis.toolsBreakdown);
  console.log("Visualizer topVisualized:", vis.topVisualized);

  console.log("\n=== 6. ATTRIBUTION DATA ===");
  const attr = await analyticsQueryLayer.getAttributionData(range);
  console.log("Attribution utmSources:", JSON.stringify(attr.utmSources, null, 2));
  console.log("Attribution utmCampaigns:", JSON.stringify(attr.utmCampaigns, null, 2));

  console.log("\n=== 7. BEHAVIOR DATA ===");
  const beh = await analyticsQueryLayer.getBehaviorData(range);
  console.log("Behavior topSearches:", beh.topSearches);
  console.log("Behavior filterUsage:", beh.filterUsage);

  console.log("\n=== 8. ERRORS DATA ===");
  const err = await analyticsQueryLayer.getErrorData(range);
  console.log("Errors summary:", err.summary);
}

run().catch(console.error);
