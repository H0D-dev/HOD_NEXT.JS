import { Suspense } from "react";
import ProductCatalogLayout from "../../../components/catalog/ProductCatalogLayout";
import CatalogLoadingSkeleton from "../../../components/catalog/CatalogLoadingSkeleton";
import { fetchCatalogProducts } from "@/src/lib/product/getCatalogProducts";

export const revalidate = 300;

export default async function CurtainsPage() {
  const initialProducts = await fetchCatalogProducts("curtains");

  return (
    <Suspense fallback={<CatalogLoadingSkeleton title="BESPOKE CURTAINS" category="curtains" />}>
      <ProductCatalogLayout category="curtains" initialProducts={initialProducts} />
    </Suspense>
  );
}

