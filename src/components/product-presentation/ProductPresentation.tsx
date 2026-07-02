"use client";

import React, { useState } from "react";
import ProductTextureView from "./ProductTextureView";
import ProductDetailsArea from "./ProductDetailsArea";
import ProductSpecifications from "./ProductSpecifications";
import ProductInfoCard from "./ProductInfoCard";
import ExploreMore from "./ExploreMore";

export type ProductColor = {
  id: string;
  name: string;
  code: string;
  textureUrl: string;
  lifestyleUrl: string;
  hex: string;
  slug?: string;
};

export type ProductVariation = {
  id: number;
  sku: string;
  price: number;
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  stockStatus: string;
  dimensions: string;
  weight?: string;
  attributes: { name: string; option: string }[];
  /** Computed label like "200 x 300 cm" from variation attributes */
  label: string;
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
  price?: number;
  regularPrice?: number;
  salePrice?: number;
  onSale?: boolean;
  sku?: string;
  category?: string;
  categorySlug?: string;
  image?: string;
  productType?: "simple" | "variable" | "grouped" | "external";
  variations?: ProductVariation[];
  details?: {
    material?: string;
    construction?: string;
    origin?: string;
    weaveType?: string;
    careInstructions?: string;
    dimensions?: string;
    weight?: string;
    petFriendly?: string;
    washable?: string;
    [key: string]: string | undefined;
  };
};

interface ProductPresentationProps {
  product: Product | null;
}

export default function ProductPresentation({ product }: ProductPresentationProps) {
  // Log the product to the browser console for debugging
  console.log("Current Product data:", product);

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
      <div className="relative w-full">
      {/* Sticky Card overlay (Desktop only) spanning across Hero and Specs */}
      <div className="absolute inset-y-0 right-0 w-full pointer-events-none z-30 hidden lg:block">
        <div className="sticky top-[104px] lg:top-28 flex justify-end px-[var(--space-6)] xl:px-[var(--space-8)] pointer-events-auto">
          <ProductInfoCard 
            product={product} 
            activeColor={activeColor} 
            onColorChange={setActiveColor} 
          />
        </div>
      </div>

      <section className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 lg:pt-24 relative z-10">
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
      <div className="relative z-20">
        <ProductSpecifications product={product} />
      </div>
    </div>
    
    <ExploreMore />
    </>
  );
}
