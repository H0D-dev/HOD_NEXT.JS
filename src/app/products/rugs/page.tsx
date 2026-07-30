import { Suspense } from "react";
import ProductCatalogLayout from "../../../components/catalog/ProductCatalogLayout";
import CatalogLoadingSkeleton from "../../../components/catalog/CatalogLoadingSkeleton";

export default function RugsPage() {
  return (
    <Suspense fallback={<CatalogLoadingSkeleton title="HANDMADE RUGS" category="rugs" />}>
      <ProductCatalogLayout category="rugs" />
    </Suspense>
  );
}
