"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/src/lib/store/useCartStore";
import CartItem from "@/src/components/cart/CartItem";
import OrderSummary from "@/src/components/cart/OrderSummary";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Hydration mismatch prevention

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center pt-32 pb-20 px-6">
        <ShoppingBag size={48} strokeWidth={1} className="text-[var(--text-secondary)] mb-6" />
        <h2 className="font-sans text-3xl md:text-4xl text-[var(--text-primary)] font-light mb-3 tracking-wide leading-normal">Your cart is empty</h2>
        <p className="font-sans text-sm md:text-base font-light text-[var(--text-secondary)] mb-10 max-w-[400px] leading-relaxed">
          Discover our curated collections of premium rugs and curtains.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/products" 
            className="py-[12px] px-[32px] border-[0.5px] border-[var(--border-primary)] text-[var(--text-primary)] font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-[var(--bg-secondary)] whitespace-nowrap text-center"
          >
            Explore Rugs
          </Link>
          <Link 
            href="/products/curtains" 
            className="py-[12px] px-[32px] border-[0.5px] border-[var(--border-primary)] text-[var(--text-primary)] font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-[var(--bg-secondary)] whitespace-nowrap text-center"
          >
            Explore Curtains
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 md:pt-32 md:pb-20 min-h-[calc(100vh-200px)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        <div className="mb-6 md:mb-10 flex items-end justify-between border-b border-[var(--border-secondary)] pb-4">
          <h1 className="font-sans text-xl lg:text-2xl font-light text-[var(--text-primary)] m-0 leading-normal">
            Your Cart
          </h1>
          <span className="font-sans text-[10px] lg:text-xs text-[var(--text-secondary)] uppercase tracking-[0.15em] mb-1">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16">
          {/* Items Column */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex flex-col border-t border-[var(--border-secondary)]">
              {items.map((item) => (
                <CartItem key={item.id} item={item} context="page" />
              ))}
            </div>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-5">
            <OrderSummary />
          </div>
        </div>
        
      </div>
    </div>
  );
}
