import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api"

export async function GET(request) {
    try {
        const parent = request.nextUrl.searchParams.get("parent");
        let URL = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/categories?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&per_page=100`;
        
        if (parent) {
            URL += `&parent=${parent}`;
        }
        
        const res = await fetch(URL, {
            cache: "no-store",
        });
        
        const categories = await res.json();
        
        if (!Array.isArray(categories)) {
             return NextResponse.json({ categories });
        }

        return NextResponse.json({ categories })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
