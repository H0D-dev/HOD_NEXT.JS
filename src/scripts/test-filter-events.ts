/**
 * Test Filter Event Ingestion & Behavior Query in WordPress
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

const WP_BASE = (process.env.WC_BASE_URL || "https://store.houseofdecor.ae").replace(/\/$/, "");
const CK = process.env.WC_CONSUMER_KEY || "";
const CS = process.env.WC_CONSUMER_SECRET || "";
const basicAuth = CK && CS ? `Basic ${Buffer.from(`${CK}:${CS}`).toString("base64")}` : "";

const fromDate = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
const toDate = new Date().toISOString().split("T")[0];

async function testFilterPipeline() {
  console.log("=== 1. POST TEST FILTER EVENTS TO WORDPRESS ===");
  const sessionId = `hod_sess_filter_test_${Date.now()}`;
  
  // Send various filter event property formats to test what WP expects
  const testPayload = {
    session: {
      session_id: sessionId,
      started_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      landing_page: "/products/rugs",
    },
    events: [
      {
        event_id: `evt_filt_1_${Date.now()}`,
        event_name: "filter_applied",
        session_id: sessionId,
        page: "/products/rugs",
        created_at: new Date().toISOString(),
        properties: {
          filterType: "color",
          filterValue: "Blue",
          filter_type: "color",
          filter_value: "Blue",
        },
      },
      {
        event_id: `evt_filt_2_${Date.now()}`,
        event_name: "filter_applied",
        session_id: sessionId,
        page: "/products/rugs",
        created_at: new Date().toISOString(),
        properties: {
          filterType: "size",
          filterValue: "250x350",
          filter_type: "size",
          filter_value: "250x350",
        },
      },
      {
        event_id: `evt_filt_3_${Date.now()}`,
        event_name: "filter_applied",
        session_id: sessionId,
        page: "/products/rugs",
        created_at: new Date().toISOString(),
        properties: {
          filterType: "material",
          filterValue: "Wool & Bamboo Silk",
          filter_type: "material",
          filter_value: "Wool & Bamboo Silk",
        },
      },
    ],
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (basicAuth) headers["Authorization"] = basicAuth;

  const ingestRes = await fetch(`${WP_BASE}/wp-json/hod/v1/analytics/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(testPayload),
  });

  console.log(`Ingest Status: ${ingestRes.status}`);
  console.log(`Ingest Response:`, await ingestRes.text());

  console.log("\n=== 2. QUERY /analytics/behavior FROM WORDPRESS ===");
  const behRes = await fetch(`${WP_BASE}/wp-json/hod/v1/analytics/behavior?from=${fromDate}&to=${toDate}`, {
    headers: { Accept: "application/json", ...(basicAuth ? { Authorization: basicAuth } : {}) },
  });

  console.log(`Behavior Query Status: ${behRes.status}`);
  const behData = await behRes.json();
  console.log("Behavior raw response:", JSON.stringify(behData, null, 2));
}

testFilterPipeline().catch(console.error);
