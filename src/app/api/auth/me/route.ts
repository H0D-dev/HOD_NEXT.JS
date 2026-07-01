import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/src/lib/auth/jwt";

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
    // Depends on miniOrange JWT format
    const userData = (payload as any).data?.user || payload; 
    
    const user = {
      id: userData.id || userData.user_id || (payload as any).user_id || (payload as any).sub || 0,
      email: userData.email || userData.user_email || (payload as any).user_email || "",
      first_name: userData.first_name || userData.user_display_name || (payload as any).user_display_name || (payload as any).name || "",
      last_name: userData.last_name || "",
    };

    return NextResponse.json({
      authenticated: true,
      user
    });
  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
