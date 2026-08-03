import { API_CONFIG } from "@/src/lib/api/api";

const variationCache = new Map<number, { price: string; manualPrices: any }>();
const categoryIdCache = new Map<string, number>();

async function getCategoryIdBySlugServer(slug: string): Promise<number | null> {
  if (categoryIdCache.has(slug)) {
    return categoryIdCache.get(slug)!;
  }
  try {
    const url = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/categories?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&slug=${slug}`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const categories = await res.json();
    if (Array.isArray(categories) && categories.length > 0) {
      const id = categories[0].id;
      categoryIdCache.set(slug, id);
      return id;
    }
  } catch (error: any) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError" || error?.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
      console.warn(`[WooCommerce API] Connection timed out resolving category slug '${slug}'.`);
    } else {
      console.warn(`[WooCommerce API] Failed to resolve category slug ${slug}:`, error?.message || error);
    }
  }
  return null;
}

export async function fetchCatalogProducts(categoryParam?: string | number | null) {
  try {
    let categoryId = categoryParam;

    if (typeof categoryParam === "string" && isNaN(Number(categoryParam))) {
      const resolvedId = await getCategoryIdBySlugServer(categoryParam);
      if (resolvedId) {
        categoryId = resolvedId;
      }
    }

    const fields =
      "id,name,slug,type,description,price,regular_price,sale_price,on_sale,tax_status,categories,variations,images,attributes,meta_data,permalink,dimensions,stock_status,weight,manual_prices";
    let url = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=${fields}&per_page=100`;

    if (categoryId) {
      url += `&category=${categoryId}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return [];

    const rawProducts = await res.json();
    if (!Array.isArray(rawProducts)) return [];

    // Filter variable products that genuinely need a variation fetch
    // (i.e. parent has no price AND no manual_prices)
    const variableProductsToFetch = rawProducts.filter((p) => {
      if (p.type !== "variable" || !Array.isArray(p.variations) || p.variations.length === 0) {
        return false;
      }
      const firstVarId = p.variations[0];
      if (variationCache.has(firstVarId)) return false;

      const hasParentPrice = p.price && p.price !== "";
      let hasParentManualPrice = !!p.manual_prices;
      if (!hasParentManualPrice && Array.isArray(p.meta_data)) {
        hasParentManualPrice = p.meta_data.some(
          (m: any) => m.key === "manual_prices" || m.key === "_manual_prices"
        );
      }
      // If parent has both price and manual prices, no need to fetch variation!
      return !hasParentPrice || !hasParentManualPrice;
    });

    if (variableProductsToFetch.length > 0) {
      await Promise.all(
        variableProductsToFetch.map(async (p) => {
          const firstVarId = p.variations[0];
          const varUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/${p.id}/variations/${firstVarId}?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=id,price,regular_price,sale_price,meta_data,manual_prices`;
          try {
            const varRes = await fetch(varUrl, { next: { revalidate: 300 } });
            if (varRes.ok) {
              const v = await varRes.json();
              if (v && v.id) {
                let manualPrices = v.manual_prices || null;
                if (!manualPrices && Array.isArray(v.meta_data)) {
                  const meta = v.meta_data.find(
                    (m: any) => m.key === "manual_prices" || m.key === "_manual_prices"
                  );
                  if (meta && meta.value) {
                    try {
                      manualPrices = typeof meta.value === "string" ? JSON.parse(meta.value) : meta.value;
                    } catch (e) { }
                  }
                }
                variationCache.set(v.id, {
                  price: v.price,
                  manualPrices,
                });
              }
            }
          } catch (err: any) {
            console.warn(`Failed to fetch first variation for product ${p.id}: ${err.message}`);
          }
        })
      );
    }

    return rawProducts.map((product) => {
      const rawAcf = product.meta_data
        ? product.meta_data.reduce((acc: any, meta: any) => {
          if (!meta.key.startsWith("_")) {
            acc[meta.key] = meta.value;
          }
          return acc;
        }, {})
        : {};

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
        pileThickness: rawAcf.pile_thickness || null,
        leadTime: rawAcf.lead_time || null,
      };

      let finalPrice = product.price;
      let finalManualPrices = product.manual_prices || null;

      if (!finalManualPrices && Array.isArray(product.meta_data)) {
        const meta = product.meta_data.find(
          (m: any) => m.key === "manual_prices" || m.key === "_manual_prices"
        );
        if (meta && meta.value) {
          try {
            finalManualPrices = typeof meta.value === "string" ? JSON.parse(meta.value) : meta.value;
          } catch (e) { }
        }
      }

      if (product.type === "variable" && Array.isArray(product.variations) && product.variations.length > 0) {
        const firstVarId = product.variations[0];
        const vData = variationCache.get(firstVarId);
        if (vData) {
          const hasPrice = vData.price && vData.price !== "";
          const hasManualPrice =
            vData.manualPrices && Object.values(vData.manualPrices).some((val) => val && val !== "");

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

        mainImage: product.images && product.images.length > 0 ? product.images[0] : null,
        galleryImages: product.images || [],

        attributes: product.attributes,
        acf,
      };
    });
  } catch (error: any) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError" || error?.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
      console.warn("[WooCommerce API] Catalog products request timed out. Using fallback.");
    } else {
      console.warn("[WooCommerce API] Failed to fetch catalog products:", error?.message || error);
    }
    return [];
  }
}
