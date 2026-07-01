"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./PaymentFailed.css";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const orderKey = searchParams.get("key");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const retryPaymentUrl = orderId && orderKey
    ? `${process.env.NEXT_PUBLIC_WC_BASE_URL || ""}/checkout/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`
    : null;

  if (!isClient) return null;

  return (
    <div className="payment-failed">
      <div className="payment-failed__container">
        <div className="payment-failed__icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>

        <h1 className="payment-failed__title">Payment Failed</h1>
        <p className="payment-failed__subtitle">
          Your order was created but the payment could not be processed.
          You can retry the payment or contact support.
        </p>

        {orderId && (
          <div className="payment-failed__details">
            <div className="payment-failed__detail-row">
              <span className="payment-failed__detail-label">Order Number</span>
              <span className="payment-failed__detail-value">#{orderId}</span>
            </div>
          </div>
        )}

        <div className="payment-failed__actions">
          {retryPaymentUrl && (
            <a href={retryPaymentUrl} className="payment-failed__btn payment-failed__btn--primary">
              Retry Payment
            </a>
          )}
          <Link href="/contact" className="payment-failed__btn payment-failed__btn--secondary">
            Contact Support
          </Link>
          <Link href="/" className="payment-failed__btn payment-failed__btn--secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense>
      <PaymentFailedContent />
    </Suspense>
  );
}
