"use client";

import React, { useRef } from "react";
import ProductSlider, { ProductSliderHandle } from "./ProductSlider";
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
  const sliderRef = useRef<ProductSliderHandle>(null);

  return (
    <section
      className="featured-section relative w-full overflow-hidden bg-brand-light pt-6 pb-2 md:py-8 lg:py-12"
      onMouseEnter={() => setCursorMode("default")}
    >

      <div className="mx-auto max-w-[1536px] px-6 sm:px-12 md:px-16 lg:px-24 mb-8 md:mb-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-sans font-light text-xl lg:text-2xl leading-[1.2] tracking-wide text-[var(--text-primary)] mb-4 md:mb-6">
            Featured Rugs
          </h2>
          <p className="text-[var(--text-secondary)] font-light text-sm lg:text-base leading-relaxed max-w-md">
            Explore our curated collection of handcrafted rugs designed for luxury interiors.
          </p>
        </div>
      </div>

      <div
        className="featured__sliders-container flex flex-col gap-2 md:gap-4"
        onMouseEnter={() => setCursorMode("drag")}
        onMouseLeave={() => setCursorMode("default")}
      >
        <div className="featured__slider-wrapper w-full overflow-hidden">
          <ProductSlider ref={sliderRef} products={rugsProducts} title="Rugs" />
        </div>
        
        {/* Navigation Arrows */}
        <div 
          className="flex justify-end gap-2 px-6 sm:px-12 md:px-16 lg:px-24 mt-2"
          onMouseEnter={(e) => {
            e.stopPropagation();
            setCursorMode("default");
          }}
        >
          <button 
            onClick={() => sliderRef.current?.scrollPrev()}
            className="w-10 h-10 md:w-12 md:h-12 border border-[#2C251F]/20 flex items-center justify-center rounded-full text-[#2C251F] hover:bg-[#2C251F] hover:text-white transition-colors duration-300"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button 
            onClick={() => sliderRef.current?.scrollNext()}
            className="w-10 h-10 md:w-12 md:h-12 border border-[#2C251F]/20 flex items-center justify-center rounded-full text-[#2C251F] hover:bg-[#2C251F] hover:text-white transition-colors duration-300"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
