import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_CONFIG } from "@/src/lib/api/api";
import { verifyAuthToken } from "@/src/lib/auth/jwt";

interface LineItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
  price: number;
}

interface CreateOrderBody {
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    country: string;
    postcode?: string;
  };
  payment_method: string;
  currency: string;
  cart: LineItem[];
  order_notes?: string;
  checkout_session_id?: string;
}

// Simple in-memory idempotency store (resets on server restart)
// In production, use Redis or database
const processedSessions = new Map<string, { orderId: number; orderKey: string }>();

export async function POST(request: Request) {
  try {
    const body: CreateOrderBody = await request.json();

    // --- Idempotency check ---
    if (body.checkout_session_id) {
      const existing = processedSessions.get(body.checkout_session_id);
      if (existing) {
        return NextResponse.json({
          success: true,
          orderId: existing.orderId,
          orderKey: existing.orderKey,
          duplicate: true,
        });
      }
    }

    // --- Validate required fields ---
    if (!body.billing?.first_name || !body.billing?.email || !body.billing?.phone) {
      return NextResponse.json(
        { success: false, error: "Missing required billing fields" },
        { status: 400 }
      );
    }

    if (!body.shipping?.address_1 || !body.shipping?.city || !body.shipping?.country) {
      return NextResponse.json(
        { success: false, error: "Missing required shipping fields" },
        { status: 400 }
      );
    }

    if (!body.cart || body.cart.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // --- Re-validate stock server-side before creating order ---
    for (const item of body.cart) {
      const fields = "id,stock_status,stock_quantity,manage_stock,status,price,meta_data,manual_prices";
      const productUrl = item.variation_id
        ? `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/${item.product_id}/variations/${item.variation_id}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=${fields}`
        : `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/${item.product_id}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=${fields}`;
      const productRes = await fetch(productUrl, { cache: "no-store" });

      if (!productRes.ok) {
        return NextResponse.json(
          { success: false, error: `Product ${item.product_id} is unavailable` },
          { status: 400 }
        );
      }

      const product = await productRes.json();

      // --- Verify price against backend ---
      let backendPrice = parseFloat(product.price || "0");
      const targetCurrency = body.currency?.toLowerCase();

      if (targetCurrency) {
        let manualPrices = product.manual_prices;

        // If not at root, check meta_data
        if (!manualPrices && Array.isArray(product.meta_data)) {
          const meta = product.meta_data.find((m: any) => m.key === 'manual_prices' || m.key === '_manual_prices');
          if (meta && meta.value) {
            if (typeof meta.value === 'string') {
              try {
                manualPrices = JSON.parse(meta.value);
              } catch (e) {
                // Ignore parse error
              }
            } else {
              manualPrices = meta.value;
            }
          }
        }

        if (manualPrices && manualPrices[targetCurrency] !== undefined) {
          backendPrice = parseFloat(manualPrices[targetCurrency]);
        }
      }

      // Allow small floating point variations (e.g., 0.01)
      if (Math.abs(backendPrice - item.price) > 0.01) {
        return NextResponse.json(
          { success: false, error: `Price mismatch for product ${item.product_id}. Security check failed.` },
          { status: 400 }
        );
      }

      // For variations, only check stock (they inherit parent's publish status)
      const isOutOfStock = product.stock_status === "outofstock";
      const isUnavailable = !item.variation_id && product.status !== "publish";

      if (isUnavailable || isOutOfStock) {
        return NextResponse.json(
          { success: false, error: `Product ${item.product_id} is out of stock or unavailable` },
          { status: 400 }
        );
      }

      if (product.manage_stock && product.stock_quantity !== null && product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Only ${product.stock_quantity} units available for product ${item.product_id}` },
          { status: 400 }
        );
      }
    }

    // --- Payment method title mapping ---
    const paymentTitles: Record<string, string> = {
      online: "Online Payment",
      bacs: "Direct Bank Transfer",
    };

    // --- Check for authenticated user ---
    let customerId = 0;
    // Temporarily forcing customerId to 0 to prevent woocommerce_rest_invalid_customer_id errors
    /*
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token")?.value;
      if (token) {
        const payload = await verifyAuthToken(token);
        if (payload) {
          const userData = (payload as any).data?.user || payload;
          customerId = userData.id || userData.user_id || (payload as any).user_id || (payload as any).sub || 0;
        }
      }
    } catch (err) {
      console.warn("Failed to extract customer ID from token", err);
    }
    */

    // --- Build Woo order payload ---
    const orderPayload = {
      customer_id: customerId,
      payment_method: body.payment_method,
      payment_method_title: paymentTitles[body.payment_method] || body.payment_method,
      currency: body.currency,
      set_paid: false,
      billing: {
        first_name: body.billing.first_name,
        last_name: body.billing.last_name || "",
        email: body.billing.email,
        phone: body.billing.phone,
        address_1: body.shipping.address_1,
        address_2: body.shipping.address_2 || "",
        city: body.shipping.city,
        state: body.shipping.state || "",
        country: body.shipping.country,
        postcode: body.shipping.postcode || "",
      },
      shipping: {
        first_name: body.billing.first_name,
        last_name: body.billing.last_name || "",
        address_1: body.shipping.address_1,
        address_2: body.shipping.address_2 || "",
        city: body.shipping.city,
        state: body.shipping.state || "",
        country: body.shipping.country,
        postcode: body.shipping.postcode || "",
      },
      line_items: body.cart.map((item) => ({
        product_id: item.product_id,
        ...(item.variation_id && { variation_id: item.variation_id }),
        quantity: item.quantity,
        subtotal: (item.price * item.quantity).toString(),
        total: (item.price * item.quantity).toString(),
      })),
      customer_note: body.order_notes || "",
    };

    // --- Create order in WooCommerce ---
    const wooUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/orders?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;

    const wooRes = await fetch(wooUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    if (!wooRes.ok) {
      const errorText = await wooRes.text();
      console.error("WooCommerce order creation failed:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to create order" },
        { status: 500 }
      );
    }

    const wooOrder = await wooRes.json();

    // --- Store idempotency ---
    if (body.checkout_session_id) {
      processedSessions.set(body.checkout_session_id, {
        orderId: wooOrder.id,
        orderKey: wooOrder.order_key,
      });

      // Clean up old sessions after 1 hour
      setTimeout(() => {
        processedSessions.delete(body.checkout_session_id!);
      }, 3600000);
    }

    // --- Build payment URL for online payments ---
    let paymentUrl: string | null = null;
    if (body.payment_method === "online") {
      paymentUrl = `${API_CONFIG.baseUrl}/checkout/order-pay/${wooOrder.id}/?pay_for_order=true&key=${wooOrder.order_key}`;
    }

    return NextResponse.json({
      success: true,
      orderId: wooOrder.id,
      orderKey: wooOrder.order_key,
      total: wooOrder.total,
      currency: wooOrder.currency,
      status: wooOrder.status,
      paymentUrl,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
