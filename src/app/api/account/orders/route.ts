import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/src/lib/auth/jwt";
import { API_CONFIG } from "@/src/lib/api/api";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);
    
    if (!payload) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const userData = (payload as any).data?.user || payload;
    const userId = userData.id || userData.user_id || (payload as any).user_id || (payload as any).sub;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID not found in token" }, { status: 401 });
    }

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
