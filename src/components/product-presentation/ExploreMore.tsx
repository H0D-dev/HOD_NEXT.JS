"use client";

import React from "react";
import Image from "next/image";

// Mock data for the explore more rack
const EXPLORE_PRODUCTS = [
  {
    id: "prod-1",
    name: "Aura Weave",
    collection: "Signature",
    image: "/curtains/set1-full.png",
  },
  {
    id: "prod-2",
    name: "Lumina Grid",
    collection: "Geometric",
    image: "/curtains/set2-full.png",
  },
  {
    id: "prod-3",
    name: "Velvet Dune",
    collection: "Essentials",
    image: "/curtains/set3-full.png",
  },
  {
    id: "prod-4",
    name: "Onyx Shadow",
    collection: "Signature",
    image: "/curtains/set1-texture.png",
  },
];

export default function ExploreMore() {
  return (
    <section className="w-full bg-[var(--bg-primary)] py-16 lg:py-24 border-t border-[var(--border-secondary)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex justify-center md:justify-between items-end mb-8 md:mb-10">
          <h2 className="font-serif text-lg md:text-xl tracking-[0.15em] uppercase text-[var(--text-primary)] font-medium text-center md:text-left">
            Explore More
          </h2>
          <button className="hidden md:flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            View All <span className="text-[14px]">&rarr;</span>
          </button>
        </div>

        {/* Horizontal Rack */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-6 px-6 lg:mx-0 lg:px-0 scroll-smooth">
          {EXPLORE_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="group relative flex-shrink-0 w-[260px] md:w-[280px] lg:w-[300px] snap-center cursor-pointer"
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)] mb-4 border border-[var(--border-secondary)]">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 240px, (max-width: 1024px) 280px, 300px"
                />
              </div>
              <div className="flex flex-col items-start">
                <h3 className="font-sans text-sm md:text-[15px] font-medium text-[var(--text-primary)] tracking-tight mb-1">
                  {prod.name}
                </h3>
                <p className="font-sans text-[10px] md:text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
                  {prod.collection}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <button className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            View All <span className="text-[14px]">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
