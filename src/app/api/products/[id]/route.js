import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api";

export async function GET(request, { params }) {
    try {
        const id = params.id;
        const URL = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/${id}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;
        
        const res = await fetch(URL, {
            cache: "no-store",
        });
        
        if (!res.ok) {
            return NextResponse.json(
                { error: `Failed to fetch product ${id}` },
                { status: res.status }
            );
        }

        const product = await res.json();
        return NextResponse.json({ product });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}
