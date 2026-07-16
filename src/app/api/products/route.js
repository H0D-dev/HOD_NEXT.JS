import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/lib/api/api"

export async function GET(request) {
    try {
        const category = request.nextUrl.searchParams.get("category");
        const fields = 'id,name,slug,type,description,price,regular_price,sale_price,on_sale,tax_status,categories,variations,images,attributes,meta_data,permalink,dimensions,stock_status,weight,manual_prices';
        let URL = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=${fields}&per_page=100`;

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

        // --- Fetch variations for variable products using proper endpoint ---
        const variableProducts = rawProducts.filter(p => p.type === 'variable');
        const variationDataMap = {};

        if (variableProducts.length > 0) {
            await Promise.all(variableProducts.map(async (p) => {
                if (!p.variations || p.variations.length === 0) return;
                const firstVarId = p.variations[0];
                const varUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/${p.id}/variations/${firstVarId}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=id,price,regular_price,sale_price,meta_data,manual_prices`;
                try {
                    const varRes = await fetch(varUrl, { cache: "no-store" });
                    const v = await varRes.json();
                    if (v && v.id) {
                        let manualPrices = v.manual_prices || null;
                        if (!manualPrices && Array.isArray(v.meta_data)) {
                            const meta = v.meta_data.find(m => m.key === 'manual_prices' || m.key === '_manual_prices');
                            if (meta && meta.value) {
                                try {
                                    manualPrices = typeof meta.value === 'string' ? JSON.parse(meta.value) : meta.value;
                                } catch(e) {}
                            }
                        }
                        variationDataMap[v.id] = {
                            price: v.price,
                            manualPrices
                        };
                    }
                } catch (err) {
                    console.warn(`Failed to fetch first variation for product ${p.id}:`, err);
                }
            }));
        }
        // -------------------------------------------------------------------------

        const products = rawProducts.map(product => {
            // Extract raw ACF metadata
            const rawAcf = product.meta_data ? product.meta_data.reduce((acc, meta) => {
                if (!meta.key.startsWith('_')) {
                    acc[meta.key] = meta.value;
                }
                return acc;
            }, {}) : {};

            // Normalize ACF to camelCase — single source of truth for frontend
            const acf = {
                productFamilyId: rawAcf.product_family_id || null,
                productColor: rawAcf.product_color || null,
                designId: rawAcf.design_id || null,
                itemNumber: rawAcf.item_number || null,
                construction: rawAcf.construction || null,
                countryOfOrigin: rawAcf.country_of_origin || null,
                washable: rawAcf.washable || null,
                petFriendly: rawAcf.pet_friendly || null,
                careInstructions: rawAcf.care_instructions || null,
                exactWidthCm: rawAcf.exact_width_cm || null,
                exactLengthCm: rawAcf.exact_length_cm || null,
                exactHeightCm: rawAcf.exact_height_cm || null,
                weightKg: rawAcf.weight_kg || null,
            };

            // Check if variable product, inject variation pricing if found
            let finalPrice = product.price;
            let finalManualPrices = product.manual_prices || null;
            
            if (product.type === 'variable' && Array.isArray(product.variations) && product.variations.length > 0) {
                const firstVarId = product.variations[0];
                const vData = variationDataMap[firstVarId];
                if (vData) {
                    const hasPrice = vData.price && vData.price !== "";
                    const hasManualPrice = vData.manualPrices && Object.values(vData.manualPrices).some(val => val && val !== "");
                    
                    if (hasPrice || hasManualPrice) {
                        finalPrice = vData.price || finalPrice;
                        finalManualPrices = vData.manualPrices || finalManualPrices;
                    }
                }
            }

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku || null,
                permalink: product.permalink,
                description: product.description,

                // Pricing
                price: finalPrice,
                regularPrice: product.regular_price,
                salePrice: product.sale_price,
                onSale: product.on_sale,
                taxStatus: product.tax_status,
                manualPrices: finalManualPrices,

                stockStatus: product.stock_status,
                weight: product.weight,
                dimensions: product.dimensions,

                categories: product.categories,
                variations: product.variations,

                // Images
                mainImage: product.images && product.images.length > 0 ? product.images[0] : null,
                galleryImages: product.images || [],

                attributes: product.attributes,
                acf
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