import { API_CONFIG } from "@/src/lib/api/api";
import { Product, ProductColor, ProductVariation } from "@/src/components/product-presentation/ProductPresentation";

/** Raw Woo product shape (subset we care about) */
interface WooProduct {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  sku: string;
  permalink: string;
  stock_status: string;
  weight: string;
  dimensions: { length: string; width: string; height: string };
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; alt: string }[];
  attributes: { id: number; name: string; options: string[] }[];
  variations: number[];
  related_ids?: number[];
  meta_data: { key: string; value: any }[];
  manual_prices?: { inr?: string; usd?: string; eur?: string };
  default_attributes?: { id: number; name: string; option: string }[];
}

interface WooVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  weight: string;
  dimensions: { length: string; width: string; height: string };
  attributes: { id: number; name: string; option: string }[];
  meta_data?: { key: string; value: any }[];
  manual_prices?: { inr?: string; usd?: string; eur?: string };
}

function extractAcf(metaData: WooProduct["meta_data"]): Record<string, any> {
  if (!metaData) return {};
  return metaData.reduce((acc: Record<string, any>, meta) => {
    if (!meta.key.startsWith("_")) {
      acc[meta.key] = meta.value;
    }
    return acc;
  }, {});
}

/**
 * Build a ProductColor entry from a raw Woo product.
 * Color is sourced from ACF product_color field.
 */
function buildColorEntry(p: WooProduct): ProductColor {
  const acf = extractAcf(p.meta_data);
  const color = acf.product_color || "Standard";

  const lifestyleImg =
    p.images?.[0]?.src ||
    "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1200&auto=format&fit=crop";
  const textureImg =
    p.images?.[1]?.src ||
    p.images?.[0]?.src ||
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop";

  return {
    id: p.id.toString(),
    name: color,
    code: p.sku || "N/A",
    textureUrl: textureImg,
    lifestyleUrl: lifestyleImg,
    hex: color.startsWith("#") ? color : "#8C8D8E",
    slug: p.slug,
  };
}

function formatDimensions(d: { length: string; width: string; height: string }): string {
  const parts = [d.length, d.width].filter(v => v && v !== "0" && v !== "");
  if (parts.length === 0) return "";
  return parts.join(" x ");
}

/**
 * Fetch variations for a variable product from WooCommerce.
 */
async function fetchVariations(productId: number): Promise<ProductVariation[]> {
  try {
    const url = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/${productId}/variations?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&per_page=100`;
    const res = await fetch(url, { cache: "no-store" });
    const data: WooVariation[] = await res.json();

    if (!Array.isArray(data) || data.length === 0) return [];

    // Filter out catch-all "Any" variations that WooCommerce auto-creates.
    // These have no attributes and no price — they aren't real selectable sizes.
    const usableVariations = data.filter((v) => {
      const hasAttributes = Array.isArray(v.attributes) && v.attributes.length > 0;
      const hasPrice = v.price !== "" && v.price !== "0";
      return hasAttributes || hasPrice;
    });

    return usableVariations.map((v) => {
      const dims = formatDimensions(v.dimensions);
      // Build a human-readable label from attributes (e.g. "200 x 300 cm")
      const label = v.attributes.map(a => a.option).join(" / ") || dims || `Variation ${v.id}`;

      return {
        id: v.id,
        sku: v.sku || "",
        price: parseFloat(v.price) || 0,
        regularPrice: parseFloat(v.regular_price) || 0,
        salePrice: v.sale_price ? parseFloat(v.sale_price) : undefined,
        onSale: v.on_sale,
        stockStatus: v.stock_status,
        dimensions: dims,
        weight: v.weight || undefined,
        attributes: v.attributes.map(a => ({ name: a.name, option: a.option })),
        label,
        currencyPrices: {
          AED: parseFloat(v.price) || 0,
          INR: v.manual_prices?.inr ? parseFloat(v.manual_prices.inr) : undefined,
          USD: v.manual_prices?.usd ? parseFloat(v.manual_prices.usd) : undefined,
          EUR: v.manual_prices?.eur ? parseFloat(v.manual_prices.eur) : undefined,
        },
      };
    });
  } catch (error) {
    console.error("Failed to fetch variations:", error);
    return [];
  }
}

/**
 * Transform a raw Woo product into the frontend Product shape.
 */
function transformProduct(
  p: WooProduct,
  colors: ProductColor[],
  variations: ProductVariation[]
): Product {
  const acf = extractAcf(p.meta_data);
  const isVariable = p.type === "variable" && variations.length > 0;

  let defaultVariationId: number | undefined = undefined;
  if (isVariable && Array.isArray(p.default_attributes) && p.default_attributes.length > 0) {
    const defVar = variations.find((v) => {
      return p.default_attributes!.every((defAttr) => {
        return v.attributes.some((vAttr) => 
          vAttr.name.toLowerCase() === defAttr.name.toLowerCase() && 
          vAttr.option.toLowerCase() === defAttr.option.toLowerCase()
        );
      });
    });
    if (defVar) {
      defaultVariationId = defVar.id;
    }
  }


  return {
    id: p.id.toString(),
    name: p.name,
    slug: p.slug,
    description: p.description?.replace(/<[^>]*>?/gm, "") || "Handcrafted premium product.",
    shortDescription: p.short_description?.replace(/<[^>]*>?/gm, "").trim() || undefined,
    collection:
      acf.country_of_origin?.toUpperCase() ||
      p.categories?.[0]?.name ||
      "Signature",
    design: p.categories?.[0]?.name || "Modern",
    price: p.price ? parseFloat(p.price) : undefined,
    regularPrice: p.regular_price ? parseFloat(p.regular_price) : undefined,
    salePrice: p.sale_price ? parseFloat(p.sale_price) : undefined,
    onSale: p.on_sale,
    sku: p.sku || undefined,
    stockStatus: p.stock_status || undefined,
    productType: (isVariable ? "variable" : p.type) as Product["productType"],
    variations: isVariable ? variations : undefined,
    relatedIds: p.related_ids,
    defaultVariationId,
    details: {
      material: acf.construction || "100% Wool",
      construction: acf.construction || "Hand-knotted",
      origin: acf.country_of_origin || "Nepal",
      weaveType: "Cut Pile",
      careInstructions: acf.care_instructions || undefined,
      dimensions:
        acf.exact_width_cm && acf.exact_length_cm
          ? `${acf.exact_length_cm} x ${acf.exact_width_cm}`
          : undefined,
      weight: acf.weight_kg ? `${acf.weight_kg} kg` : undefined,
      petFriendly:
        acf.pet_friendly === "1"
          ? "Yes"
          : acf.pet_friendly === "0"
          ? "No"
          : undefined,
      washable:
        acf.washable === "1"
          ? "Yes"
          : acf.washable === "0"
          ? "No"
          : undefined,
      itemNumber: acf.item_number || undefined,
    },
    colors,
    currencyPrices: {
      AED: p.price ? parseFloat(p.price) : (p.regular_price ? parseFloat(p.regular_price) : 0),
      INR: p.manual_prices?.inr ? parseFloat(p.manual_prices.inr) : undefined,
      USD: p.manual_prices?.usd ? parseFloat(p.manual_prices.usd) : undefined,
      EUR: p.manual_prices?.eur ? parseFloat(p.manual_prices.eur) : undefined,
    },
  };
}

/**
 * Fetch a single product by slug, resolve color family, and fetch variations if variable.
 */
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    const fields =
      "id,name,slug,type,description,short_description,price,regular_price,sale_price,on_sale,sku,categories,images,attributes,variations,meta_data,permalink,dimensions,stock_status,weight,default_attributes,manual_prices,related_ids";
    const productUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&slug=${slug}&_fields=${fields}`;

    const res = await fetch(productUrl, { cache: "no-store" });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const p: WooProduct = data[0];
    const acf = extractAcf(p.meta_data);
    const designId: string | undefined = acf.design_id;

    // --- Resolve color variants by design_id ---
    let colors: ProductColor[] = [];

    if (designId) {
      const mainCategory = p.categories?.find(c =>
        c.name.toLowerCase() === 'curtains' || c.name.toLowerCase() === 'rugs'
      );
      const categoryId = mainCategory ? mainCategory.id : p.categories?.[0]?.id;

      if (categoryId) {
        const siblingUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&category=${categoryId}&per_page=100&_fields=${fields}`;
        const siblingRes = await fetch(siblingUrl, { cache: "no-store" });
        const allProducts: WooProduct[] = await siblingRes.json();

        if (Array.isArray(allProducts)) {
          const designProducts = allProducts.filter((prod) => {
            const prodAcf = extractAcf(prod.meta_data);
            return prodAcf.design_id === designId;
          });

          const currentEntry = buildColorEntry(p);
          const siblingEntries = designProducts
            .filter((prod) => prod.id !== p.id)
            .map(buildColorEntry);

          const allEntries = [currentEntry, ...siblingEntries];
          colors = allEntries.filter(
            (item, index, self) =>
              index === self.findIndex((c) => c.id === item.id)
          );
        }
      }
    }

    if (colors.length === 0) {
      colors = [buildColorEntry(p)];
    }

    // --- Fetch variations if variable product ---
    let variations: ProductVariation[] = [];
    if (p.type === "variable" && Array.isArray(p.variations) && p.variations.length > 0) {
      variations = await fetchVariations(p.id);
    }

    return transformProduct(p, colors, variations);
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
}

export async function getRelatedProducts(ids: number[]): Promise<Product[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const fields =
      "id,name,slug,type,description,short_description,price,regular_price,sale_price,on_sale,sku,categories,images,attributes,variations,meta_data,permalink,dimensions,stock_status,weight,default_attributes,manual_prices,related_ids";
    const idsString = ids.slice(0, 8).join(','); // max 8 products
    const url = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&include=${idsString}&_fields=${fields}`;
    const res = await fetch(url, { cache: "no-store" });
    const data: WooProduct[] = await res.json();
    
    if (!Array.isArray(data)) return [];
    
    // We don't fetch all variations and family colors for related products to save time,
    // since we only need the basic info for the card.
    return data.map((p) => transformProduct(p, [buildColorEntry(p)], []));
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

