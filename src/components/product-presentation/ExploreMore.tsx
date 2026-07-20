"use client";

import React, { useRef } from "react";
import Image from "next/image";

import Link from "next/link";
import { Product } from "./ProductPresentation";

interface ExploreMoreProps {
  relatedProducts?: Product[];
}

export default function ExploreMore({ relatedProducts }: ExploreMoreProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  const scrollPrev = () => {
    if (gridRef.current) gridRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollNext = () => {
    if (gridRef.current) gridRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[var(--bg-primary)] py-16 lg:py-24 border-t border-[var(--border-secondary)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center justify-center mb-10 lg:mb-16">
          <h2 className="font-sans text-xl lg:text-2xl text-[var(--text-primary)] font-light text-center">
            Explore More
          </h2>
        </div>

        {/* Horizontal Rack */}
        <div 
          ref={gridRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-6 px-6 lg:mx-0 lg:px-0 scroll-smooth"
        >
          {relatedProducts.map((prod) => {
            const mainImage = prod.colors?.[0]?.textureUrl || prod.colors?.[0]?.lifestyleUrl || "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=600&auto=format&fit=crop";
            return (
              <Link
                href={`/products/${prod.categorySlug || 'rugs'}/${prod.slug}`}
                key={prod.id}
                className="group block relative flex-shrink-0 w-[260px] md:w-[280px] lg:w-[320px] snap-center cursor-pointer transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-[var(--bg-primary)] pb-4"
              >
                <div className="relative w-full aspect-square overflow-hidden mb-4 bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
                  <Image
                    src={mainImage}
                    alt={prod.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 240px, (max-width: 1024px) 280px, 300px"
                  />
                </div>
                <div className="flex flex-col items-start px-2 mt-2">
                  <h3 className="font-sans text-[11px] md:text-xs uppercase tracking-widest text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[#d4b06a] mb-1">
                    {prod.name}
                  </h3>
                  <p className="font-sans text-[9px] md:text-[10px] text-[#8C8C8C] uppercase tracking-wider">
                    {prod.collection}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Nav: Arrows */}
        <div className="mt-2 md:mt-4 flex justify-end">
          
          <div className="flex justify-end gap-2">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 border border-[#2C251F]/20 flex items-center justify-center rounded-full text-[#2C251F] hover:bg-[#2C251F] hover:text-white transition-colors duration-300 cursor-pointer"
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 border border-[#2C251F]/20 flex items-center justify-center rounded-full text-[#2C251F] hover:bg-[#2C251F] hover:text-white transition-colors duration-300 cursor-pointer"
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
