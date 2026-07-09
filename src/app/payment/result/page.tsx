"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/src/lib/utils/price";
import "./PaymentResult.css";

type PaymentStatus = "loading" | "processing" | "completed" | "failed" | "cancelled" | "timeout" | "invalid_link" | "expired_link";

interface PaymentItem {
  name: string;
  quantity: number;
}

interface PaymentData {
  success: boolean;
  status: string;
  orderNumber?: number;
  currency?: string;
  total?: string;
  paymentMethod?: string;
  retryUrl?: string;
  billingFirstName?: string;
  items?: PaymentItem[];
  error?: string;
}

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const orderKey = searchParams.get("key");

  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    if (!orderId || !orderKey) {
      setStatus("invalid_link");
      return;
    }

    const delays = [2000, 2000, 4000, 6000, 8000, 10000]; // Max 6 polls (~32s total)
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkStatus = async (attemptIndex = 0) => {
      try {
        const res = await fetch(`/api/payment/status?order_id=${orderId}&key=${orderKey}`);
        
        if (res.status === 401) {
          if (isMounted) setStatus("expired_link");
          return;
        }
        
        if (res.status === 404) {
          if (isMounted) setStatus("invalid_link");
          return;
        }
        
        if (!res.ok) {
          throw new Error("Failed to fetch payment status");
        }

        const data: PaymentData = await res.json();
        
        if (data.success && data.status) {
          const lowerStatus = data.status.toLowerCase();
          
          if (["completed", "processing", "failed", "cancelled"].includes(lowerStatus)) {
            if (isMounted) {
              setStatus(lowerStatus as PaymentStatus);
              setPaymentData(data);
            }
            return;
          }
        }

        // If pending or another state, wait and retry
        if (attemptIndex < delays.length) {
          timeoutId = setTimeout(() => {
            if (isMounted) checkStatus(attemptIndex + 1);
          }, delays[attemptIndex]);
        } else {
          if (isMounted) setStatus("timeout");
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
        if (attemptIndex < delays.length) {
          timeoutId = setTimeout(() => {
            if (isMounted) checkStatus(attemptIndex + 1);
          }, delays[attemptIndex]);
        } else {
          if (isMounted) setStatus("timeout");
        }
      }
    };

    // Initial check
    checkStatus(0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [orderId, orderKey]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <div className="payment-result__icon-wrapper payment-result__icon-wrapper--loading">
              <Loader2 className="payment-result__icon payment-result__icon--spin" />
            </div>
            <h1 className="payment-result__title">Checking your payment...</h1>
            <p className="payment-result__message">Please wait...</p>
          </>
        );

      case "timeout":
        return (
          <>
            <div className="payment-result__icon-wrapper payment-result__icon-wrapper--loading">
              <Clock className="payment-result__icon" />
            </div>
            <h1 className="payment-result__title">Still waiting for payment confirmation...</h1>
            <p className="payment-result__message">
              It's taking longer than usual to confirm your payment. You can refresh the page or check your email for the order confirmation.
            </p>
            <button onClick={() => window.location.reload()} className="payment-result__button">
              Refresh
            </button>
          </>
        );

      case "processing":
      case "completed":
        return (
          <>
            <div className="payment-result__icon-wrapper payment-result__icon-wrapper--success">
              <CheckCircle2 className="payment-result__icon" />
            </div>
            <h1 className="payment-result__title">✓ Payment Successful</h1>
            <p className="payment-result__message">
              {paymentData?.billingFirstName
                ? `Thank you for your purchase, ${paymentData.billingFirstName}.`
                : "Thank you for your purchase."}
            </p>
            
            {paymentData && (
              <div className="payment-result__order-details">
                {paymentData.orderNumber && (
                  <div className="payment-result__detail-row payment-result__detail-row--header">
                    <span className="payment-result__detail-label">Order #{paymentData.orderNumber}</span>
                  </div>
                )}
                
                {paymentData.items && paymentData.items.length > 0 && (
                  <div className="payment-result__items">
                    {paymentData.items.map((item, i) => (
                      <div key={i} className="payment-result__detail-row">
                        <span className="payment-result__detail-label">{item.name}</span>
                        <span className="payment-result__detail-value">Qty {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {paymentData.total && paymentData.currency && (
                  <div className="payment-result__detail-row payment-result__detail-row--total">
                    <span className="payment-result__detail-label">Amount Paid</span>
                    <span className="payment-result__detail-value">
                      {formatPrice(parseFloat(paymentData.total), paymentData.currency)}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <p className="payment-result__message payment-result__message--small">
              A confirmation email has been sent.
            </p>
            
            <div className="payment-result__actions">
              <Link href="/" className="payment-result__button payment-result__button--outline">
                Continue Shopping
              </Link>
              {paymentData?.orderNumber && (
                <Link href={`/account?tab=orders`} className="payment-result__button">
                  View Order
                </Link>
              )}
            </div>
          </>
        );

      case "failed":
        return (
          <>
            <div className="payment-result__icon-wrapper payment-result__icon-wrapper--failed">
              <XCircle className="payment-result__icon" />
            </div>
            <h1 className="payment-result__title">Payment Failed</h1>
            <p className="payment-result__message">
              Your payment could not be completed.
            </p>
            {paymentData?.retryUrl ? (
              <a href={paymentData.retryUrl} className="payment-result__button">
                Retry Payment
              </a>
            ) : (
              <Link href="/checkout" className="payment-result__button">
                Return to Checkout
              </Link>
            )}
          </>
        );

      case "cancelled":
        return (
          <>
            <div className="payment-result__icon-wrapper payment-result__icon-wrapper--cancelled">
              <AlertCircle className="payment-result__icon" />
            </div>
            <h1 className="payment-result__title">Payment Cancelled</h1>
            <p className="payment-result__message">
              Your order was not completed.
            </p>
            <Link href="/cart" className="payment-result__button">
              Return to Cart
            </Link>
          </>
        );

      case "invalid_link":
        return (
          <>
            <div className="payment-result__icon-wrapper payment-result__icon-wrapper--cancelled">
              <AlertCircle className="payment-result__icon" />
            </div>
            <h1 className="payment-result__title">We couldn't find this order.</h1>
            <Link href="/" className="payment-result__button" style={{ marginTop: '2rem' }}>
              Return to Store
            </Link>
          </>
        );

      case "expired_link":
        return (
          <>
            <div className="payment-result__icon-wrapper payment-result__icon-wrapper--cancelled">
              <AlertCircle className="payment-result__icon" />
            </div>
            <h1 className="payment-result__title">Invalid Link</h1>
            <p className="payment-result__message">
              This payment link is invalid or has expired.
            </p>
            <Link href="/" className="payment-result__button" style={{ marginTop: '2rem' }}>
              Return to Store
            </Link>
          </>
        );
    }
  };

  return (
    <div className="payment-result__wrapper">
      <div className="payment-result__card">
        {renderContent()}
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="payment-result__wrapper">
        <div className="payment-result__card">
          <div className="payment-result__icon-wrapper payment-result__icon-wrapper--loading">
            <Loader2 className="payment-result__icon payment-result__icon--spin" />
          </div>
          <h1 className="payment-result__title">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
