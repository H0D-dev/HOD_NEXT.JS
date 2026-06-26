import React from "react";
import ProductCard from "./ProductCard";
import { ProductStub } from "../../lib/catalogConfig";

interface ProductGridProps {
  products: ProductStub[];
  baseRoute: string;
}

export default function ProductGrid({ products, baseRoute }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-[32px] w-full pt-8">
      {products.map(prod => (
        <ProductCard key={prod.id} product={prod} baseRoute={baseRoute} />
      ))}
    </div>
  );
}
