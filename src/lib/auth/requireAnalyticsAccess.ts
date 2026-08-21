import { API_CONFIG } from "@/src/lib/api/api";
import { getCurrentWpUser, WpUser } from "@/src/lib/auth/getCurrentWpUser";
import { headers } from "next/headers";

export interface AnalyticsUser extends WpUser {
  id: number;
  role: string;
}

export type AnalyticsAuthResult =
  | { authorized: true; status: 200; user: AnalyticsUser }
  | { authorized: false; status: 401; error: string; user?: null }
  | { authorized: false; status: 403; error: string; user?: null };

// ── In-Memory Role Cache (60s TTL) ───────────────────────────
// Caches customer role lookups briefly to prevent hammering WooCommerce
// during rapid analytics queries while preserving RBAC authorization.
interface CachedRole {
  role: string;
  expiresAt: number;
}

const roleCache = new Map<number, CachedRole>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function getWooCommerceCustomerRole(userId: number): Promise<string | null> {
  const now = Date.now();
  const cached = roleCache.get(userId);

  if (cached && cached.expiresAt > now) {
    return cached.role;
  }

  try {
    const baseUrl = API_CONFIG.baseUrl || "https://store.houseofdecor.ae";
    const consumerKey = API_CONFIG.consumerKey;
    const consumerSecret = API_CONFIG.consumerSecret;

    if (!consumerKey || !consumerSecret) {
      console.error("[RBAC] Missing WooCommerce API credentials in server environment");
      return null;
    }

    const customerUrl = `${baseUrl}/wp-json/wc/v3/customers/${userId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    const res = await fetch(customerUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Next.js-RBAC-Analytics-Validator/1.0",
        "Accept": "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      console.warn(`[RBAC] Failed to fetch customer role for user ${userId}. Status: ${res.status}`);
      return null;
    }

    const customerData = await res.json();
    const role = customerData.role || null;

    if (role && typeof role === "string") {
      roleCache.set(userId, {
        role,
        expiresAt: now + CACHE_TTL_MS
      });
      return role;
    }

    return null;
  } catch (error) {
    console.error("[RBAC] Error querying WooCommerce customer role:", error);
    return null;
  }
}

/**
 * Validates whether the incoming request/headers belong to an authenticated WordPress administrator.
 *
 * Flow:
 * 1. Resolves authenticated WordPress user via /wp-json/hod/v1/me (passing cookies & nonce)
 * 2. If unauthenticated -> 401 Unauthorized
 * 3. Retrieves WooCommerce customer record via /wp-json/wc/v3/customers/{userId} using server keys
 * 4. If role !== "administrator" -> 403 Forbidden
 * 5. If role === "administrator" -> 200 OK (Access Granted)
 */
export async function validateAnalyticsAccess(
  requestOrHeaders?: Request | Headers | string | null
): Promise<AnalyticsAuthResult> {
  // 1. Resolve current WordPress user
  const wpUser = await getCurrentWpUser(requestOrHeaders);

  if (!wpUser || !wpUser.id) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized: Authentication required to access the analytics module."
    };
  }

  // 2. Retrieve WooCommerce customer role server-side
  const role = await getWooCommerceCustomerRole(wpUser.id);

  if (!role) {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Unable to verify user authorization permissions."
    };
  }

  // 3. Strict RBAC check: Only "administrator" role is permitted
  if (role !== "administrator") {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Administrator privileges are required to access this resource."
    };
  }

  return {
    authorized: true,
    status: 200,
    user: {
      ...wpUser,
      id: wpUser.id,
      role
    }
  };
}

/**
 * Reusable RBAC helper for API Route Handlers.
 * Example usage:
 * ```ts
 * export async function GET(request: Request) {
 *   const auth = await requireAnalyticsAccess(request);
 *   if (!auth.authorized) {
 *     return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
 *   }
 *   // Process analytics data...
 * }
 * ```
 */
export async function requireAnalyticsAccess(request: Request): Promise<AnalyticsAuthResult> {
  return validateAnalyticsAccess(request);
}

/**
 * Reusable RBAC helper for Next.js App Router Server Components.
 * Example usage in `src/app/admin/analytics/page.tsx`:
 * ```ts
 * export default async function AnalyticsPage() {
 *   const auth = await requireAnalyticsAccessServer();
 *   if (!auth.authorized) {
 *     if (auth.status === 401) redirect("/login?redirect=/admin/analytics");
 *     return <AccessDenied error={auth.error} />;
 *   }
 *   return <AnalyticsDashboard user={auth.user} />;
 * }
 * ```
 */
export async function requireAnalyticsAccessServer(): Promise<AnalyticsAuthResult> {
  try {
    const headerList = await headers();
    return validateAnalyticsAccess(headerList);
  } catch (error) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized: Failed to resolve request headers."
    };
  }
}
