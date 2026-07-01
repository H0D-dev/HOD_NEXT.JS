const WOO_BASE_URL =
  process.env.NEXT_PUBLIC_WC_BASE_URL ||
  "https://mediumslateblue-grasshopper-769837.hostingersite.com";

const STORE_API = `${WOO_BASE_URL}/wp-json/wc/store/v1`;

interface CartItemPayload {
  id: number | string;
  quantity: number;
}

/**
 * Get the current WooCommerce cart (browser session).
 */
export async function getWooCart() {
  const res = await fetch(`${STORE_API}/cart`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to get Woo cart: ${res.status}`);
  }

  return res.json();
}

/**
 * Clear the entire WooCommerce cart (browser session).
 * Removes all items so we start fresh before syncing.
 */
export async function clearWooCart() {
  // Get current cart to find item keys
  const cart = await getWooCart();

  if (!cart.items || cart.items.length === 0) {
    return; // Already empty
  }

  // Remove each item by its key
  for (const item of cart.items) {
    await fetch(`${STORE_API}/cart/remove-item`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: item.key }),
    });
  }
}

/**
 * Add a single item to the WooCommerce cart.
 */
export async function addItemToWooCart(item: CartItemPayload) {
  const res = await fetch(`${STORE_API}/cart/add-item`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: typeof item.id === "string" ? parseInt(item.id, 10) : item.id,
      quantity: item.quantity,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Failed to add item ${item.id}:`, errorText);
    throw new Error(`Failed to add item ${item.id}: ${res.status}`);
  }

  return res.json();
}

/**
 * Sync the entire Zustand cart → WooCommerce cart and redirect to checkout.
 *
 * Flow:
 *  1. Clear existing Woo cart (avoid duplicates / stale items)
 *  2. Add each Zustand item to Woo cart (browser ↔ Woo directly)
 *  3. Verify the sync (optional sanity check)
 *  4. Redirect to Woo checkout page
 */
export async function syncCartAndCheckout(cart: CartItemPayload[]) {
  if (!cart || cart.length === 0) {
    throw new Error("Cart is empty");
  }

  // Step 1: Clear existing Woo cart
  await clearWooCart();

  // Step 2: Add all Zustand items to Woo cart
  for (const item of cart) {
    await addItemToWooCart(item);
  }

  // Step 3 (optional): Verify sync
  const updatedCart = await getWooCart();
  if (!updatedCart.items || updatedCart.items.length === 0) {
    throw new Error("Cart sync failed — Woo cart is empty after sync");
  }

  // Step 4: Redirect to WooCommerce checkout
  redirectToCheckout();
}

/**
 * Redirect the browser to the WooCommerce checkout page.
 */
export function redirectToCheckout() {
  window.location.href = `${WOO_BASE_URL}/checkout`;
}
