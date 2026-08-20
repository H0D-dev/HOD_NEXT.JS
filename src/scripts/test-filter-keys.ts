/**
 * Test Property Naming Convention for WordPress Filter Ingestion
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

const WP_BASE = (process.env.WC_BASE_URL || "https://store.houseofdecor.ae").replace(/\/$/, "");
const CK = process.env.WC_CONSUMER_KEY || "";
const CS = process.env.WC_CONSUMER_SECRET || "";
const basicAuth = CK && CS ? `Basic ${Buffer.from(`${CK}:${CS}`).toString("base64")}` : "";

async function testPropertyKeys() {
  const sessionId = `hod_sess_key_test_${Date.now()}`;

  // Test A: camelCase filterType / filterValue (what frontend useAnalytics sends)
  const payloadCamel = {
    session: { session_id: sessionId, started_at: new Date().toISOString(), last_seen_at: new Date().toISOString() },
    events: [
      {
        event_id: `evt_camel_${Date.now()}`,
        event_name: "filter_applied",
        session_id: sessionId,
        page: "/products/rugs",
        created_at: new Date().toISOString(),
        properties: { filterType: "color", filterValue: "CamelTestRed" },
      },
    ],
  };

  // Test B: snake_case filter_type / filter_value
  const payloadSnake = {
    session: { session_id: sessionId, started_at: new Date().toISOString(), last_seen_at: new Date().toISOString() },
    events: [
      {
        event_id: `evt_snake_${Date.now()}`,
        event_name: "filter_applied",
        session_id: sessionId,
        page: "/products/rugs",
        created_at: new Date().toISOString(),
        properties: { filter_type: "color", filter_value: "SnakeTestGreen" },
      },
    ],
  };

  // Test C: short type / value
  const payloadShort = {
    session: { session_id: sessionId, started_at: new Date().toISOString(), last_seen_at: new Date().toISOString() },
    events: [
      {
        event_id: `evt_short_${Date.now()}`,
        event_name: "filter_applied",
        session_id: sessionId,
        page: "/products/rugs",
        created_at: new Date().toISOString(),
        properties: { type: "color", value: "ShortTestYellow" },
      },
    ],
  };

  const headers = { "Content-Type": "application/json", Accept: "application/json", Authorization: basicAuth };

  await fetch(`${WP_BASE}/wp-json/hod/v1/analytics/events`, { method: "POST", headers, body: JSON.stringify(payloadCamel) });
  await fetch(`${WP_BASE}/wp-json/hod/v1/analytics/events`, { method: "POST", headers, body: JSON.stringify(payloadSnake) });
  await fetch(`${WP_BASE}/wp-json/hod/v1/analytics/events`, { method: "POST", headers, body: JSON.stringify(payloadShort) });

  const fromDate = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
  const toDate = new Date().toISOString().split("T")[0];

  const res = await fetch(`${WP_BASE}/wp-json/hod/v1/analytics/behavior?from=${fromDate}&to=${toDate}`, { headers: { Accept: "application/json", Authorization: basicAuth } });
  const data = await res.json();

  console.log("Returned filters in behavior query:");
  console.log(JSON.stringify(data.data.filters, null, 2));
}

testPropertyKeys().catch(console.error);
