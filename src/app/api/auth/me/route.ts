import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api";
import { getWooCommerceCustomerRole } from "@/src/lib/auth/requireAnalyticsAccess";

export async function GET(request: Request) {
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

    let data;
    try {
      data = await wpRes.json();
    } catch (e) {
      data = { error: "Failed to parse JSON from WP" };
    }

    if (data.authenticated && data.user) {
      let role = data.user.role || (Array.isArray(data.user.roles) ? data.user.roles[0] : null);
      
      // If role is missing or generic "customer", check WooCommerce customer role directly
      if (!role || role.toLowerCase() !== "administrator") {
        try {
          const wcRole = await getWooCommerceCustomerRole(data.user.id);
          if (wcRole) {
            role = wcRole;
          }
        } catch (e) {
          // Keep existing role if lookup fails
        }
      }

      const roles: string[] = Array.isArray(data.user.roles) ? [...data.user.roles] : (role ? [role] : []);
      if (role && !roles.includes(role)) {
        roles.push(role);
      }

      data.user.role = role || "customer";
      data.user.roles = roles;
    }

    // Forward the exact response and status code from WP directly to the frontend
    return NextResponse.json(data, { status: wpRes.status });

  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
