import { Metadata } from "next";
import ProductPresentation, { Product } from "../../../../components/product-presentation/ProductPresentation";
import { notFound } from "next/navigation";

import { API_CONFIG } from "@/src/lib/api/api";

// Fetch product details from WooCommerce API by slug
async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const URL = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&slug=${slug}`;
    const res = await fetch(URL, { cache: "no-store" });
    const data = await res.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const p = data[0];
    
    // Clean up ACF metadata
    const acf = p.meta_data ? p.meta_data.reduce((acc: any, meta: any) => {
      if (!meta.key.startsWith('_')) {
        acc[meta.key] = meta.value;
      }
      return acc;
    }, {}) : {};

    // Get color from attributes if exists
    const colorAttr = p.attributes?.find((a: any) => a.name === 'Color');
    const actualColor = colorAttr?.options?.[0] || "Standard";
    
    const lifestyleImg = p.images?.[0]?.src || "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1200&auto=format&fit=crop";
    const textureImg = p.images?.[1]?.src || p.images?.[0]?.src || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop";

    const realColor = {
      id: "1",
      name: actualColor,
      code: p.sku || "N/A",
      textureUrl: textureImg,
      lifestyleUrl: lifestyleImg,
      hex: "#8C8D8E", // Fallback hex
    };
    
    // Dummy colors for layout preservation until variations are added
    const dummyColor1 = {
      id: "2",
      name: "Ivory White",
      code: "RE0937721",
      textureUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200&auto=format&fit=crop",
      lifestyleUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
      hex: "#F4F4F0",
    };
    const dummyColor2 = {
      id: "3",
      name: "Charcoal Black",
      code: "RE0937722",
      textureUrl: "https://images.unsplash.com/photo-1581007871115-f14bc016e0a4?q=80&w=1200&auto=format&fit=crop",
      lifestyleUrl: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop",
      hex: "#2C2C2C",
    };

    return {
      id: p.id.toString(),
      name: p.name,
      slug: p.slug,
      description: p.description?.replace(/<[^>]*>?/gm, '') || "Handcrafted premium product.",
      collection: acf.country_of_origin?.toUpperCase() || p.categories?.[0]?.name || "Signature",
      design: p.categories?.[0]?.name || "Modern",
      price: p.price ? parseFloat(p.price) : undefined,
      details: {
        material: acf.construction || "100% Wool",
        construction: acf.construction || "Hand-knotted",
        origin: acf.country_of_origin || "Nepal",
        weaveType: "Cut Pile",
        careInstructions: acf.care_instructions || undefined,
        dimensions: (acf.exact_width_cm && acf.exact_length_cm) ? `${acf.exact_width_cm}x${acf.exact_length_cm} cm` : undefined,
        weight: acf.weight_kg ? `${acf.weight_kg} kg` : undefined,
        petFriendly: acf.pet_friendly === "1" ? "Yes" : (acf.pet_friendly === "0" ? "No" : undefined),
        washable: acf.washable === "1" ? "Yes" : (acf.washable === "0" ? "No" : undefined),
        itemNumber: acf.item_number || undefined,
      },
      colors: [realColor, dummyColor1, dummyColor2]
    };

  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return { title: "Product Not Found | House of Décor" };
  }

  return {
    title: `${product.name} | House of Décor`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="w-full">
      <ProductPresentation product={product} />
    </main>
  );
}
