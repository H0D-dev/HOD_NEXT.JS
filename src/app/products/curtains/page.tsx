import { Suspense } from "react";
import ProductCatalogLayout from "../../../components/catalog/ProductCatalogLayout";
import CatalogLoadingSkeleton from "../../../components/catalog/CatalogLoadingSkeleton";

export default function CurtainsPage() {
  return (
    <Suspense fallback={<CatalogLoadingSkeleton title="BESPOKE CURTAINS" category="curtains" />}>
      <ProductCatalogLayout category="curtains" />
    </Suspense>
  );
}
