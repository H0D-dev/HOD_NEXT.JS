"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ProductColor, Product, ProductVariation } from "./ProductPresentation";
import { useCartStore } from "@/src/lib/store/useCartStore";
import { useCurrencyStore } from "@/src/lib/store/useCurrencyStore";
import { formatPrice } from "@/src/lib/utils/price";
import toast from "react-hot-toast";

interface ProductInfoCardProps {
  product: Product & { sizes?: string[] };
  activeColor: ProductColor;
  onColorChange: (color: ProductColor) => void;
  selectedVariation: ProductVariation | null;
  onVariationChange: (variation: ProductVariation | null) => void;
}

export default function ProductInfoCard({ product, activeColor, onColorChange, selectedVariation, onVariationChange }: ProductInfoCardProps) {
  const router = useRouter();
  const { addItem, openDrawer } = useCartStore();
  const { currency, setCurrency } = useCurrencyStore();

  const isVariable = product.productType === "variable" && Array.isArray(product.variations) && product.variations.length > 0;


  // Fallback sizes for simple products with no variations
  const fallbackSizes = product.sizes || ["170 x 240 cm", "200 x 300 cm", "250 x 350 cm", "300 x 400 cm", "Custom size"];
  const [activeSize, setActiveSize] = useState<string>(fallbackSizes[0]);

  // --- Derived display values ---
  const { displayPrice, isFallbackPrice } = useMemo(() => {
    let priceToUse = 0;
    let isFallback = false;

    if (isVariable && selectedVariation) {
      const currencyPrice = selectedVariation.currencyPrices?.[currency];
      if (currencyPrice && currencyPrice > 0) {
        priceToUse = currencyPrice;
      } else {
        priceToUse = selectedVariation.currencyPrices?.AED || 0;
        if (currency !== "AED") isFallback = true;
      }
    } else {
      const currencyPrice = product.currencyPrices?.[currency];
      if (currencyPrice && currencyPrice > 0) {
        priceToUse = currencyPrice;
      } else {
        priceToUse = product.currencyPrices?.AED || 0;
        if (currency !== "AED") isFallback = true;
      }
    }
    return { displayPrice: priceToUse, isFallbackPrice: isFallback };
  }, [isVariable, selectedVariation, product.currencyPrices, currency]);

  const displayRegularPrice = useMemo(() => {
    if (currency !== "AED") return undefined; // Manual prices don't currently have a regular vs sale distinction
    if (isVariable && selectedVariation) {
      const vRegPrice = selectedVariation.regularPrice || 0;
      if (vRegPrice > 0) return vRegPrice;
    }
    return product.regularPrice;
  }, [isVariable, selectedVariation, product.regularPrice, currency]);

  const displayOnSale = useMemo(() => {
    if (isVariable && selectedVariation) {
      return selectedVariation.onSale;
    }
    return product.onSale;
  }, [isVariable, selectedVariation, product.onSale]);

  const displayDimensions = useMemo(() => {
    if (isVariable && selectedVariation && selectedVariation.dimensions) {
      return selectedVariation.dimensions;
    }
    return product.details?.dimensions;
  }, [isVariable, selectedVariation, product.details?.dimensions]);

  const displaySku = useMemo(() => {
    if (isVariable && selectedVariation && selectedVariation.sku) {
      return selectedVariation.sku;
    }
    return product.sku || activeColor.code;
  }, [isVariable, selectedVariation, product.sku, activeColor.code]);

  const displayWeight = useMemo(() => {
    if (isVariable && selectedVariation && selectedVariation.weight) {
      return selectedVariation.weight;
    }
    return product.details?.weight;
  }, [isVariable, selectedVariation, product.details?.weight]);

  const displayStockStatus = useMemo(() => {
    if (isVariable && selectedVariation && selectedVariation.stockStatus) {
      return selectedVariation.stockStatus;
    }
    return product.stockStatus;
  }, [isVariable, selectedVariation, product.stockStatus]);

  // --- Handlers ---
  const handleSizeClick = (variation: ProductVariation) => {
    onVariationChange(variation);
  };

  const handleAddToCart = () => {
    const numericId = typeof product.id === "string" ? parseInt(product.id, 10) : Number(product.id);
    const isRug = product.category?.toLowerCase().includes("rug") ?? true;

    const cartItem: any = {
      id: isVariable && selectedVariation
        ? `${product.id}-${selectedVariation.id}-${activeColor.id}`
        : `${product.id}-${activeColor.id}-${isVariable ? (product.details?.dimensions || "Standard Size") : activeSize}`,
      productId: numericId || 0,
      slug: product.slug,
      name: product.name,
      category: isRug ? "rug" : "curtain",
      image: activeColor.textureUrl || product.image || "/rugs/set1-room.png",
      price: displayPrice,
      currency: isFallbackPrice ? "AED" : currency,
      quantity: 1,
      variant: {
        color: activeColor.name,
        size: isVariable && selectedVariation ? selectedVariation.label : (product.details?.dimensions || activeSize),
        material: product.details?.material || "Premium Blend",
      },
    };

    // Include variation ID for WooCommerce order accuracy.
    // id: 0 is a synthetic parent-size entry — no variation_id needed.
    if (isVariable && selectedVariation && selectedVariation.id > 0) {
      cartItem.variationId = selectedVariation.id;
    }

    const result = addItem(cartItem);
    
    if (!result.success) {
      toast.error(result.error || "Failed to add item to cart.");
      return;
    }

    if (result.lockedCurrency && result.lockedCurrency !== currency) {
      setCurrency(result.lockedCurrency as any);
      toast.success(`Global currency auto-updated to ${result.lockedCurrency} to match your cart.`, {
        duration: 5000,
        icon: '💱'
      });
    }
    
    openDrawer();
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any, delay: 0.2 }}
      className="bg-white w-full lg:w-[480px] xl:w-[500px] p-[var(--space-3)] lg:p-[var(--space-4)] shadow-none lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-0 lg:border-t lg:border-l lg:border-b border-[var(--border-secondary)] lg:rounded-l-sm z-10 max-h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar flex flex-col"
    >
      {/* 1. Product Name */}
      <h1 className="font-serif text-[var(--text-xl)] lg:text-[var(--text-2xl)] leading-tight text-[var(--text-primary)] mb-2 shrink-0">
        {product.name}
      </h1>

      {/* 2. Price */}
      {displayPrice !== undefined && (
        <div className="mb-2 shrink-0">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-[var(--text-2xl)] lg:text-[var(--text-3xl)] text-[var(--text-primary)] font-semibold">
              {formatPrice(displayPrice, isFallbackPrice ? "AED" : currency)}
            </span>
            {displayOnSale && displayRegularPrice && displayRegularPrice > displayPrice && (
              <span className="text-[var(--text-md)] lg:text-[var(--text-lg)] text-[var(--text-muted)] line-through">
                {formatPrice(displayRegularPrice, isFallbackPrice ? "AED" : currency)}
              </span>
            )}
          </div>
          {isFallbackPrice && (
            <p className="text-[11px] text-orange-600 mt-1">
              * {currency} pricing not available for this product. Showing in AED.
            </p>
          )}
        </div>
      )}

      {/* 3. Product Description */}
      <p className="font-sans text-[var(--text-sm)] text-[var(--text-secondary)] leading-relaxed mb-4 shrink-0">
        {product.description || "Handcrafted premium product designed for sophisticated modern interiors."}
      </p>

      {/* 4. Colour Selector */}
      <div className="mb-4 shrink-0">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">Colour</h3>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 snap-x hide-scrollbar">
          {product.colors && product.colors.map((color) => (
            <button
              key={color.id}
              onClick={() => {
                if (color.slug && color.slug !== product.slug && product.categorySlug) {
                  router.push(`/products/${product.categorySlug}/${color.slug}`);
                } else {
                  onColorChange(color);
                }
              }}
              className={`relative flex-shrink-0 w-10 h-10 rounded-none transition-transform duration-300 hover:scale-105 snap-center ${activeColor.id === color.id ? 'p-[2px] border border-[var(--border-primary)]' : 'border border-transparent'}`}
              aria-label={`Select color ${color.name}`}
            >
              {color.textureUrl || color.lifestyleUrl ? (
                <img
                  src={color.textureUrl || color.lifestyleUrl}
                  alt={color.name}
                  className="w-full h-full object-cover border border-black/10"
                />
              ) : (
                <div
                  className="w-full h-full border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
              )}
            </button>
          ))}
          {product.colors && product.colors.length > 5 && (
            <button className="flex-shrink-0 w-10 h-10 border border-[var(--border-secondary)] flex items-center justify-center text-[9px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-primary)] snap-center">
              +{product.colors.length - 5}
            </button>
          )}
        </div>
      </div>

      {/* 5. Size Selector */}
      {isVariable && (
        <div className="mb-6 shrink-0">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">Size</h3>
            <p className="text-[var(--text-xs)] text-[var(--text-muted)] underline cursor-pointer hover:text-[var(--text-primary)] transition-colors">Size guide</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {product.variations!.map((variation) => {
              const isActive = selectedVariation?.id === variation.id;
              const isOutOfStock = variation.stockStatus === "outofstock";
              return (
                <button
                  key={variation.id}
                  onClick={() => !isOutOfStock && handleSizeClick(variation)}
                  disabled={isOutOfStock}
                  className={`py-2 px-3 text-center text-[var(--text-sm)] font-medium transition-colors duration-300 border ${isOutOfStock
                      ? "border-[var(--border-secondary)] text-[var(--text-muted)] opacity-50 cursor-not-allowed line-through"
                      : isActive
                        ? "border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                        : "border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
                    }`}
                >
                  {variation.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Quick Specs (dimensions/weight/sku from selected variation) */}
      {(displayDimensions || displaySku || displayStockStatus) && (
        <div className="mb-4 shrink-0 flex flex-wrap gap-x-6 gap-y-1 text-[var(--text-xs)] text-[var(--text-muted)]">
          {displayDimensions && <span>Dimensions: {displayDimensions}</span>}
          {displayWeight && <span>Weight: {displayWeight}</span>}
          {displaySku && <span>SKU: {displaySku}</span>}
          {displayStockStatus && (
            <span className={`font-medium ${displayStockStatus === "instock" ? "text-green-600" : "text-red-600"}`}>
              {displayStockStatus === "instock" ? "In Stock" : displayStockStatus === "outofstock" ? "Out of Stock" : "On Backorder"}
            </span>
          )}
        </div>
      )}

      {/* 7. Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto shrink-0 pt-2 lg:pt-0">
        <div className="flex gap-2">
          <button className="flex-1 py-3 border border-[var(--border-primary)] bg-white text-[var(--text-primary)] font-medium text-[var(--text-sm)] transition-all duration-300 hover:bg-[var(--bg-secondary)]">
            Visualise
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-[var(--accent-primary)] text-[#111] font-medium text-[var(--text-sm)] transition-all duration-300 hover:bg-[var(--accent-secondary)]"
          >
            Add to Cart
          </button>
        </div>
      </div>

    </motion.div>
  );
}
