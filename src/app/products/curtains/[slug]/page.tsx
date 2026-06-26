import { Metadata } from "next";
import ProductPresentation, { Product } from "../../../../components/product-presentation/ProductPresentation";
import { notFound } from "next/navigation";

// Simulate a fetch function that would eventually hit WooCommerce/Shopify APIs
async function getProductBySlug(slug: string): Promise<Product | null> {
  // Dummy implementation for now based on instructions
  if (slug !== "grace-geometric") {
    // Return a default product for testing, but ideally we'd handle 404
  }

  return {
    id: "prod_1",
    name: "Grace",
    slug: slug,
    description: "Handcrafted premium curtain designed for sophisticated modern interiors. A quiet testament to artisanal excellence and timeless luxury.",
    collection: "Signature",
    design: "Geometric",
    details: {
      material: "100% New Zealand Wool",
      construction: "Hand-knotted",
      origin: "Nepal",
      weaveType: "Cut Pile",
    },
    colors: [
      {
        id: "1",
        name: "Pewter Grey",
        code: "RE0937720",
        textureUrl: "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1200&auto=format&fit=crop",
        lifestyleUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
        hex: "#8C8D8E",
      },
      {
        id: "2",
        name: "Ivory White",
        code: "RE0937721",
        textureUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200&auto=format&fit=crop",
        lifestyleUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
        hex: "#F4F4F0",
      },
      {
        id: "3",
        name: "Charcoal Black",
        code: "RE0937722",
        textureUrl: "https://images.unsplash.com/photo-1581007871115-f14bc016e0a4?q=80&w=1200&auto=format&fit=crop",
        lifestyleUrl: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop",
        hex: "#2C2C2C",
      },
    ]
  };
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
