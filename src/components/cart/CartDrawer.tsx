"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/src/lib/store/useCartStore";
import CartItem from "./CartItem";
import "./CartDrawer.css";

const easing = [0.22, 1, 0.36, 1] as const;

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, subtotal, totalItems } = useCartStore();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeDrawer]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className="cart-drawer__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easing }}
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: easing }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
          >
            <div className="cart-drawer__header">
              <h2 className="cart-drawer__title">Your Cart ({totalItems})</h2>
              <button
                className="cart-drawer__close"
                onClick={closeDrawer}
                aria-label="Close cart"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="cart-drawer__body">
              {items.length === 0 ? (
                <div className="cart-drawer__empty">
                  <p>Your cart is empty.</p>
                  <button className="cart-drawer__empty-btn" onClick={closeDrawer}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="cart-drawer__items">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} context="drawer" />
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-drawer__footer">
                <div className="cart-drawer__summary">
                  <span className="cart-drawer__summary-label">Subtotal</span>
                  <span className="cart-drawer__summary-value">AED {subtotal.toLocaleString()}</span>
                </div>
                <p className="cart-drawer__shipping-note">Shipping and taxes calculated at checkout.</p>
                <div className="cart-drawer__actions">
                  <Link href="/cart" className="cart-drawer__btn cart-drawer__btn--secondary" onClick={closeDrawer}>
                    View Cart
                  </Link>
                  <Link href="/checkout" className="cart-drawer__btn cart-drawer__btn--primary" onClick={closeDrawer}>
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
