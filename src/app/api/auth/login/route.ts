import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Missing username or password" },
        { status: 400 }
      );
    }

    const wpUrl = API_CONFIG.baseUrl || "https://store.houseofdecor.ae";
    let loginUsername = username;

    // The JWT plugin strictly requires the username (it rejects email addresses).
    // WordPress automatically generates usernames by taking the first part of the email.
    if (username.includes("@")) {
      loginUsername = username.split('@')[0];
    }

    // Using the exact route provided by the user
    const tokenUrl = `${wpUrl}/wp-json/api/v1/token`;

    const wpRes = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginUsername,
        password,
      }),
    });

    const textResponse = await wpRes.text();
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      console.error("Non-JSON response from WP:", textResponse.substring(0, 200));
      return NextResponse.json(
        { success: false, error: "Invalid response from authentication server." },
        { status: 502 }
      );
    }

    if (!wpRes.ok || !data.jwt_token) {
      console.error("WP Login Error:", wpRes.status, textResponse);
      return NextResponse.json(
        { success: false, error: data.message || "Invalid credentials" },
        { status: wpRes.ok ? 401 : wpRes.status }
      );
    }

    // Check the structure returned by miniOrange and map accordingly
    const user = {
      id: data.user_id || data.id, 
      email: data.user_email || username,
      first_name: data.user_display_name || loginUsername, 
      last_name: "",
    };

    // Create response
    const response = NextResponse.json({
      success: true,
      user
    });

    // Set HttpOnly, Secure cookie
    response.cookies.set({
      name: "auth_token",
      value: data.jwt_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 1 week
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
