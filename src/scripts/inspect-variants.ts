/**
 * Inspect Order Line Items & Product Attributes for Variants/Colors
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

import { wooCommerceService } from "../lib/analytics/server/wooCommerceService";

async function inspect() {
  console.log("=== INSPECTING WOOCOMMERCE ORDERS ===");
  const orders = await wooCommerceService.getOrders({ per_page: 50 });
  console.log(`Found ${orders.length} orders.\n`);

  const allMetaKeys = new Set<string>();
  const lineItemSamples: any[] = [];

  orders.forEach((order, oIdx) => {
    console.log(`Order #${order.id} (Status: ${order.status}, Total: ${order.total}, Items: ${order.line_items?.length})`);
    order.line_items?.forEach((item, iIdx) => {
      console.log(`  Item [${item.product_id}]: "${item.name}" (qty: ${item.quantity}, variation_id: ${item.variation_id})`);
      if (item.meta_data && item.meta_data.length > 0) {
        console.log(`    meta_data:`, JSON.stringify(item.meta_data));
        item.meta_data.forEach((m: any) => allMetaKeys.add(m.key || m.display_key));
      } else {
        console.log(`    meta_data: NONE`);
      }
      if (lineItemSamples.length < 5) {
        lineItemSamples.push(item);
      }
    });
  });

  console.log("\n=== ALL UNIQUE META_DATA KEYS IN ORDERS ===");
  console.log(Array.from(allMetaKeys));

  console.log("\n=== INSPECTING CATALOG PRODUCTS ===");
  const products = await wooCommerceService.getProducts({ per_page: 20 });
  console.log(`Found ${products.length} products sample.\n`);

  products.slice(0, 10).forEach((p) => {
    console.log(`Product [${p.id}]: "${p.name}" (Type: ${p.type})`);
    if (p.attributes && p.attributes.length > 0) {
      console.log(`  Attributes:`, p.attributes.map(a => `${a.name}: [${a.options.join(", ")}]`).join(" | "));
    } else {
      console.log(`  Attributes: NONE`);
    }
  });
}

inspect().catch(console.error);
