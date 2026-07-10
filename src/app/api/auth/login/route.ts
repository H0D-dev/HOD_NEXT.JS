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

    const wpUrl = (API_CONFIG.baseUrl || "https://store.houseofdecor.ae");

    // Construct URL with consumer keys appended
    const tokenUrl = new URL(`${wpUrl}/wp-json/hod/v1/login`);
    // tokenUrl.searchParams.append("consumer_key", API_CONFIG.consumerKey || "");
    // tokenUrl.searchParams.append("consumer_secret", API_CONFIG.consumerSecret || "");

    console.log("Calling WP Login Endpoint:");

    const wpRes = await fetch(tokenUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        username,
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

    if (!wpRes.ok) {
      console.error("WP Login Error:", wpRes.status, textResponse);
      return NextResponse.json(
        { success: false, error: data.message || "Invalid credentials" },
        { status: wpRes.ok ? 401 : wpRes.status }
      );
    }

    // Map user data structure
    const wpUser = data.user || data; // Fallback to data just in case
    const user = {
      id: wpUser.id,
      email: wpUser.email || wpUser.user_email || username,
      first_name: wpUser.first_name || wpUser.user_display_name || username.split('@')[0],
      last_name: wpUser.last_name || "",
    };

    // Create response
    const response = NextResponse.json({
      success: true,
      user
    });

    const setCookies = wpRes.headers.getSetCookie();

    setCookies.forEach((cookieStr) => {
      const parts = cookieStr.split(';').map(p => p.trim());
      const [nameValue, ...options] = parts;

      const equalIndex = nameValue.indexOf('=');
      if (equalIndex === -1) return;

      const name = nameValue.substring(0, equalIndex);
      const rawValue = nameValue.substring(equalIndex + 1);

      // Next.js response.cookies.set() will automatically URI-encode the value.
      // Since WP already encodes it, we must decode it first to prevent double-encoding (e.g. %257C instead of %7C)
      let value = rawValue;
      try {
        value = decodeURIComponent(rawValue);
      } catch (e) {
        // Fallback to raw if decoding fails
      }

      const cookieOptions: any = {};

      options.forEach(opt => {
        const [k, ...vParts] = opt.split('=');
        const key = k.toLowerCase();
        const v = vParts.join('=');

        if (key === 'path') cookieOptions.path = v || '/';
        if (key === 'expires') cookieOptions.expires = new Date(v);
        if (key === 'max-age') cookieOptions.maxAge = parseInt(v, 10);
        if (key === 'httponly') cookieOptions.httpOnly = true;
        // In production, preserve secure flag
        if (key === 'secure' && process.env.NODE_ENV !== 'development') cookieOptions.secure = true;
        if (key === 'samesite') cookieOptions.sameSite = process.env.NODE_ENV === 'development' ? 'lax' : v.toLowerCase();
      });

      // Always force the parent domain in production so Next.js and WP share the session.
      if (process.env.NODE_ENV !== 'development') {
        cookieOptions.domain = '.houseofdecor.ae';
      }

      response.cookies.set(name, value, cookieOptions);
    });

    // Also store the WP nonce if provided in the response
    if (data.nonce) {
      response.cookies.set('wp_rest_nonce', data.nonce, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
        // In production, preserve the domain (e.g. .houseofdecor.ae) so it works across subdomains if needed
        domain: process.env.NODE_ENV !== 'development' ? '.houseofdecor.ae' : undefined,
      });
    }

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
