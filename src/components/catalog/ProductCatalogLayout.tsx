"use client";

import React, { useState } from "react";
import CatalogHeader from "./CatalogHeader";
import CatalogControls from "./CatalogControls";
import ProductGrid from "./ProductGrid";
import FilterDrawer from "./FilterDrawer";
import { RUGS_CONFIG, CURTAINS_CONFIG } from "../../lib/catalogConfig";

interface ProductCatalogLayoutProps {
  category: "rugs" | "curtains";
}

export default function ProductCatalogLayout({ category }: ProductCatalogLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const config = category === "rugs" ? RUGS_CONFIG : CURTAINS_CONFIG;
  const baseRoute = `/products/${category}`;

  return (
    <div className="w-full bg-[var(--bg-primary)] min-h-screen pt-20">
      <div className="max-w-[var(--container-lg)] mx-auto px-[var(--space-4)] lg:px-[var(--space-8)] pb-24">
        
        <CatalogHeader title={config.title} subtitle={config.subtitle} />
        
        <CatalogControls 
          onFilterClick={() => setIsFilterOpen(true)} 
          resultCount={config.products.length} 
        />
        
        <ProductGrid products={config.products} baseRoute={baseRoute} />

        {/* Load More Button - Static for demo */}
        <div className="w-full flex justify-center mt-16 lg:mt-24">
          <button className="bg-[var(--accent-primary)] text-[#111] px-12 py-4 font-sans text-[var(--text-sm)] uppercase tracking-widest hover:bg-[var(--accent-secondary)] transition-colors border-none">
            Load More
          </button>
        </div>

      </div>

      <FilterDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={config.filters} 
      />
    </div>
  );
}
