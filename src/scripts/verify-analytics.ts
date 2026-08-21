import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

async function runVerification() {
  const baseUrl = (process.env.WC_BASE_URL || "https://store.houseofdecor.ae").replace(/\/$/, "");
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  console.log("==================================================");
  console.log("HOD Analytics Endpoints Verification");
  console.log("Target Base URL:", baseUrl);
  console.log("Credentials configured:", Boolean(consumerKey && consumerSecret));
  console.log("==================================================\n");

  // ── 1. TEST POST INGESTION ENDPOINT ──────────────────────────
  console.log("[1/5] Testing Ingestion: POST /wp-json/hod/v1/analytics/events ...");
  const testPayload = {
    session: {
      session_id: "hod_sess_verify_cli_" + Date.now(),
      utm_source: "cli_verification",
      utm_medium: "test",
      utm_campaign: "analytics_rollout",
      referrer: "https://houseofdecor.ae",
      landing_page: "/products/rugs",
    },
    events: [
      {
        event_id: "evt_verify_cli_" + Date.now(),
        event_name: "product_viewed",
        session_id: "hod_sess_verify_cli_" + Date.now(),
        product_id: 1084,
        page: "/products/rugs",
        created_at: new Date().toISOString(),
        properties: {
          color: "Terracotta",
          size: "200x300cm",
        },
      },
    ],
  };

  try {
    const postRes = await fetch(`${baseUrl}/wp-json/hod/v1/analytics/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    const postBody = await postRes.text();
    console.log(`Status: ${postRes.status} ${postRes.statusText}`);
    console.log("Response:", postBody);
  } catch (err) {
    console.error("POST /events failed with error:", err);
  }

  // ── 2. TEST PROTECTED FUNNEL QUERY ───────────────────────────
  console.log("\n[2/5] Testing Funnel Query: GET /wp-json/hod/v1/analytics/funnel ...");
  if (!consumerKey || !consumerSecret) {
    console.warn("Skipping protected read endpoints: Missing WC_CONSUMER_KEY / WC_CONSUMER_SECRET");
    return;
  }

  const basicAuth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const authHeaders = {
    Authorization: `Basic ${basicAuth}`,
    Accept: "application/json",
  };

  const fromDate = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  const toDate = new Date().toISOString().split("T")[0];

  try {
    const funnelRes = await fetch(
      `${baseUrl}/wp-json/hod/v1/analytics/funnel?from=${fromDate}&to=${toDate}`,
      {
        method: "GET",
        headers: authHeaders,
      }
    );

    const funnelBody = await funnelRes.text();
    console.log(`Status: ${funnelRes.status} ${funnelRes.statusText}`);
    console.log("Response:", funnelBody);
  } catch (err) {
    console.error("GET /funnel failed with error:", err);
  }

  // ── 3. TEST PROTECTED VISUALIZER QUERY ───────────────────────
  console.log("\n[3/5] Testing Visualizer Query: GET /wp-json/hod/v1/analytics/visualizer ...");
  try {
    const visRes = await fetch(
      `${baseUrl}/wp-json/hod/v1/analytics/visualizer?from=${fromDate}&to=${toDate}`,
      {
        method: "GET",
        headers: authHeaders,
      }
    );

    const visBody = await visRes.text();
    console.log(`Status: ${visRes.status} ${visRes.statusText}`);
    console.log("Response:", visBody);
  } catch (err) {
    console.error("GET /visualizer failed with error:", err);
  }

  // ── 4. TEST PROTECTED BEHAVIOR QUERY ─────────────────────────
  console.log("\n[4/5] Testing Behavior Query: GET /wp-json/hod/v1/analytics/behavior ...");
  try {
    const behRes = await fetch(
      `${baseUrl}/wp-json/hod/v1/analytics/behavior?from=${fromDate}&to=${toDate}`,
      {
        method: "GET",
        headers: authHeaders,
      }
    );

    const behBody = await behRes.text();
    console.log(`Status: ${behRes.status} ${behRes.statusText}`);
    console.log("Response:", behBody);
  } catch (err) {
    console.error("GET /behavior failed with error:", err);
  }

  // ── 5. TEST PROTECTED ATTRIBUTION QUERY ──────────────────────
  console.log("\n[5/5] Testing Attribution Query: GET /wp-json/hod/v1/analytics/attribution ...");
  try {
    const attrRes = await fetch(
      `${baseUrl}/wp-json/hod/v1/analytics/attribution?from=${fromDate}&to=${toDate}`,
      {
        method: "GET",
        headers: authHeaders,
      }
    );

    const attrBody = await attrRes.text();
    console.log(`Status: ${attrRes.status} ${attrRes.statusText}`);
    console.log("Response:", attrBody);
  } catch (err) {
    console.error("GET /attribution failed with error:", err);
  }

  console.log("\n==================================================");
  console.log("Verification Complete");
  console.log("==================================================");
}

runVerification();
