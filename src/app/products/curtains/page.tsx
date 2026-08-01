import { Suspense } from "react";
import ProductCatalogLayout from "../../../components/catalog/ProductCatalogLayout";
import CatalogLoadingSkeleton from "../../../components/catalog/CatalogLoadingSkeleton";
import { fetchCatalogProducts } from "@/src/lib/product/getCatalogProducts";

import { generateCollectionSchema, generateBreadcrumbSchema, BASE_URL } from "@/src/lib/seo/schema";

export const revalidate = 300;

export default async function CurtainsPage() {
  const initialProducts = await fetchCatalogProducts("curtains");

  const collectionSchema = generateCollectionSchema(
    "Bespoke Luxury Curtains",
    "Discover bespoke custom curtains and drapery crafted for architectural interiors.",
    "curtains",
    initialProducts
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Products", url: `${BASE_URL}/products` },
    { name: "Bespoke Curtains", url: `${BASE_URL}/products/curtains` },
  ]);

  return (
    <Suspense fallback={<CatalogLoadingSkeleton title="BESPOKE CURTAINS" category="curtains" />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductCatalogLayout category="curtains" initialProducts={initialProducts} />
    </Suspense>
  );
}

