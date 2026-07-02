import { API_CONFIG } from "@/src/lib/api/api";
import { Product, ProductColor } from "@/src/components/product-presentation/ProductPresentation";

/** Raw Woo product shape (subset we care about) */
interface WooProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
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
  meta_data: { key: string; value: any }[];
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
 * Color is sourced from ACF product_color field (NOT Woo attributes).
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

/**
 * Transform a raw Woo product into the frontend Product shape.
 * All ACF fields are normalized to camelCase.
 */
function transformProduct(p: WooProduct, colors: ProductColor[]): Product {
  const acf = extractAcf(p.meta_data);

  return {
    id: p.id.toString(),
    name: p.name,
    slug: p.slug,
    description:
      p.description?.replace(/<[^>]*>?/gm, "") || "Handcrafted premium product.",
    collection:
      acf.country_of_origin?.toUpperCase() ||
      p.categories?.[0]?.name ||
      "Signature",
    design: p.categories?.[0]?.name || "Modern",
    price: p.price ? parseFloat(p.price) : undefined,
    details: {
      material: acf.construction || "100% Wool",
      construction: acf.construction || "Hand-knotted",
      origin: acf.country_of_origin || "Nepal",
      weaveType: "Cut Pile",
      careInstructions: acf.care_instructions || undefined,
      dimensions:
        acf.exact_width_cm && acf.exact_length_cm
          ? `${acf.exact_width_cm}x${acf.exact_length_cm} cm`
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
  };
}

/**
 * Fetch a single product by slug and resolve its color family.
 *
 * 1. Fetch product by slug from Woo
 * 2. Extract product_family_id from ACF meta
 * 3. If family ID exists, fetch sibling products in same category, filter by family ID
 * 4. Build color variants from ACF product_color (NOT Woo attributes)
 * 5. If no family ID, product is standalone — single-color array
 */
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    // Step 1: Fetch current product
    const fields =
      "id,name,slug,description,price,regular_price,sale_price,on_sale,sku,categories,images,attributes,meta_data,permalink,dimensions,stock_status,weight";
    const productUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&slug=${slug}&_fields=${fields}`;

    const res = await fetch(productUrl, { cache: "no-store" });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const p: WooProduct = data[0];

    const acf = extractAcf(p.meta_data);
    const familyId: string | undefined = acf.product_family_id;

    // Step 2: Resolve color variants
    let colors: ProductColor[] = [];

    if (familyId) {
      // Fetch products in the same category to find siblings
      // Prioritize the top-level categories 'Curtains' or 'Rugs' if they exist,
      // to ensure we get all siblings regardless of their sub-category ordering.
      const mainCategory = p.categories?.find(c => 
        c.name.toLowerCase() === 'curtains' || c.name.toLowerCase() === 'rugs'
      );
      const categoryId = mainCategory ? mainCategory.id : p.categories?.[0]?.id;

      if (categoryId) {
        const siblingUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&category=${categoryId}&per_page=100&_fields=${fields}`;
        const siblingRes = await fetch(siblingUrl, { cache: "no-store" });
        const allProducts: WooProduct[] = await siblingRes.json();

        if (Array.isArray(allProducts)) {
          // Filter siblings by matching family ID
          const familyProducts = allProducts.filter((prod) => {
            const prodAcf = extractAcf(prod.meta_data);
            return prodAcf.product_family_id === familyId;
          });

          // Build color entries — current product first, then siblings
          // Deduplicate by color name
          const currentEntry = buildColorEntry(p);
          const siblingEntries = familyProducts
            .filter((prod) => prod.id !== p.id)
            .map(buildColorEntry);

          const allEntries = [currentEntry, ...siblingEntries];
          // Deduplicate by color
          colors = allEntries.filter(
            (item, index, self) =>
              index === self.findIndex((c) => c.name === item.name)
          );
        }
      }
    }

    // Fallback: no family → single color from current product
    if (colors.length === 0) {
      colors = [buildColorEntry(p)];
    }

    return transformProduct(p, colors);
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
}
