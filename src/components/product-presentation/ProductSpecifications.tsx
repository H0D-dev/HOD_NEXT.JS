"use client";

import React from "react";
import { Product, ProductVariation } from "./ProductPresentation";

interface ProductSpecificationsProps {
  product: Product;
  selectedVariation?: ProductVariation | null;
}

export default function ProductSpecifications({ product, selectedVariation }: ProductSpecificationsProps) {
  if (!product.details) return null;

  // Merge variation specific details (e.g. dimensions, weight) with parent static metadata
  const computedDetails = { ...product.details };
  
  if (selectedVariation) {
    if (selectedVariation.dimensions) {
      computedDetails.dimensions = selectedVariation.dimensions;
    }
    if (selectedVariation.weight) {
      computedDetails.weight = selectedVariation.weight;
    }
  }

  return (
    <section className="w-full bg-[var(--bg-secondary)] py-[var(--space-6)] lg:py-[var(--space-8)] px-[var(--space-4)] lg:px-[var(--space-8)] border-t border-[var(--border-secondary)]">
      <div className="lg:w-[45%] w-full">
        
        <h2 className="font-serif text-[var(--text-xl)] lg:text-[var(--text-2xl)] text-[var(--text-primary)] mb-[var(--space-5)] text-center lg:text-left">
          Product Specifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          
          {Object.entries(computedDetails).map(([key, value]) => {
            if (!value) return null;
            
            // Format camelCase keys to Title Case (e.g., careInstructions -> Care Instructions)
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());

            return (
              <div key={key} className="flex flex-col border-t border-[var(--border-primary)] pt-4">
                <span className="text-[var(--text-xs)] uppercase tracking-widest text-[var(--text-muted)] mb-1">{formattedKey}</span>
                <span className="font-sans text-[var(--text-md)] font-medium text-[var(--text-primary)]">
                  {value}
                </span>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
