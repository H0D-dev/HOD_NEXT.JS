import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api";
import { AnalyticsBatchPayload } from "@/src/lib/analytics/types";

/**
 * Public Storefront Telemetry Ingestion Proxy
 * Receives batched analytics events from the browser and forwards them to WordPress MySQL.
 * Forwards authentication cookies/nonces so WordPress can resolve the user session.
 * Does NOT require admin RBAC (storefront guests and customers must be able to emit telemetry).
 */
export async function POST(request: Request) {
  try {
    const payload: AnalyticsBatchPayload = await request.json();

    if (!payload || !payload.session || !Array.isArray(payload.events)) {
      return NextResponse.json(
        { success: false, error: "Invalid analytics batch payload" },
        { status: 400 }
      );
    }

    // Extract incoming cookies & headers to forward to WordPress
    const cookieHeader = request.headers.get("cookie") || "";
    const userAgent = request.headers.get("user-agent") || "Next.js Analytics Proxy";
    const nonceMatch = cookieHeader.match(/wp_rest_nonce=([^;]+)/);
    const nonce = nonceMatch ? nonceMatch[1] : "";

    const baseUrl = (API_CONFIG.baseUrl || "https://store.houseofdecor.ae").replace(/\/$/, "");
    const targetUrl = `${baseUrl}/wp-json/hod/v1/analytics/events`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": userAgent,
      "Accept": "application/json",
    };

    // Attach Basic Auth credentials from API_CONFIG so WordPress REST API allows the ingestion
    if (API_CONFIG.consumerKey && API_CONFIG.consumerSecret) {
      const token = Buffer.from(`${API_CONFIG.consumerKey}:${API_CONFIG.consumerSecret}`).toString("base64");
      headers["Authorization"] = `Basic ${token}`;
    }

    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }
    if (nonce) {
      headers["X-WP-Nonce"] = nonce;
    }

    // Non-blocking forwarding to WordPress ingestion endpoint
    const wpRes = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!wpRes.ok) {
      const errorText = await wpRes.text();
      console.warn(
        `[Analytics Proxy] WP Ingestion FAILED — target: ${targetUrl} | status: ${wpRes.status} | events: ${payload.events.length} | types: [${payload.events.map((e) => e.event_name).join(", ")}]`,
        errorText.slice(0, 500)
      );
    }

    // Return immediate non-blocking 200 acknowledgement to browser
    return NextResponse.json({ success: true, count: payload.events.length });
  } catch (error) {
    console.error("[Analytics Proxy] Ingestion error:", error instanceof Error ? error.message : error);
    // Never return a fatal 500 error that breaks client storefront execution
    return NextResponse.json({ success: false, error: "Ingestion failed silently" }, { status: 200 });
  }
}
