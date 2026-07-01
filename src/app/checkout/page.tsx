"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/src/lib/store/useCartStore";
import "./Checkout.css";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  order_notes: string;
  payment_method: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ValidationError {
  product_id: number;
  type: string;
  message: string;
  corrected_price?: number;
  available_stock?: number;
}

const initialFormData: FormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  country: "AE",
  postcode: "",
  order_notes: "",
  payment_method: "online",
};

const COUNTRIES = [
  // Middle East (default region)
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "OM", name: "Oman" },
  { code: "BH", name: "Bahrain" },
  { code: "KW", name: "Kuwait" },
  { code: "QA", name: "Qatar" },
  { code: "IQ", name: "Iraq" },
  { code: "JO", name: "Jordan" },
  { code: "LB", name: "Lebanon" },
  // South Asia
  { code: "IN", name: "India" },
  { code: "PK", name: "Pakistan" },
  { code: "BD", name: "Bangladesh" },
  { code: "LK", name: "Sri Lanka" },
  { code: "NP", name: "Nepal" },
  // Europe
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "RO", name: "Romania" },
  { code: "HU", name: "Hungary" },
  // North America
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  // Asia Pacific
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  // Africa
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "EG", name: "Egypt" },
  { code: "MA", name: "Morocco" },
  { code: "GH", name: "Ghana" },
  { code: "TZ", name: "Tanzania" },
  // South America
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  // Other
  { code: "TR", name: "Turkey" },
  { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" },
  { code: "IL", name: "Israel" },
];

function generateSessionId() {
  return `cs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [checkoutSessionId] = useState(() => generateSessionId());

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [formErrors]);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!formData.first_name.trim()) errors.first_name = "Required";
    if (!formData.last_name.trim()) errors.last_name = "Required";
    if (!formData.email.trim()) errors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email";
    if (!formData.phone.trim()) errors.phone = "Required";
    if (!formData.address_1.trim()) errors.address_1 = "Required";
    if (!formData.city.trim()) errors.city = "Required";
    if (!formData.country.trim()) errors.country = "Required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handlePlaceOrder = useCallback(async () => {
    if (!validateForm()) return;
    if (items.length === 0) return;

    setOrderError(null);
    setValidationErrors([]);

    // Step 1: Validate cart
    setIsValidating(true);
    try {
      const validateRes = await fetch("/api/validate-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            frontend_price: item.price,
          })),
        }),
      });

      const validateData = await validateRes.json();

      if (!validateData.valid) {
        setValidationErrors(validateData.errors || []);
        setIsValidating(false);
        return;
      }
    } catch {
      setOrderError("Failed to validate cart. Please try again.");
      setIsValidating(false);
      return;
    }
    setIsValidating(false);

    // Step 2: Place order
    setIsPlacingOrder(true);
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
          },
          shipping: {
            address_1: formData.address_1,
            address_2: formData.address_2,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postcode: formData.postcode,
          },
          payment_method: formData.payment_method,
          cart: items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
          order_notes: formData.order_notes,
          checkout_session_id: checkoutSessionId,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        setOrderError(orderData.error || "Failed to create order");
        setIsPlacingOrder(false);
        return;
      }

      // Clear cart after successful order
      clearCart();

      // Route based on payment method
      if (orderData.paymentUrl) {
        // Redirect to WooCommerce payment gateway (online payment)
        window.location.href = orderData.paymentUrl;
      } else {
        // Bank transfer → success page
        router.push(`/order-success?id=${orderData.orderId}`);
      }
    } catch {
      setOrderError("Failed to place order. Please try again.");
      setIsPlacingOrder(false);
    }
  }, [validateForm, items, formData, checkoutSessionId, clearCart, router]);

  if (!isClient) return null;

  if (items.length === 0) {
    return (
      <div className="checkout__empty">
        <h2 className="checkout__empty-title">Your cart is empty</h2>
        <p className="checkout__empty-text">Add some products before checking out.</p>
        <Link href="/products/rugs" className="checkout__empty-link">
          Browse Products
        </Link>
      </div>
    );
  }

  const isProcessing = isValidating || isPlacingOrder;

  // Get variant display text for summary
  const getVariantText = (item: typeof items[0]) => {
    if (!item.variant) return null;
    const parts: string[] = [];
    if (item.variant.size) parts.push(item.variant.size);
    if (item.variant.color) parts.push(item.variant.color);
    if (item.variant.fabric) parts.push(item.variant.fabric);
    if (item.variant.width && item.variant.height) parts.push(`${item.variant.width} × ${item.variant.height}`);
    return parts.length > 0 ? parts.join(" · ") : null;
  };

  return (
    <div className="checkout">
      <div className="checkout__container">
        <div className="checkout__header">
          <h1 className="checkout__title">Checkout</h1>
        </div>

        {/* Validation Errors Alert */}
        {validationErrors.length > 0 && (
          <div className="checkout__alert">
            <p className="checkout__alert-title">Some items in your cart need attention:</p>
            {validationErrors.map((err, i) => (
              <p key={i} className="checkout__alert-item">
                {err.message}
                {err.corrected_price !== undefined && ` — New price: AED ${err.corrected_price.toLocaleString()}`}
                {err.available_stock !== undefined && ` — Available: ${err.available_stock}`}
              </p>
            ))}
          </div>
        )}

        {orderError && (
          <div className="checkout__alert">
            <p className="checkout__alert-title">{orderError}</p>
          </div>
        )}

        <div className="checkout__layout">
          {/* ── Left: Form ── */}
          <div className="checkout__form-column">
            {/* Billing */}
            <div className="checkout__section">
              <h2 className="checkout__section-title">Billing Details</h2>
              <div className="checkout__form-grid checkout__form-grid--2col">
                <div className="checkout__field">
                  <label className="checkout__label checkout__label--required" htmlFor="first_name">First Name</label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    className={`checkout__input ${formErrors.first_name ? "checkout__input--error" : ""}`}
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="John"
                  />
                  {formErrors.first_name && <span className="checkout__error-text">{formErrors.first_name}</span>}
                </div>

                <div className="checkout__field">
                  <label className="checkout__label checkout__label--required" htmlFor="last_name">Last Name</label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    className={`checkout__input ${formErrors.last_name ? "checkout__input--error" : ""}`}
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Doe"
                  />
                  {formErrors.last_name && <span className="checkout__error-text">{formErrors.last_name}</span>}
                </div>

                <div className="checkout__field">
                  <label className="checkout__label checkout__label--required" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`checkout__input ${formErrors.email ? "checkout__input--error" : ""}`}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && <span className="checkout__error-text">{formErrors.email}</span>}
                </div>

                <div className="checkout__field">
                  <label className="checkout__label checkout__label--required" htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`checkout__input ${formErrors.phone ? "checkout__input--error" : ""}`}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+971 50 123 4567 / +1 555 123 4567"
                  />
                  {formErrors.phone && <span className="checkout__error-text">{formErrors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="checkout__section">
              <h2 className="checkout__section-title">Shipping Address</h2>
              <div className="checkout__form-grid checkout__form-grid--2col">
                <div className="checkout__field checkout__field--full">
                  <label className="checkout__label checkout__label--required" htmlFor="address_1">Street Address</label>
                  <input
                    id="address_1"
                    name="address_1"
                    type="text"
                    className={`checkout__input ${formErrors.address_1 ? "checkout__input--error" : ""}`}
                    value={formData.address_1}
                    onChange={handleInputChange}
                    placeholder="Street address, P.O. box"
                  />
                  {formErrors.address_1 && <span className="checkout__error-text">{formErrors.address_1}</span>}
                </div>

                <div className="checkout__field checkout__field--full">
                  <label className="checkout__label" htmlFor="address_2">Apartment / Suite</label>
                  <input
                    id="address_2"
                    name="address_2"
                    type="text"
                    className="checkout__input"
                    value={formData.address_2}
                    onChange={handleInputChange}
                    placeholder="Apt 401"
                  />
                </div>

                <div className="checkout__field">
                  <label className="checkout__label checkout__label--required" htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className={`checkout__input ${formErrors.city ? "checkout__input--error" : ""}`}
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Dubai"
                  />
                  {formErrors.city && <span className="checkout__error-text">{formErrors.city}</span>}
                </div>

                <div className="checkout__field">
                  <label className="checkout__label" htmlFor="state">State / Province / Region</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className="checkout__input"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State, province, or region"
                  />
                </div>

                <div className="checkout__field">
                  <label className="checkout__label checkout__label--required" htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    className={`checkout__select ${formErrors.country ? "checkout__input--error" : ""}`}
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  {formErrors.country && <span className="checkout__error-text">{formErrors.country}</span>}
                </div>

                <div className="checkout__field">
                  <label className="checkout__label" htmlFor="postcode">ZIP / Postal Code</label>
                  <input
                    id="postcode"
                    name="postcode"
                    type="text"
                    className="checkout__input"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="00000"
                  />
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="checkout__section">
              <h2 className="checkout__section-title">Order Notes</h2>
              <div className="checkout__field">
                <textarea
                  id="order_notes"
                  name="order_notes"
                  className="checkout__textarea"
                  value={formData.order_notes}
                  onChange={handleInputChange}
                  placeholder="Special instructions for your order (optional)"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout__section">
              <h2 className="checkout__section-title">Payment Method</h2>
              <div className="checkout__payment-options">
                <div
                  className={`checkout__payment-option ${formData.payment_method === "online" ? "checkout__payment-option--active" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, payment_method: "online" }))}
                >
                  <div className="checkout__payment-radio">
                    <div className="checkout__payment-radio-dot" />
                  </div>
                  <div className="checkout__payment-info">
                    <p className="checkout__payment-title">Online Payment</p>
                    <p className="checkout__payment-desc">Credit/Debit Card, Apple Pay, etc.</p>
                  </div>
                </div>

                <div
                  className={`checkout__payment-option ${formData.payment_method === "bacs" ? "checkout__payment-option--active" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, payment_method: "bacs" }))}
                >
                  <div className="checkout__payment-radio">
                    <div className="checkout__payment-radio-dot" />
                  </div>
                  <div className="checkout__payment-info">
                    <p className="checkout__payment-title">Direct Bank Transfer</p>
                    <p className="checkout__payment-desc">Transfer to our bank account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="checkout__summary">
            <h3 className="checkout__summary-title">Order Summary</h3>

            <div className="checkout__summary-items">
              {items.map((item) => (
                <div key={item.id} className="checkout__summary-item">
                  <div className="checkout__summary-item-image">
                    <span className="checkout__summary-item-badge">{item.quantity}</span>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="checkout__summary-item-details">
                    <p className="checkout__summary-item-name">{item.name}</p>
                    {getVariantText(item) && (
                      <p className="checkout__summary-item-variant">{getVariantText(item)}</p>
                    )}
                  </div>
                  <span className="checkout__summary-item-price">
                    AED {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout__summary-line">
              <span className="checkout__summary-label">Subtotal</span>
              <span className="checkout__summary-value">AED {subtotal.toLocaleString()}</span>
            </div>
            <div className="checkout__summary-line">
              <span className="checkout__summary-label">Shipping</span>
              <span className="checkout__summary-value">Calculated by store</span>
            </div>
            <div className="checkout__summary-line">
              <span className="checkout__summary-label">Tax</span>
              <span className="checkout__summary-value">Included</span>
            </div>

            <div className="checkout__summary-total">
              <span className="checkout__summary-total-label">Total</span>
              <span className="checkout__summary-total-value">AED {subtotal.toLocaleString()}</span>
            </div>

            <button
              className="checkout__place-order"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isValidating && <><span className="checkout__spinner" /> Validating...</>}
              {isPlacingOrder && <><span className="checkout__spinner" /> Placing Order...</>}
              {!isProcessing && "Place Order"}
            </button>

            <div className="checkout__secure">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
