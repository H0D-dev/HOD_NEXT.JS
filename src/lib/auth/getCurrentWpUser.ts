import { API_CONFIG } from "@/src/lib/api/api";

export interface WpUser {
  id: number;
  email?: string;
  user_email?: string;
  first_name?: string;
  last_name?: string;
  user_display_name?: string;
  roles?: string[];
  [key: string]: any;
}

export async function getCurrentWpUser(
  requestOrHeaders?: Request | Headers | string | null
): Promise<WpUser | null> {
  try {
    let cookieHeader = "";
    let userAgent = "Next.js";

    if (typeof requestOrHeaders === "string") {
      cookieHeader = requestOrHeaders;
    } else if (requestOrHeaders && "headers" in requestOrHeaders && typeof (requestOrHeaders as any).headers?.get === "function") {
      // Request object
      cookieHeader = (requestOrHeaders as Request).headers.get("cookie") || "";
      userAgent = (requestOrHeaders as Request).headers.get("user-agent") || "Next.js";
    } else if (requestOrHeaders && typeof (requestOrHeaders as Headers).get === "function") {
      // Headers object
      cookieHeader = (requestOrHeaders as Headers).get("cookie") || "";
      userAgent = (requestOrHeaders as Headers).get("user-agent") || "Next.js";
    }

    if (!cookieHeader) {
      return null;
    }

    const wpUrl = API_CONFIG.baseUrl || "https://store.houseofdecor.ae";
    const meUrl = `${wpUrl}/wp-json/hod/v1/me`;

    const nonceMatch = cookieHeader.match(/wp_rest_nonce=([^;]+)/);
    const nonce = nonceMatch ? nonceMatch[1] : "";

    const headers: Record<string, string> = {
      "Cookie": cookieHeader,
      "User-Agent": userAgent,
      "Accept": "application/json"
    };

    if (nonce) {
      headers["X-WP-Nonce"] = nonce;
    }

    const wpRes = await fetch(meUrl, {
      method: "GET",
      headers,
      cache: "no-store"
    });

    if (!wpRes.ok) {
      return null;
    }

    const data = await wpRes.json();
    if (data.authenticated && data.user) {
      return data.user;
    }

    return null;
  } catch (error) {
    console.error("Auth helper error:", error);
    return null;
  }
}

