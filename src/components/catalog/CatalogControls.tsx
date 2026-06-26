import React from "react";

interface CatalogControlsProps {
  onFilterClick: () => void;
  resultCount: number;
}

export default function CatalogControls({ onFilterClick, resultCount }: CatalogControlsProps) {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-4">
      <button 
        onClick={onFilterClick}
        className="flex items-center justify-center w-full md:w-auto gap-3 border border-[var(--border-primary)] px-8 py-3 font-sans text-[var(--text-sm)] uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
        Filters
      </button>

      <span className="font-sans text-[var(--text-sm)] text-[var(--text-muted)] uppercase tracking-widest md:block hidden">
        {resultCount} Products
      </span>

      <div className="relative w-full md:w-auto">
        <select className="appearance-none w-full md:w-auto border border-[var(--border-secondary)] bg-transparent px-6 py-3 pr-12 font-sans text-[var(--text-sm)] text-[var(--text-primary)] cursor-pointer hover:border-[var(--border-primary)] transition-colors outline-none rounded-none focus:border-[var(--border-primary)]">
          <option value="default">Sort by: Default</option>
          <option value="newest">Sort by: Newest</option>
          <option value="popular">Sort by: Popular</option>
          <option value="price_asc">Sort by: Price Low to High</option>
          <option value="price_desc">Sort by: Price High to Low</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Mobile only results count, shown below the sort */}
      <span className="font-sans text-[var(--text-sm)] text-[var(--text-muted)] uppercase tracking-widest block md:hidden self-center mt-2">
        {resultCount} Products
      </span>
    </div>
  );
}
