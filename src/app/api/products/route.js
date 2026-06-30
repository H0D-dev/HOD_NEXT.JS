import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api"

export async function GET(request) {
    try {
        const category = request.nextUrl.searchParams.get("category");
        const fields = 'id,name,slug,description,price,regular_price,sale_price,on_sale,tax_status,categories,variations,images,attributes,meta_data,permalink,dimensions,stock_status,weight';
        let URL = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=${fields}`;
        
        if (category) {
            URL += `&category=${category}`;
        }
        
        const res = await fetch(URL, {
            cache: "no-store",
        });
        
        const rawProducts = await res.json();
        
        if (!Array.isArray(rawProducts)) {
             return NextResponse.json({ products: rawProducts });
        }

        const products = rawProducts.map(product => {
            // Clean up ACF metadata: filter out keys starting with '_'
            const acf = product.meta_data ? product.meta_data.reduce((acc, meta) => {
                if (!meta.key.startsWith('_')) {
                    acc[meta.key] = meta.value;
                }
                return acc;
            }, {}) : {};

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                permalink: product.permalink,
                description: product.description,
                
                // Pricing
                price: product.price,
                regularPrice: product.regular_price,
                salePrice: product.sale_price,
                onSale: product.on_sale,
                taxStatus: product.tax_status,
                
                // --- Your requested fields ---
                stockStatus: product.stock_status,
                weight: product.weight,
                dimensions: product.dimensions,
                // -----------------------------
                
                categories: product.categories,
                variations: product.variations,
                
                // Images
                mainImage: product.images && product.images.length > 0 ? product.images[0] : null, 
                galleryImages: product.images || [], 
                
                attributes: product.attributes,
                acf: acf // Your custom fields neatly grouped here
            };
        });

        return NextResponse.json({ products })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}