import { Suspense } from "react";
import ProductCatalogLayout from "../../../components/catalog/ProductCatalogLayout";
import CatalogLoadingSkeleton from "../../../components/catalog/CatalogLoadingSkeleton";
import { fetchCatalogProducts } from "@/src/lib/product/getCatalogProducts";

export const revalidate = 300;

export default async function RugsPage() {
  const initialProducts = await fetchCatalogProducts("rugs");

  return (
    <Suspense fallback={<CatalogLoadingSkeleton title="HANDMADE RUGS" category="rugs" />}>
      <ProductCatalogLayout category="rugs" initialProducts={initialProducts} />
    </Suspense>
  );
}

