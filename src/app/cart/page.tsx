"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/src/lib/store/useCartStore";
import CartItem from "@/src/components/cart/CartItem";
import OrderSummary from "@/src/components/cart/OrderSummary";
import "./CartPage.css";

export default function CartPage() {
  const { items } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Hydration mismatch prevention

  if (items.length === 0) {
    return (
      <div className="cart-page__empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="cart-page__empty-icon">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="square" />
        </svg>
        <h2 className="cart-page__empty-title">Your cart is empty</h2>
        <p className="cart-page__empty-text">Discover our curated collections of premium rugs and curtains.</p>
        <div className="cart-page__empty-actions">
          <Link href="/products/rugs" className="cart-page__empty-btn">
            Explore Rugs
          </Link>
          <Link href="/products/curtains" className="cart-page__empty-btn">
            Explore Curtains
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">Shopping Cart</h1>
        </div>

        <div className="cart-page__layout">
          <div className="cart-page__items-column">
            <div className="cart-page__items-list">
              {items.map((item) => (
                <CartItem key={item.id} item={item} context="page" />
              ))}
            </div>
          </div>

          <div className="cart-page__summary-column">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
