import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api";

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Cache for 24 hours

// Allowed hostnames for image proxy to prevent unrestricted SSRF
const ALLOWED_HOSTS = new Set([
  "store.houseofdecor.ae",
  "houseofdecor.ae",
  "images.unsplash.com",
  "mediumslateblue-grasshopper-769837.hostingersite.com",
]);

// Dynamically add host from API_CONFIG if present
if (API_CONFIG.baseUrl) {
  try {
    const configUrl = new URL(API_CONFIG.baseUrl);
    ALLOWED_HOSTS.add(configUrl.hostname);
  } catch (e) {
    // Ignore invalid config URL
  }
}

function isPrivateIp(hostname: string): boolean {
  // Check localhost / loopback
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "0.0.0.0"
  ) {
    return true;
  }

  // Check IPv4 private ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x, 169.254.x.x)
  const ipParts = hostname.split(".").map(Number);
  if (ipParts.length === 4 && !ipParts.some(isNaN)) {
    const [a, b] = ipParts;
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true; // Link-local / Cloud metadata
    if (a === 127) return true;
  }

  // Check .local / .internal domains
  if (hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing required 'url' parameter" },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      );
    }

    // Protocol check - HTTPS only (or HTTP for local dev if necessary)
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      return NextResponse.json(
        { error: "Only HTTP/HTTPS protocols are supported" },
        { status: 400 }
      );
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    // SSRF Check: Block private IP addresses & localhost
    if (isPrivateIp(hostname)) {
      return NextResponse.json(
        { error: "Access to local or private network hosts is forbidden" },
        { status: 403 }
      );
    }

    // SSRF Check: Host Whitelist
    const isAllowedHost = Array.from(ALLOWED_HOSTS).some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
    );

    if (!isAllowedHost) {
      return NextResponse.json(
        { error: `Host '${hostname}' is not in the allowed image hosts whitelist` },
        { status: 403 }
      );
    }

    // Fetch upstream remote image
    const upstreamRes = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "HouseOfDecor-ImageProxy/1.0",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      next: { revalidate: 86400 },
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: `Upstream image fetch failed with status ${upstreamRes.status}` },
        { status: upstreamRes.status }
      );
    }

    const contentType = upstreamRes.headers.get("content-type") || "";

    // Ensure we are returning an actual image, not HTML error pages
    if (!contentType.toLowerCase().includes("image/") && !contentType.toLowerCase().includes("application/octet-stream")) {
      return NextResponse.json(
        { error: `Upstream response is not a valid image (content-type: ${contentType})` },
        { status: 400 }
      );
    }

    const imageArrayBuffer = await upstreamRes.arrayBuffer();

    // 15MB size limit safety check
    if (imageArrayBuffer.byteLength > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size exceeds maximum limit of 15MB" },
        { status: 413 }
      );
    }

    return new NextResponse(imageArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType || "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching proxied image" },
      { status: 500 }
    );
  }
}
