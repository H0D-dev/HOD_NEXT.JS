import { NextResponse } from "next/server";
import { getCurrentWpUser } from "@/src/lib/auth/getCurrentWpUser";
import { API_CONFIG } from "@/src/lib/api/api";

export async function GET(request: Request) {
  try {
    const user = await getCurrentWpUser(request);

    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Proxy request to WooCommerce to get orders for this specific customer
    const wooUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/orders?customer=${userId}&consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;
    
    const wooRes = await fetch(wooUrl, { cache: "no-store" });
    const orders = await wooRes.json();

    if (!wooRes.ok) {
      return NextResponse.json(
        { success: false, error: orders.message || "Failed to fetch orders" },
        { status: wooRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Account orders API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
