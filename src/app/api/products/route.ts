import { NextRequest, NextResponse } from "next/server";
import { fetchCatalogProducts } from "@/src/lib/product/getCatalogProducts";

export const revalidate = 300;

export async function GET(request: NextRequest) {
    try {
        const category = request.nextUrl.searchParams.get("category");
        const products = await fetchCatalogProducts(category);
        return NextResponse.json({ products });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
