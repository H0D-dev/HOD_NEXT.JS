"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./OrderSuccess.css";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="order-success">
      <div className="order-success__container">
        <div className="order-success__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l2.5 2.5L16 9" />
          </svg>
        </div>

        <h1 className="order-success__title">Order Confirmed</h1>
        <p className="order-success__subtitle">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {orderId && (
          <div className="order-success__details">
            <div className="order-success__detail-row">
              <span className="order-success__detail-label">Order Number</span>
              <span className="order-success__detail-value">#{orderId}</span>
            </div>
            <p className="order-success__note">
              A confirmation email will be sent to your registered email address.
            </p>
          </div>
        )}

        <div className="order-success__actions">
          <Link href="/products/rugs" className="order-success__btn order-success__btn--primary">
            Continue Shopping
          </Link>
          <Link href="/" className="order-success__btn order-success__btn--secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
