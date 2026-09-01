import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api";
import { getCurrentWpUser } from "@/src/lib/auth/getCurrentWpUser";

interface SyncItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
}

interface SyncBody {
  items: SyncItem[];
}

/**
 * POST /api/cart/sync
 *
 * Mirrors the Next.js Zustand cart into the WooCommerce cart session via the
 * WC Store API.  This is required so that MailPoet can detect an abandoned
 * cart and fire its automation trigger.
 *
 * Flow:
 *  1. Authenticate the request (logged-in WP users only).
 *  2. GET  /wc/store/v1/cart          → fetch current WC cart + nonce.
 *  3. POST /wc/store/v1/cart/remove-item  for every existing item.
 *  4. POST /wc/store/v1/cart/add-item     for every Zustand item.
 *
 * The endpoint is idempotent — every call replaces the entire WC cart.
 */
export async function POST(request: Request) {
  try {
    // ── 1. Auth guard — guests get a silent 401 ──
    const user = await getCurrentWpUser(request);
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body: SyncBody = await request.json();
    const items = body.items ?? [];

    const wcBaseUrl = (API_CONFIG.baseUrl || "").replace(/\/$/, "");
    const storeApi = `${wcBaseUrl}/wp-json/wc/store/v1`;

    // Forward the browser's cookies so WC can identify the session/user.
    const cookieHeader = request.headers.get("cookie") || "";
    const userAgent =
      request.headers.get("user-agent") ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      "User-Agent": userAgent,
      Accept: "application/json",
    };

    // ── 2. GET current WC cart (also gives us the nonce) ──
    const cartRes = await fetch(`${storeApi}/cart`, {
      method: "GET",
      headers: baseHeaders,
      cache: "no-store",
    });

    if (!cartRes.ok) {
      const errText = await cartRes.text();
      console.error("[cart/sync] Failed to fetch WC cart:", cartRes.status, errText);
      return NextResponse.json(
        { success: false, error: "Failed to fetch WC cart" },
        { status: 502 }
      );
    }

    const cart = await cartRes.json();

    // Extract nonce and cart-token from response headers (WC Store API returns them here).
    const nonce = cartRes.headers.get("nonce") || cartRes.headers.get("x-wc-store-api-nonce") || "";
    const cartToken = cartRes.headers.get("cart-token") || "";

    // Collect any Set-Cookie headers from WC so we can forward them back to
    // the browser — this keeps the WC session alive across requests.
    const setCookies: string[] = [];
    const collectSetCookies = (res: Response) => {
      const cookies = res.headers.getSetCookie?.() ?? [];
      cookies.forEach((c) => setCookies.push(c));
    };
    collectSetCookies(cartRes);

    // Build headers for mutation requests (include Nonce and Cart-Token).
    const mutationHeaders: Record<string, string> = {
      ...baseHeaders,
      ...(nonce ? { Nonce: nonce, "X-WC-Store-API-Nonce": nonce } : {}),
      ...(cartToken ? { "Cart-Token": cartToken } : {}),
    };

    // ── 3. Remove all existing items from the WC cart ──
    if (cart.items && cart.items.length > 0) {
      for (const existingItem of cart.items) {
        try {
          const removeRes = await fetch(`${storeApi}/cart/remove-item`, {
            method: "POST",
            headers: mutationHeaders,
            body: JSON.stringify({ key: existingItem.key }),
          });
          collectSetCookies(removeRes);

          if (!removeRes.ok) {
            const errText = await removeRes.text();
            console.warn(
              `[cart/sync] Failed to remove item ${existingItem.key}:`,
              removeRes.status,
              errText
            );
          }
        } catch (removeErr) {
          console.warn(`[cart/sync] Error removing item ${existingItem.key}:`, removeErr);
        }
      }
    }

    // ── 4. Add all Zustand items ──
    let addedCount = 0;
    for (const item of items) {
      try {
        const addPayload: Record<string, number> = {
          id: item.variation_id || item.product_id,
          quantity: item.quantity,
        };

        const addRes = await fetch(`${storeApi}/cart/add-item`, {
          method: "POST",
          headers: mutationHeaders,
          body: JSON.stringify(addPayload),
        });
        collectSetCookies(addRes);

        if (!addRes.ok) {
          const errText = await addRes.text();
          console.warn(
            `[cart/sync] Failed to add product ${item.product_id}:`,
            addRes.status,
            errText
          );
        } else {
          addedCount++;
        }
      } catch (addErr) {
        console.warn(`[cart/sync] Error adding product ${item.product_id}:`, addErr);
      }
    }

    // ── 5. Build response and forward WC Set-Cookie headers ──
    const response = NextResponse.json({
      success: true,
      synced: addedCount,
      total: items.length,
    });

    // Forward Set-Cookie headers from WC so the browser picks up the WC
    // session cookie — critical for MailPoet to link cart ↔ subscriber.
    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (error) {
    console.error("[cart/sync] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
