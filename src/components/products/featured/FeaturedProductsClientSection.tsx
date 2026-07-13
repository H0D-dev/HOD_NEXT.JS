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
}

export default function FeaturedProductsClientSection({ rugsProducts }: FeaturedProductsClientSectionProps) {
  const setCursorMode = useCursorStore((state) => state.setMode);

  return (
    <section
      className="featured-section relative w-full overflow-hidden bg-brand-light py-8 lg:py-12"
      onMouseEnter={() => setCursorMode("default")}
    >

      <div className="mx-auto max-w-[1536px] px-6 sm:px-12 md:px-16 lg:px-24 mb-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[42px] text-[#2C251F] leading-[1.15] mb-6">
            Featured Rugs
          </h2>
          <p className="font-sans text-[#2C251F]/80 text-sm md:text-[15px] leading-[1.6] max-w-md">
            Explore our curated collection of handcrafted rugs designed for luxury interiors.
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
      </div>
    </section>
  );
}
