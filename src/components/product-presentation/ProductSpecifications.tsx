"use client";

import React from "react";
import { Product } from "./ProductPresentation";

interface ProductSpecificationsProps {
  product: Product;
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
  if (!product.details) return null;

  return (
    <section className="w-full bg-[var(--bg-secondary)] py-[var(--space-6)] lg:py-[var(--space-8)] px-[var(--space-4)] lg:px-[var(--space-8)] border-t border-[var(--border-secondary)]">
      <div className="lg:w-[45%] w-full">
        
        <h2 className="font-serif text-[var(--text-xl)] lg:text-[var(--text-2xl)] text-[var(--text-primary)] mb-[var(--space-5)] text-center lg:text-left">
          Product Specifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          
          <div className="flex flex-col border-t border-[var(--border-primary)] pt-4">
            <span className="text-[var(--text-xs)] uppercase tracking-widest text-[var(--text-muted)] mb-1">Material</span>
            <span className="font-sans text-[var(--text-md)] font-medium text-[var(--text-primary)]">
              {product.details.material || "100% New Zealand Wool"}
            </span>
          </div>

          <div className="flex flex-col border-t border-[var(--border-primary)] pt-4">
            <span className="text-[var(--text-xs)] uppercase tracking-widest text-[var(--text-muted)] mb-1">Construction</span>
            <span className="font-sans text-[var(--text-md)] font-medium text-[var(--text-primary)]">
              {product.details.construction || "Hand-knotted"}
            </span>
          </div>

          <div className="flex flex-col border-t border-[var(--border-primary)] pt-4">
            <span className="text-[var(--text-xs)] uppercase tracking-widest text-[var(--text-muted)] mb-1">Origin</span>
            <span className="font-sans text-[var(--text-md)] font-medium text-[var(--text-primary)]">
              {product.details.origin || "Nepal"}
            </span>
          </div>

          <div className="flex flex-col border-t border-[var(--border-primary)] pt-4">
            <span className="text-[var(--text-xs)] uppercase tracking-widest text-[var(--text-muted)] mb-1">Weave Type</span>
            <span className="font-sans text-[var(--text-md)] font-medium text-[var(--text-primary)]">
              {product.details.weaveType || "Cut Pile"}
            </span>
          </div>

        </div>

        <div className="mt-[var(--space-5)] pt-6 border-t border-[var(--border-secondary)] flex justify-center lg:justify-start">
          <button className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] hover:text-[var(--text-muted)] transition-colors uppercase tracking-widest underline underline-offset-4">
            View Complete Care Instructions
          </button>
        </div>

      </div>
    </section>
  );
}
