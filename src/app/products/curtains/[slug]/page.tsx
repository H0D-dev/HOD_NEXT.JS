import { Metadata } from "next";
import ProductPresentation from "../../../../components/product-presentation/ProductPresentation";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/src/lib/product/getProductBySlug";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return { title: "Product Not Found | House of Decór" };
  }

  return {
    title: `${product.name} | House of Decór`,
    description: product.description,
  };
}

import { generateProductSchema, generateBreadcrumbSchema, BASE_URL } from "@/src/lib/seo/schema";

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

  const productSchema = generateProductSchema(product, "curtains");
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Products", url: `${BASE_URL}/products` },
    { name: "Bespoke Curtains", url: `${BASE_URL}/products/curtains` },
    { name: product.name, url: `${BASE_URL}/products/curtains/${product.slug}` },
  ]);

  return (
    <main className="w-full">
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductPresentation product={product} relatedProducts={relatedProducts} />
    </main>
  );
}
