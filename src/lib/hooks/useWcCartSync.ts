"use client";

import { useEffect, useRef, useCallback } from "react";
import { useCartStore, CartItem } from "@/src/lib/store/useCartStore";
import { useAuthStore } from "@/src/lib/store/useAuthStore";

/** Debounce interval in ms — avoids rapid-fire sync calls while the user is
 *  actively adding/removing items. */
const SYNC_DEBOUNCE_MS = 2000;

/**
 * Generates a lightweight fingerprint of the cart for change-detection so we
 * skip no-op syncs (e.g. when Zustand rehydrates from localStorage on mount
 * but the cart hasn't actually changed).
 */
function cartFingerprint(items: CartItem[]): string {
  return items
    .map((i) => `${i.productId}:${i.variationId ?? 0}:${i.quantity}`)
    .sort()
    .join("|");
}

/**
 * useWcCartSync
 *
 * Watches the Zustand cart and, for logged-in users, mirrors changes to
 * WooCommerce via `POST /api/cart/sync`.  This keeps the WC cart session in
 * sync so that MailPoet can detect abandoned carts.
 *
 * Design decisions:
 *  - Fire-and-forget: failures are logged but never surface to the user.
 *  - Debounced: waits 2 s after the last cart mutation before syncing.
 *  - Deduplication: skips if the cart fingerprint hasn't changed.
 *  - Auth-guarded: guests are silently ignored.
 */
export function useWcCartSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const items = useCartStore((s) => s.items);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedFingerprintRef = useRef<string>("");
  const isSyncingRef = useRef(false);

  const syncToWc = useCallback(async (cartItems: CartItem[]) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      const payload = {
        items: cartItems.map((i) => ({
          product_id: i.productId,
          variation_id: i.variationId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.warn("[useWcCartSync] Sync failed:", res.status, data);
      }
    } catch (err) {
      console.warn("[useWcCartSync] Sync error:", err);
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Only sync for authenticated users.
    if (!isAuthenticated) return;

    const fp = cartFingerprint(items);

    // Skip if fingerprint hasn't changed (e.g. rehydration from localStorage).
    if (fp === lastSyncedFingerprintRef.current) return;

    // Clear any pending debounce timer.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      lastSyncedFingerprintRef.current = fp;
      syncToWc(items);
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [items, isAuthenticated, syncToWc]);
}
