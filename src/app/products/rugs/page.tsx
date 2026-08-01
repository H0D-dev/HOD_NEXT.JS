import { Suspense } from "react";
import ProductCatalogLayout from "../../../components/catalog/ProductCatalogLayout";
import CatalogLoadingSkeleton from "../../../components/catalog/CatalogLoadingSkeleton";
import { fetchCatalogProducts } from "@/src/lib/product/getCatalogProducts";

import { generateCollectionSchema, generateBreadcrumbSchema, BASE_URL } from "@/src/lib/seo/schema";

export const revalidate = 300;

export default async function RugsPage() {
  const initialProducts = await fetchCatalogProducts("rugs");

  const collectionSchema = generateCollectionSchema(
    "Handmade Luxury Rugs",
    "Tailoring luxury, one thread at a time. Discover premium handmade rugs crafted with timeless artistry.",
    "rugs",
    initialProducts
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Products", url: `${BASE_URL}/products` },
    { name: "Handmade Rugs", url: `${BASE_URL}/products/rugs` },
  ]);

  return (
    <Suspense fallback={<CatalogLoadingSkeleton title="HANDMADE RUGS" category="rugs" />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductCatalogLayout category="rugs" initialProducts={initialProducts} />
    </Suspense>
  );
}

