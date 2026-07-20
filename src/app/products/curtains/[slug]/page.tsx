import { Metadata } from "next";
import ProductPresentation from "../../../../components/product-presentation/ProductPresentation";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/src/lib/product/getProductBySlug";

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

  // Inject categorySlug so color navigation knows the route prefix
  product.categorySlug = "curtains";

  let relatedProducts: any[] = [];
  if (product.relatedIds && product.relatedIds.length > 0) {
    relatedProducts = await getRelatedProducts(product.relatedIds);
  }

  return (
    <main className="w-full">
      <ProductPresentation product={product} relatedProducts={relatedProducts} />
    </main>
  );
}
