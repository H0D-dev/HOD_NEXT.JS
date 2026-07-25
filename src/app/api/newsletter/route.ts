import { NextResponse } from 'next/server';
import { API_CONFIG } from "@/src/lib/api/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || email.trim() === "") {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // Strictly forward only the email field to WordPress
    const cleanPayload = {
      email: email.trim(),
    };

    const wpUrl = API_CONFIG.baseUrl || "https://store.houseofdecor.ae";
    const targetUrl = `${wpUrl}/wp-json/hod/v1/newsletter?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;

    // Create Basic Auth header to match standard Postman API authorization
    const authHeader = `Basic ${Buffer.from(`${API_CONFIG.consumerKey || ""}:${API_CONFIG.consumerSecret || ""}`).toString('base64')}`;

    // Forward to custom WordPress newsletter endpoint with complete credentials
    const wpResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(cleanPayload),
    });

    const textResponse = await wpResponse.text();
    let data: any = {};
    try {
      if (textResponse) {
        data = JSON.parse(textResponse);
      }
    } catch (e) {
      console.error("Non-JSON response from WP newsletter endpoint:", textResponse.substring(0, 200));
      return NextResponse.json(
        { success: false, message: "Invalid response from newsletter server." },
        { status: wpResponse.status >= 400 ? wpResponse.status : 502 }
      );
    }

    if (!wpResponse.ok) {
      console.error("WP Newsletter Error:", wpResponse.status, data);
      return NextResponse.json(
        { success: false, message: data.message || data.error || 'Failed to subscribe to newsletter' },
        { status: wpResponse.status }
      );
    }

    return NextResponse.json({ success: true, message: data.message || 'Subscribed successfully' });
  } catch (error: any) {
    console.error("Newsletter API route exception:", error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred while subscribing.' },
      { status: 500 }
    );
  }
}

