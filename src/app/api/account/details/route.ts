import { NextResponse } from "next/server";
import { getCurrentWpUser } from "@/src/lib/auth/getCurrentWpUser";
import { API_CONFIG } from "@/src/lib/api/api";

export async function PUT(request: Request) {
  try {
    const user = await getCurrentWpUser(request);

    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const body = await request.json();

    // Proxy request to WooCommerce to update customer
    const wooUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/customers/${userId}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;
    
    const wooRes = await fetch(wooUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await wooRes.json();

    if (!wooRes.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to update details" },
        { status: wooRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      customer: data
    });
  } catch (error) {
    console.error("Account details API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
