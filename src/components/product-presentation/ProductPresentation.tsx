"use client";

import React, { useState } from "react";
import ProductTextureView from "./ProductTextureView";
import ProductDetailsArea from "./ProductDetailsArea";
import ProductSpecifications from "./ProductSpecifications";

export type ProductColor = {
  id: string;
  name: string;
  code: string;
  textureUrl: string;
  lifestyleUrl: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  collection: string;
  design: string;
  colors: ProductColor[];
  sizes?: string[];
  details?: {
    material: string;
    construction: string;
    origin: string;
    weaveType: string;
  };
};

interface ProductPresentationProps {
  product: Product | null;
}

export default function ProductPresentation({ product }: ProductPresentationProps) {
  // Ensure we handle missing data gracefully
  const [activeColor, setActiveColor] = useState<ProductColor | null>(
    product?.colors?.[0] || null
  );

  // Fallback UI for missing data
  if (!product || !activeColor) {
    return (
      <div className="w-full min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <p className="text-[var(--text-muted)] text-lg">Loading product details...</p>
      </div>
    );
  }

  return (
    <>
      <section className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 lg:pt-24">
        {/* 
          Desktop: 45/55 split 
          Tablet: 50/50 split 
          Mobile: single column 
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-[45%_55%] min-h-[calc(100vh-6rem)]">
          <ProductTextureView activeColor={activeColor} />
          <ProductDetailsArea 
            product={product} 
            activeColor={activeColor} 
            onColorChange={setActiveColor} 
          />
        </div>
      </section>

      {/* New Specifications Section Below */}
      <ProductSpecifications product={product} />
    </>
  );
}
