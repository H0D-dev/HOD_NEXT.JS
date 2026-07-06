import { API_CONFIG } from "@/src/lib/api/api";

export async function getFeaturedProducts(categorySlug: string) {
  try {
    // 1. Fetch the category ID by slug
    const catUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products/categories?slug=${categorySlug}&consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;
    const catRes = await fetch(catUrl, { cache: "no-store" });
    const categories = await catRes.json();

    if (!Array.isArray(categories) || categories.length === 0) {
      console.warn(`Category with slug '${categorySlug}' not found.`);
      return [];
    }

    const categoryId = categories[0].id;

    // 2. Fetch featured products for this category
    const fields = "id,name,slug,price,price_html,images,categories";
    const prodUrl = `${API_CONFIG.baseUrl}/wp-json/wc/v3/products?category=${categoryId}&featured=true&per_page=8&consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}&_fields=${fields}`;
    const prodRes = await fetch(prodUrl, { cache: "no-store" });
    const products = await prodRes.json();

    if (!Array.isArray(products)) {
      return [];
    }

    // 3. Map to the format expected by ProductSlider/ProductCard
    return products.map((p: any) => {
      // Strip HTML tags from price_html if present, else use raw price
      let formattedPrice = "";
      if (p.price_html) {
        formattedPrice = p.price_html.replace(/<[^>]+>/g, "").replace("&nbsp;", " ");
      } else if (p.price) {
        formattedPrice = `₹${p.price}`;
      }

      return {
        id: p.id.toString(),
        name: p.name,
        category: p.categories?.[0]?.name || "Featured",
        price: formattedPrice || "Price varies",
        image: p.images?.[0]?.src || "https://images.unsplash.com/photo-1600166898405-da9535204843",
        slug: p.slug
      };
    });
  } catch (error) {
    console.error(`Failed to fetch featured products for ${categorySlug}:`, error);
    return [];
  }
}
