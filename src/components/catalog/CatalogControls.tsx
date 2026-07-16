import React, { useState, useRef, useEffect } from "react";

interface CatalogControlsProps {
  onFilterClick: () => void;
  resultCount: number;
  sortOption: string;
  onSortChange: (value: string) => void;
}

export default function CatalogControls({ onFilterClick, resultCount, sortOption, onSortChange }: CatalogControlsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    { value: "default", label: "Sort by: Default" },
    { value: "newest", label: "Sort by: Newest" },
    { value: "popular", label: "Sort by: Popular" },
    { value: "price_asc", label: "Sort by: Price Low to High" },
    { value: "price_desc", label: "Sort by: Price High to Low" },
  ];

  const currentOptionLabel = sortOptions.find(o => o.value === sortOption)?.label || "Sort by: Default";

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

      <div className="relative w-full md:w-auto" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="appearance-none w-full md:w-auto border border-[var(--border-secondary)] bg-[var(--bg-primary)] px-6 py-3 pr-12 font-sans text-[var(--text-sm)] text-[var(--text-primary)] cursor-pointer hover:border-[var(--border-primary)] transition-colors outline-none rounded-none text-left flex items-center justify-between min-w-[240px]"
        >
          {currentOptionLabel}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-secondary)] shadow-xl z-50 flex flex-col py-2">
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  onSortChange(opt.value);
                  setIsDropdownOpen(false);
                }}
                className={`text-left px-6 py-3 font-sans text-[var(--text-sm)] transition-colors cursor-pointer w-full hover:bg-black/5 ${sortOption === opt.value ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Mobile only results count, shown below the sort */}
      <span className="font-sans text-[var(--text-sm)] text-[var(--text-muted)] uppercase tracking-widest block md:hidden self-center mt-2">
        {resultCount} Products
      </span>
    </div>
  );
}
