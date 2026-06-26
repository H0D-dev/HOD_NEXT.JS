"use client";

import React, { useState } from "react";
import ProductSlider from "./ProductSlider";
import { useCursorStore } from "@/src/lib/store/useCursorStore";
import "./FeaturedProducts.css";

const DUMMY_PRODUCTS = [
  {
    id: "p1",
    name: "Persian Heritage",
    category: "Hand Knotted",
    price: "From ₹24,999",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "persian-heritage"
  },
  {
    id: "p2",
    name: "Oasis Weave",
    category: "Flat Weave",
    price: "From ₹12,499",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "oasis-weave"
  },
  {
    id: "p3",
    name: "Modern Minimalist",
    category: "Hand Tufted",
    price: "From ₹18,999",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "modern-minimalist"
  },
  {
    id: "p4",
    name: "Vintage Anatolian",
    category: "Hand Knotted",
    price: "From ₹32,000",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "vintage-anatolian"
  },
  {
    id: "p5",
    name: "Nomad Tribal",
    category: "Flat Weave",
    price: "From ₹15,499",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "nomad-tribal"
  },
  {
    id: "p6",
    name: "Silk Cascade",
    category: "Hand Tufted",
    price: "From ₹45,000",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "silk-cascade"
  }
];

export default function FeaturedProductsSection() {
  const setCursorMode = useCursorStore((state) => state.setMode);

  return (
    <section 
      className="featured-section relative w-full overflow-hidden bg-[var(--bg-primary)] py-[var(--space-8)] border-t border-[var(--border-thin)]"
      onMouseEnter={() => setCursorMode("default")}
    >
      
      <div className="mx-auto max-w-[var(--container-lg)] px-[var(--space-4)] mb-[var(--space-6)] lg:mb-[120px]">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-[var(--space-5)]">
          <div className="max-w-[600px]">
            <h2 className="font-sans text-[clamp(46px,11vw,54px)] lg:text-[clamp(64px,14vw,180px)] font-normal text-[var(--text-primary)] leading-[0.9] tracking-[-0.04em] m-0 flex flex-wrap items-start">
              Featured
              <sup className="font-sans text-[20px] lg:text-[24px] xl:text-[32px] font-light ml-2 lg:ml-4 lg:mt-6 tracking-normal text-[var(--text-secondary)]">
                (04)
              </sup>
            </h2>
          </div>
          <p className="font-sans text-[var(--text-md)] lg:text-[var(--text-lg)] text-[var(--text-secondary)] font-light leading-relaxed max-w-[400px] mb-2 lg:mb-4">
            Explore our curated collection of handcrafted rugs designed for luxury interiors.
          </p>
        </div>
      </div>

      <div 
        className="featured__slider-wrapper w-full overflow-hidden"
        onMouseEnter={() => setCursorMode("drag")}
        onMouseLeave={() => setCursorMode("default")}
      >
        <ProductSlider products={DUMMY_PRODUCTS} />
      </div>
    </section>
  );
}
