"use client";

import React from "react";
import Image from "next/image";

// Mock data for the explore more rack
const EXPLORE_PRODUCTS = [
  {
    id: "prod-1",
    name: "Aura Weave",
    collection: "Signature",
    image: "/carpets/set1-full.png",
  },
  {
    id: "prod-2",
    name: "Lumina Grid",
    collection: "Geometric",
    image: "/carpets/set2-full.png",
  },
  {
    id: "prod-3",
    name: "Velvet Dune",
    collection: "Essentials",
    image: "/carpets/set3-full.png",
  },
  {
    id: "prod-4",
    name: "Onyx Shadow",
    collection: "Signature",
    image: "/carpets/set1-texture.png",
  },
];

export default function ExploreMore() {
  return (
    <section className="w-full bg-[var(--bg-primary)] py-[var(--space-7)] lg:py-[var(--space-8)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto px-[var(--space-4)] lg:px-[var(--space-8)]">

        {/* Monumental Section Heading */}
        <div className="pt-[64px] lg:pt-[120px] mb-[80px] lg:mb-[120px]">
          <h2 className="font-serif font-medium text-[clamp(64px,14vw,180px)] tracking-[-0.04em] leading-[0.9] text-[var(--text-primary)] relative inline-flex uppercase">
            EXPLORE
            <span className="font-sans font-light text-[clamp(24px,4vw,40px)] text-[var(--text-secondary)] ml-3 tracking-normal normal-case">
              (03)
            </span>
          </h2>
        </div>

        {/* Horizontal Rack */}
        <div className="flex gap-4 lg:gap-6 overflow-x-auto snap-x hide-scrollbar pb-4 -mx-[var(--space-4)] px-[var(--space-4)] lg:mx-0 lg:px-0">
          {EXPLORE_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="group relative flex-shrink-0 w-[280px] lg:w-[320px] snap-start cursor-pointer"
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)] mb-4">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  sizes="(max-width: 1024px) 280px, 320px"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-[var(--text-lg)] text-[var(--text-primary)] leading-tight mb-1">
                    {prod.name}
                  </h3>
                  <p className="font-sans text-[var(--text-xs)] uppercase tracking-widest text-[var(--text-muted)]">
                    {prod.collection}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full border border-[var(--border-secondary)] flex items-center justify-center transition-colors group-hover:border-[var(--border-primary)] group-hover:bg-[var(--bg-secondary)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
