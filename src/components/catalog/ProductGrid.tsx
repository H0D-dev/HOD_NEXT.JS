import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { ProductStub } from "../../lib/catalogConfig";

interface ProductGridProps {
  products: ProductStub[];
  baseRoute: string;
  onResetFilters?: () => void;
}

export default function ProductGrid({ products, baseRoute, onResetFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="w-full py-16 px-6 text-center flex flex-col items-center justify-center border border-dashed border-[var(--border-secondary)] my-8 bg-[var(--bg-secondary)]/50">
        <h3 className="font-sans text-lg md:text-xl font-light text-[var(--text-primary)] mb-2">
          No rugs match your selected filters
        </h3>
        <p className="font-sans text-xs md:text-sm text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed">
          Try adjusting your filter criteria, or collaborate directly with our design atelier to commission a bespoke piece crafted to your exact dimensions and palette.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="py-2.5 px-6 bg-[#A38A61] hover:bg-[#8F7752] text-white font-sans text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
          <Link
            href="/bespoke"
            className="py-2.5 px-6 border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] font-sans text-xs uppercase tracking-widest font-medium transition-colors"
          >
            Explore Bespoke Custom Rugs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-[32px] w-full pt-8">
      {products.map((prod, index) => (
        <ProductCard key={prod.id} product={prod} baseRoute={baseRoute} priority={index < 4} />
      ))}
    </div>
  );
}

