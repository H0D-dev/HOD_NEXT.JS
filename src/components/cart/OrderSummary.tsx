"use client";

import Link from "next/link";
import { useCartStore } from "@/src/lib/store/useCartStore";
import { formatPrice } from "@/src/lib/utils/price";

export default function OrderSummary() {
  const { subtotal, items, cartCurrency } = useCartStore();

  if (items.length === 0) return null;

  return (
    <div className="sticky top-[100px] bg-[var(--surface-primary)] border border-[var(--border-secondary)] p-6 md:p-8 flex flex-col gap-6 max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar w-full">
      <h3 className="font-serif text-2xl font-normal text-[var(--text-primary)] m-0 pb-4 border-b border-[var(--border-secondary)]">
        Order Summary
      </h3>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center font-sans text-sm">
          <span className="text-[var(--text-secondary)] tracking-wide">Subtotal</span>
          <span className="text-[var(--text-primary)] font-sans text-[15px] font-normal tracking-tight">{formatPrice(subtotal, cartCurrency || "AED")}</span>
        </div>
        <div className="flex justify-between items-center font-sans text-sm">
          <span className="text-[var(--text-secondary)] tracking-wide">Shipping</span>
          <span className="text-[var(--text-primary)] font-sans text-sm">Calculated at checkout</span>
        </div>
        <div className="flex justify-between items-center font-sans text-sm">
          <span className="text-[var(--text-secondary)] tracking-wide">Tax</span>
          <span className="text-[var(--text-primary)] font-sans text-sm">Included</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-5 border-t border-[var(--border-secondary)]">
        <span className="font-sans text-xs uppercase tracking-widest text-[var(--text-secondary)]">Total</span>
        <span className="font-sans text-xl md:text-2xl text-[var(--text-primary)] font-normal tracking-tight">{formatPrice(subtotal, cartCurrency || "AED")}</span>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <Link 
          href="/checkout" 
          className="w-full py-4 px-6 bg-[var(--accent-primary)] text-[#111] border border-[var(--border-thin)] font-sans text-[11px] md:text-xs uppercase tracking-[0.15em] text-center transition-colors hover:bg-[var(--accent-secondary)]"
        >
          Proceed to Checkout
        </Link>
        <Link 
          href="/products" 
          className="w-full py-4 px-6 bg-transparent text-[var(--text-primary)] border border-[var(--border-secondary)] font-sans text-[11px] md:text-xs uppercase tracking-[0.15em] text-center transition-colors hover:bg-[var(--bg-secondary)]"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
