"use client";

import Link from "next/link";
import { useCartStore } from "@/src/lib/store/useCartStore";
import "./OrderSummary.css";

export default function OrderSummary() {
  const { subtotal, items } = useCartStore();

  if (items.length === 0) return null;

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Order Summary</h3>

      <div className="order-summary__line-items">
        <div className="order-summary__line">
          <span className="order-summary__label">Subtotal</span>
          <span className="order-summary__value">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="order-summary__line">
          <span className="order-summary__label">Shipping</span>
          <span className="order-summary__value">Calculated at checkout</span>
        </div>
        <div className="order-summary__line">
          <span className="order-summary__label">Tax</span>
          <span className="order-summary__value">Included</span>
        </div>
      </div>

      <div className="order-summary__total-line">
        <span className="order-summary__total-label">Total</span>
        <span className="order-summary__total-value">₹{subtotal.toLocaleString("en-IN")}</span>
      </div>

      <button className="order-summary__checkout-btn">
        Proceed to Checkout
      </button>
      <Link href="/products" className="order-summary__continue-btn">
        Continue Shopping
      </Link>
    </div>
  );
}
