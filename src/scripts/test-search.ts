/**
 * Test Search Event Ingestion in WordPress
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

const WP_BASE = (process.env.WC_BASE_URL || "https://store.houseofdecor.ae").replace(/\/$/, "");
const CK = process.env.WC_CONSUMER_KEY || "";
const CS = process.env.WC_CONSUMER_SECRET || "";
const basicAuth = CK && CS ? `Basic ${Buffer.from(`${CK}:${CS}`).toString("base64")}` : "";

async function testSearchIngestion() {
  const sessionId = `hod_sess_search_test_${Date.now()}`;

  const payload = {
    session: { session_id: sessionId, started_at: new Date().toISOString(), last_seen_at: new Date().toISOString() },
    events: [
      {
        event_id: `evt_search_1_${Date.now()}`,
        event_name: "search_performed",
        session_id: sessionId,
        page: "/",
        created_at: new Date().toISOString(),
        properties: { query: "silk rug", search_query: "silk rug", resultCount: 5, result_count: 5 },
      },
      {
        event_id: `evt_search_2_${Date.now()}`,
        event_name: "search_no_results",
        session_id: sessionId,
        page: "/",
        created_at: new Date().toISOString(),
        properties: { query: "velvet modern sofa", search_query: "velvet modern sofa", resultCount: 0, result_count: 0 },
      },
    ],
  };

  const headers = { "Content-Type": "application/json", Accept: "application/json", Authorization: basicAuth };

  const ingestRes = await fetch(`${WP_BASE}/wp-json/hod/v1/analytics/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  console.log("Search ingest status:", ingestRes.status);
  console.log("Search ingest body:", await ingestRes.text());

  const fromDate = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
  const toDate = new Date().toISOString().split("T")[0];

  const res = await fetch(`${WP_BASE}/wp-json/hod/v1/analytics/behavior?from=${fromDate}&to=${toDate}`, {
    headers: { Accept: "application/json", Authorization: basicAuth },
  });
  const data = await res.json();
  console.log("\nWordPress behavior endpoint response:");
  console.log(JSON.stringify(data.data, null, 2));
}

testSearchIngestion().catch(console.error);
