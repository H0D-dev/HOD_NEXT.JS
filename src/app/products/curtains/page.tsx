import { Suspense } from "react";
import ProductCatalogLayout from "../../../components/catalog/ProductCatalogLayout";

export default function CurtainsPage() {
  return (
    <Suspense fallback={<div className="w-full flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>}>
      <ProductCatalogLayout category="curtains" />
    </Suspense>
  );
}
