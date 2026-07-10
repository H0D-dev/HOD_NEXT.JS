import { API_CONFIG } from "@/src/lib/api/api";

export async function getCurrentWpUser(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const wpUrl = API_CONFIG.baseUrl || "https://store.houseofdecor.ae";
    const meUrl = `${wpUrl}/wp-json/hod/v1/me`;

    const nonceMatch = cookieHeader.match(/wp_rest_nonce=([^;]+)/);
    const nonce = nonceMatch ? nonceMatch[1] : "";

    const headers: Record<string, string> = {
      "Cookie": cookieHeader,
      "User-Agent": request.headers.get("user-agent") || "Next.js",
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
