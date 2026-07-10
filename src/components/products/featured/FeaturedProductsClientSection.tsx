"use client";

import React from "react";
import ProductSlider from "./ProductSlider";
import { useCursorStore } from "@/src/lib/store/useCursorStore";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  slug: string;
}

interface FeaturedProductsClientSectionProps {
  rugsProducts: Product[];
  curtainsProducts: Product[];
}

export default function FeaturedProductsClientSection({ rugsProducts, curtainsProducts }: FeaturedProductsClientSectionProps) {
  const setCursorMode = useCursorStore((state) => state.setMode);

  return (
    <section 
      className="featured-section relative w-full overflow-hidden bg-[var(--bg-primary)] py-[var(--space-8)]"
      onMouseEnter={() => setCursorMode("default")}
    >
      
      <div className="mx-auto max-w-[var(--container-lg)] px-[var(--space-4)] mb-[var(--space-6)] lg:mb-[60px]">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-[var(--space-5)]">
          <div className="max-w-[600px]">
            <h2 className="font-sans text-xl lg:text-2xl font-medium text-[var(--text-primary)] m-0 flex items-center">
              Featured
              <sup className="font-sans text-[10px] font-medium ml-1 mt-1 text-[var(--text-secondary)]">
                (04)
              </sup>
            </h2>
          </div>
          <p className="font-sans text-sm lg:text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-[400px] mb-1">
            Explore our curated collection of handcrafted rugs and premium curtains designed for luxury interiors.
          </p>
        </div>
      </div>

      <div 
        className="featured__sliders-container flex flex-col gap-[var(--space-6)] lg:gap-[var(--space-8)]"
        onMouseEnter={() => setCursorMode("drag")}
        onMouseLeave={() => setCursorMode("default")}
      >
        <div className="featured__slider-wrapper w-full overflow-hidden">
          <ProductSlider products={rugsProducts} title="Rugs" />
        </div>
        
        <div className="featured__slider-wrapper w-full overflow-hidden">
          <ProductSlider products={curtainsProducts} title="Curtains" />
        </div>
      </div>
    </section>
  );
}
