"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/src/lib/store/useCartStore";
import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { formatPrice } from "@/src/lib/utils/price";
import { ShoppingBag } from "lucide-react";

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
  const { items, subtotal, clearCart, cartCurrency } = useCartStore();
  const { user } = useAuthStore();
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
    // Prepopulate user data if authenticated
    if (user) {
      setFormData((prev) => ({
        ...prev,
        first_name: prev.first_name || user.first_name || "",
        last_name: prev.last_name || user.last_name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

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
          currency: cartCurrency || "AED",
          items: items.map((item) => ({
            product_id: item.productId,
            variation_id: item.variationId,
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
          currency: cartCurrency || "AED",
          cart: items.map((item) => ({
            product_id: item.productId,
            variation_id: item.variationId,
            quantity: item.quantity,
            price: item.price,
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20 px-6">
        <ShoppingBag size={48} strokeWidth={1} className="text-[var(--text-secondary)] mb-6" />
        <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] font-normal mb-3">Your cart is empty</h2>
        <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] mb-10 max-w-[400px]">
          Add some products before checking out.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/products" 
            className="py-4 px-8 bg-[var(--accent-primary)] text-[#111] border border-[var(--border-thin)] font-sans text-xs uppercase tracking-[0.15em] transition-colors hover:bg-[var(--accent-secondary)] whitespace-nowrap text-center"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  const isProcessing = isValidating || isPlacingOrder;

  // Get variant display for summary
  const renderVariantInfo = (item: typeof items[0]) => {
    if (!item.variant) return null;
    
    return (
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-sans text-[10px] md:text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">
        {item.category === "rug" && (
          <>
            {item.variant.size && <span>{item.variant.size.replace(/\s*cm\s*$/i, '')} cm</span>}
            {item.variant.size && (item.variant.color || item.variant.material) && <span>·</span>}
            {item.variant.color && (
              <span className="flex items-center gap-1">
                {item.variant.color.startsWith('#') ? (
                  <span className="w-2.5 h-2.5 rounded-full border border-[var(--border-secondary)] inline-block" style={{ backgroundColor: item.variant.color }} aria-label={item.variant.color} />
                ) : (
                  item.variant.color
                )}
              </span>
            )}
            {item.variant.color && item.variant.material && <span>·</span>}
            {item.variant.material && <span>{item.variant.material}</span>}
          </>
        )}
        {item.category === "curtain" && (
          <>
            {(item.variant.width && item.variant.height) && (
              <span>{item.variant.width} × {item.variant.height}</span>
            )}
            {(item.variant.width && item.variant.height) && (item.variant.fabric || item.variant.lining || item.variant.pleatStyle) && <span>·</span>}
            {item.variant.fabric && <span>{item.variant.fabric}</span>}
            {item.variant.fabric && (item.variant.lining || item.variant.pleatStyle) && <span>·</span>}
            {item.variant.lining && <span>{item.variant.lining}</span>}
            {item.variant.lining && item.variant.pleatStyle && <span>·</span>}
            {item.variant.pleatStyle && <span>{item.variant.pleatStyle}</span>}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="py-12 md:py-20 min-h-[calc(100vh-200px)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        <div className="mb-6 md:mb-10 flex items-end justify-between border-b border-[var(--border-secondary)] pb-4">
          <h1 className="font-sans text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-[var(--text-primary)] m-0">
            Secure Checkout
          </h1>
          <span className="font-sans text-xs text-[var(--text-secondary)] uppercase tracking-[0.15em]">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* Validation Errors Alert */}
        {validationErrors.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 font-sans text-sm">
            <p className="font-semibold mb-2">Some items in your cart need attention:</p>
            {validationErrors.map((err, i) => (
              <p key={i} className="mb-1 last:mb-0">
                {err.message}
                {err.corrected_price !== undefined && ` — New price: ${formatPrice(err.corrected_price, cartCurrency || "AED")}`}
                {err.available_stock !== undefined && ` — Available: ${err.available_stock}`}
              </p>
            ))}
          </div>
        )}

        {orderError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 font-sans text-sm">
            <p className="font-semibold">{orderError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-7 p-5 md:p-8 lg:p-10 border border-[var(--border-secondary)] bg-[var(--surface-primary)] flex flex-col gap-5 md:gap-8">
            {!user && (
              <div className="checkout__login-prompt" style={{ padding: "1rem", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-secondary)", fontSize: "0.95rem" }}>
                Returning customer? <Link href="/login?redirect=/checkout" style={{ color: "var(--text-primary)", fontWeight: "500", textDecoration: "underline" }}>Click here to login</Link>
              </div>
            )}

            {/* Billing */}
            <div>
              <h2 className="font-serif text-lg md:text-xl font-medium text-[var(--text-primary)] mb-4 tracking-tight">Billing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-5 gap-y-4 md:gap-y-5">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="first_name">First Name <span className="text-red-500 ml-1">*</span></label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    className={`w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none ${formErrors.first_name ? "!border-red-500" : ""}`}
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="John"
                  />
                  {formErrors.first_name && <span className="text-red-500 text-xs mt-1 font-sans">{formErrors.first_name}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="last_name">Last Name <span className="text-red-500 ml-1">*</span></label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    className={`w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none ${formErrors.last_name ? "!border-red-500" : ""}`}
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Doe"
                  />
                  {formErrors.last_name && <span className="text-red-500 text-xs mt-1 font-sans">{formErrors.last_name}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="email">Email <span className="text-red-500 ml-1">*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none ${formErrors.email ? "!border-red-500" : ""}`}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && <span className="text-red-500 text-xs mt-1 font-sans">{formErrors.email}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="phone">Phone <span className="text-red-500 ml-1">*</span></label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none ${formErrors.phone ? "!border-red-500" : ""}`}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+971 50 123 4567"
                  />
                  {formErrors.phone && <span className="text-red-500 text-xs mt-1 font-sans">{formErrors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h2 className="font-serif text-lg md:text-xl font-medium text-[var(--text-primary)] mb-4 tracking-tight">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-5 gap-y-4 md:gap-y-5">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="address_1">Street Address <span className="text-red-500 ml-1">*</span></label>
                  <input
                    id="address_1"
                    name="address_1"
                    type="text"
                    className={`w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none ${formErrors.address_1 ? "!border-red-500" : ""}`}
                    value={formData.address_1}
                    onChange={handleInputChange}
                    placeholder="Street address, P.O. box"
                  />
                  {formErrors.address_1 && <span className="text-red-500 text-xs mt-1 font-sans">{formErrors.address_1}</span>}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="address_2">Apartment / Suite</label>
                  <input
                    id="address_2"
                    name="address_2"
                    type="text"
                    className="w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none"
                    value={formData.address_2}
                    onChange={handleInputChange}
                    placeholder="Apt 401"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="city">City <span className="text-red-500 ml-1">*</span></label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className={`w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none ${formErrors.city ? "!border-red-500" : ""}`}
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Dubai"
                  />
                  {formErrors.city && <span className="text-red-500 text-xs mt-1 font-sans">{formErrors.city}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="state">State / Province / Region</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className="w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State, province, or region"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="country">Country <span className="text-red-500 ml-1">*</span></label>
                  <select
                    id="country"
                    name="country"
                    className={`w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none appearance-none cursor-pointer ${formErrors.country ? "!border-red-500" : ""}`}
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  {formErrors.country && <span className="text-red-500 text-xs mt-1 font-sans">{formErrors.country}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center" htmlFor="postcode">ZIP / Postal Code</label>
                  <input
                    id="postcode"
                    name="postcode"
                    type="text"
                    className="w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="00000"
                  />
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div>
              <h2 className="font-serif text-lg md:text-xl font-medium text-[var(--text-primary)] mb-4 tracking-tight">Order Notes</h2>
              <div className="flex flex-col gap-2">
                <textarea
                  id="order_notes"
                  name="order_notes"
                  className="w-full min-h-[60px] md:min-h-[80px] p-3 border border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] font-sans text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] rounded-none resize-y"
                  value={formData.order_notes}
                  onChange={handleInputChange}
                  placeholder="Special instructions for your order (optional)"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="font-serif text-lg md:text-xl font-medium text-[var(--text-primary)] mb-4 tracking-tight">Payment Method</h2>
              <div className="flex flex-col gap-4">
                <div
                  className={`p-4 border cursor-pointer transition-colors flex items-center gap-3 md:gap-4 ${formData.payment_method === "online" ? "border-[var(--border-primary)] bg-[var(--bg-secondary)]" : "border-[var(--border-secondary)] hover:border-[var(--border-primary)]"}`}
                  onClick={() => setFormData((prev) => ({ ...prev, payment_method: "online" }))}
                >
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-[var(--border-primary)] flex items-center justify-center shrink-0">
                    {formData.payment_method === "online" && <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[var(--text-primary)]" />}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-sans text-sm font-medium text-[var(--text-primary)]">Online Payment</span>
                    <span className="font-sans text-[10px] md:text-xs text-[var(--text-secondary)]">Credit/Debit Card, Apple Pay, etc.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-[100px] p-6 md:p-8 lg:p-10 border border-[var(--border-secondary)] bg-[var(--surface-primary)] flex flex-col">
              <h3 className="font-serif text-xl md:text-2xl font-normal text-[var(--text-primary)] mb-6 md:mb-8 tracking-tight">Order Summary</h3>

            <div className="flex flex-col gap-6 mb-8 pb-8 border-b border-[var(--border-secondary)]">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 md:gap-6">
                  <div className="relative w-16 h-20 md:w-20 md:h-24 bg-[var(--bg-secondary)] shrink-0 border border-[var(--border-secondary)] mt-1 md:mt-0">
                    <span className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center font-sans text-[10px] md:text-xs font-medium z-10">{item.quantity}</span>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-sans text-xs md:text-sm font-medium text-[var(--text-primary)] leading-snug mb-0.5">{item.name}</p>
                      <span className="font-sans text-xs md:text-sm font-normal text-[var(--text-primary)] shrink-0">
                        {formatPrice(item.price * item.quantity, cartCurrency || "AED")}
                      </span>
                    </div>
                    {renderVariantInfo(item)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] md:text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em] font-medium">Subtotal</span>
                <span className="font-sans text-[15px] text-[var(--text-primary)] font-normal tracking-tight">{formatPrice(subtotal, cartCurrency || "AED")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] md:text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em] font-medium">Shipping</span>
                <span className="font-sans text-xs md:text-sm text-[var(--text-secondary)] italic">Calculated by store</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] md:text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em] font-medium">Tax</span>
                <span className="font-sans text-xs md:text-sm text-[var(--text-secondary)] italic">Included</span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-6 pt-6 border-t border-[var(--border-secondary)] mb-8">
              <span className="font-sans text-[10px] md:text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em] font-medium mb-1">Total</span>
              <span className="font-sans text-xl md:text-2xl font-normal text-[var(--text-primary)] tracking-tight">{formatPrice(subtotal, cartCurrency || "AED")}</span>
            </div>

            <button
              className="w-full h-12 md:h-14 bg-[var(--accent-primary)] text-[#111] border border-[var(--border-thin)] font-sans text-xs md:text-sm uppercase tracking-[0.2em] font-medium transition-colors hover:bg-[var(--accent-secondary)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isValidating && <><span className="inline-block w-4 h-4 border-2 border-[#111] border-t-transparent rounded-full animate-spin mr-2" /> Validating...</>}
              {isPlacingOrder && <><span className="inline-block w-4 h-4 border-2 border-[#111] border-t-transparent rounded-full animate-spin mr-2" /> Placing Order...</>}
              {!isProcessing && "Place Order"}
            </button>

            <div className="flex items-center justify-center gap-2 mt-6 font-sans text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.2em] font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
