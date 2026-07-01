import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

    if (!email || !password || !first_name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const wooUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/customers?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;
    
    const wooRes = await fetch(wooUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name: last_name || "",
        // Set standard customer role
        role: "customer"
      }),
    });

    const data = await wooRes.json();

    if (!wooRes.ok) {
      // WP usually sends error message in 'message' field
      return NextResponse.json(
        { success: false, error: data.message || "Registration failed" },
        { status: wooRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      }
    });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
