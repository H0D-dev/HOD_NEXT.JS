import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get("order_id");
    const key = searchParams.get("key");

    if (!order_id || !key) {
      return NextResponse.json(
        { success: false, error: "Missing order_id or key" },
        { status: 400 }
      );
    }

    if (!API_CONFIG.baseUrl || !API_CONFIG.consumerKey || !API_CONFIG.consumerSecret) {
      return NextResponse.json(
        { success: false, error: "Server configuration error: API credentials are not fully set" },
        { status: 500 }
      );
    }

    const baseUrl = API_CONFIG.baseUrl.replace(/\/$/, "");
    const wooUrl = `${baseUrl}/wp-json/wc/v3/orders/${order_id}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;

    const wooRes = await fetch(wooUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!wooRes.ok) {
      if (wooRes.status === 404) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }
      const errorText = await wooRes.text();
      console.error(`WooCommerce API failed. Status: ${wooRes.status}, Response:`, errorText);
      return NextResponse.json(
        { success: false, error: `WooCommerce API returned status ${wooRes.status}` },
        { status: wooRes.status }
      );
    }

    const order = await wooRes.json();

    // Security: Verify the order_key matches
    if (order.order_key !== key) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Map WooCommerce response to our expected format
    const items = order.line_items ? order.line_items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
    })) : [];

    // The checkout payment URL is usually provided by WooCommerce REST API in some contexts,
    // or we can construct it if it's missing. WooCommerce returns `checkout_payment_url` sometimes,
    // but if not, we use the store's checkout pay endpoint.
    const retryUrl = order.payment_url || `${baseUrl}/checkout/order-pay/${order_id}/?pay_for_order=true&key=${key}`;

    return NextResponse.json({
      success: true,
      status: order.status,
      orderNumber: order.number || order.id,
      currency: order.currency,
      total: order.total,
      paymentMethod: order.payment_method,
      billingFirstName: order.billing?.first_name,
      retryUrl: retryUrl,
      items: items,
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
