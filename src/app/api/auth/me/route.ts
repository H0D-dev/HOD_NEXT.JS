import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/src/lib/auth/jwt";
import { API_CONFIG } from "@/src/lib/api/api";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Attempt to extract user data from WP JWT payload structure
    const userData = (payload as any).data?.user || payload; 
    
    let user: any = {
      id: userData.id || userData.user_id || (payload as any).user_id || (payload as any).sub || 0,
      email: userData.email || userData.user_email || (payload as any).user_email || "",
      first_name: userData.first_name || userData.user_display_name || (payload as any).user_display_name || (payload as any).name || "",
      last_name: userData.last_name || "",
    };

    // Safely attempt to fetch full customer details from WooCommerce
    if (user.id) {
      try {
        const wooUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/customers/${user.id}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;
        const wooRes = await fetch(wooUrl, { cache: "no-store" });
        if (wooRes.ok) {
          const wooCustomer = await wooRes.json();
          user = {
            ...user,
            first_name: wooCustomer.first_name || user.first_name,
            last_name: wooCustomer.last_name || user.last_name,
            billing: wooCustomer.billing || {},
            shipping: wooCustomer.shipping || {}
          };
        }
      } catch (wooError) {
        console.error("Failed to fetch WC customer details, falling back to JWT data:", wooError);
      }
    }

    return NextResponse.json({
      authenticated: true,
      user
    });
  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
