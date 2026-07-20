"use client";
import React, { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfoCard from "./ProductInfoCard";
import ExploreMore from "./ExploreMore";

export type Currency = "AED" | "INR" | "USD" | "EUR";

export type CurrencyPrices = {
  AED: number;
  INR?: number;
  USD?: number;
  EUR?: number;
};

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
  currencyPrices: CurrencyPrices;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
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
  stockStatus?: string;
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
  defaultVariationId?: number;
  relatedIds?: number[];
  currencyPrices: CurrencyPrices;
};

interface ProductPresentationProps {
  product: Product | null;
  relatedProducts?: Product[];
}

export default function ProductPresentation({ product, relatedProducts }: ProductPresentationProps) {
  // Ensure we handle missing data gracefully
  const [activeColor, setActiveColor] = useState<ProductColor | null>(
    product?.colors?.[0] || null
  );

  // Initialize selected variation to the default from WooCommerce, or the first valid variation
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(() => {
    if (product?.productType === "variable" && product.variations && product.variations.length > 0) {
      if (product.defaultVariationId) {
        const def = product.variations.find((v) => v.id === product.defaultVariationId);
        if (def) return def;
      }
      return product.variations[0];
    }
    return null;
  });

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
      <section className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 lg:pt-28 pb-16 px-6 lg:px-24">
        <div className="max-w-[1300px] mx-auto mb-6 font-sans text-[10px] md:text-xs text-[var(--text-secondary)] tracking-wider uppercase">
          <span className="mr-2 font-light">/</span>
          <span className="text-[var(--text-primary)] font-light">{product.name}</span>
        </div>
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-[55%_45%] xl:grid-cols-[58%_42%] gap-10 lg:gap-0 relative">

          {/* Left Side: Product Image Gallery */}
          <div className="w-full lg:pr-8 xl:pr-10 lg:border-r lg:border-[var(--border-secondary)]">
            <ProductGallery product={product} activeColor={activeColor} />
          </div>

          {/* Right Side: Product Information */}
          <div className="w-full lg:pl-8 xl:pl-10">
            <ProductInfoCard
              product={product}
              activeColor={activeColor}
              onColorChange={setActiveColor}
              selectedVariation={selectedVariation}
              onVariationChange={setSelectedVariation}
            />
          </div>

        </div>
      </section>

      <ExploreMore relatedProducts={relatedProducts} />
    </>
  );
}
