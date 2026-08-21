import { NextResponse } from "next/server";
import { requireAnalyticsAccess } from "@/src/lib/auth/requireAnalyticsAccess";
import { analyticsQueryLayer } from "@/src/lib/analytics/server/analyticsQueryLayer";
import { parseDateRange } from "@/src/lib/analytics/server/parseDateRange";

export async function GET(request: Request) {
  // 1. Server-Side RBAC Enforcement
  const auth = await requireAnalyticsAccess(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status }
    );
  }

  try {
    // 2. Parse and validate date range
    const dateRange = parseDateRange(request);

    // 3. Delegate to Query Layer
    const data = await analyticsQueryLayer.getErrorData(dateRange);

    // 4. Return normalized JSON
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[API /analytics/errors] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate error analytics" },
      { status: 500 }
    );
  }
}
