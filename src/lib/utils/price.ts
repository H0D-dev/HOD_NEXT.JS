export function formatPrice(price: number, currency: string) {
  // Using en-US ensures the currency symbol ($, €, ₹, AED) is consistently 
  // placed on the left side (e.g. €3,000, ₹3,000, AED 3,000).
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);
}
