"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductColor, Product } from "./ProductPresentation";

interface ProductInfoCardProps {
  product: Product & { sizes?: string[] };
  activeColor: ProductColor;
  onColorChange: (color: ProductColor) => void;
}

export default function ProductInfoCard({ product, activeColor, onColorChange }: ProductInfoCardProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  // Default sizes if none provided by API
  const sizes = product.sizes || ["170 x 240 cm", "200 x 300 cm", "250 x 350 cm", "300 x 400 cm", "Custom size"];
  const [activeSize, setActiveSize] = useState<string>(sizes[0]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="bg-white w-full lg:w-[480px] xl:w-[500px] p-[var(--space-3)] lg:p-[var(--space-4)] shadow-none lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-0 lg:border-t lg:border-l lg:border-b border-[var(--border-secondary)] lg:rounded-l-sm z-10 max-h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar flex flex-col"
    >
      {/* 1. Product Name */}
      <h1 className="font-serif text-[var(--text-xl)] lg:text-[var(--text-2xl)] leading-tight text-[var(--text-primary)] mb-2 shrink-0">
        {product.name} — {activeColor.name.split(' ')[0]}
      </h1>

      {/* 2. Product Description */}
      <p className="font-sans text-[var(--text-sm)] text-[var(--text-secondary)] leading-relaxed mb-4 shrink-0">
        {product.description || "Handcrafted premium carpet designed for sophisticated modern interiors. A quiet testament to artisanal excellence and timeless luxury."}
      </p>

      {/* Product Meta Section Removed */}

      {/* Type Selector Removed */}

      {/* 4. Colour Selector */}
      <div className="mb-4 shrink-0">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">Colour</h3>
          <div className="text-right">
            <p className="text-[var(--text-sm)] text-[var(--text-primary)] font-medium truncate w-32">{activeColor.name}</p>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x hide-scrollbar">
          {product.colors && product.colors.map((color) => (
            <button
              key={color.id}
              onClick={() => onColorChange(color)}
              className={`relative flex-shrink-0 w-10 h-10 rounded-none transition-transform duration-300 hover:scale-105 snap-center ${activeColor.id === color.id ? 'p-[2px] border border-[var(--border-primary)]' : 'border border-transparent'}`}
              aria-label={`Select color ${color.name}`}
            >
              <div 
                className="w-full h-full border border-black/10"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          ))}
          {product.colors && product.colors.length > 5 && (
            <button className="flex-shrink-0 w-10 h-10 border border-[var(--border-secondary)] flex items-center justify-center text-[9px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-primary)] snap-center">
              +20
            </button>
          )}
        </div>
      </div>

      {/* 5. Size Selector */}
      <div className="mb-6 shrink-0">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">Size</h3>
          <p className="text-[var(--text-xs)] text-[var(--text-muted)] underline cursor-pointer hover:text-[var(--text-primary)] transition-colors">Size guide</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setActiveSize(size)}
              className={`py-2 px-3 text-center text-[var(--text-sm)] font-medium transition-colors duration-300 border ${activeSize === size ? "border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)]" : "border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Action Buttons */}
      <div className="flex gap-2 mt-auto shrink-0 pt-2 border-t border-[var(--border-secondary)] lg:border-none lg:pt-0">
        <button className="flex-1 py-3 border border-[var(--border-primary)] bg-white text-[var(--text-primary)] font-medium text-[var(--text-sm)] transition-all duration-300 hover:bg-[var(--bg-secondary)]">
          Visualise
        </button>
        <button className="flex-1 py-3 border border-[var(--border-primary)] bg-[var(--text-primary)] text-white font-medium text-[var(--text-sm)] transition-all duration-300 hover:bg-black/80 hover:shadow-lg">
          Order Samples
        </button>
      </div>

    </motion.div>
  );
}
