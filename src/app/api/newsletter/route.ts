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
    const targetUrl = `${wpUrl}/wp-json/hod/v1/newsletter`;

    // Forward to custom WordPress newsletter endpoint
    const wpResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
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
      const rawMessage = data.message || data.error || 'Failed to subscribe to newsletter';
      const cleanMessage = typeof rawMessage === 'string'
        ? rawMessage.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").replace(/&#8217;/g, "'").replace(/&amp;/g, "&").trim()
        : 'Failed to subscribe to newsletter';

      return NextResponse.json(
        { success: false, message: cleanMessage },
        { status: wpResponse.status }
      );
    }

    const rawSuccess = data.message || 'Subscribed successfully';
    const cleanSuccess = typeof rawSuccess === 'string'
      ? rawSuccess.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").replace(/&#8217;/g, "'").replace(/&amp;/g, "&").trim()
      : 'Subscribed successfully';

    return NextResponse.json({ success: true, message: cleanSuccess });
  } catch (error: any) {
    console.error("Newsletter API route exception:", error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred while subscribing.' },
      { status: 500 }
    );
  }
}

