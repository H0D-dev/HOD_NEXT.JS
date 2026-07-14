"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Share2, Globe, ShieldCheck, Clock, Truck, Plus, Minus } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);

  const isVariable = product.productType === "variable" && Array.isArray(product.variations) && product.variations.length > 0;

  // Fallback sizes for simple products with no variations
  const fallbackSizes = product.sizes || ["170 x 240 cm", "200 x 300 cm", "250 x 350 cm", "300 x 400 cm"];
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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at House of Décor`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        } catch (clipboardError) {
          toast.error("Failed to copy link");
        }
      }
    }
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
      quantity: quantity,
      variant: {
        color: activeColor.name,
        size: isVariable && selectedVariation ? selectedVariation.label : (product.details?.dimensions || activeSize),
        material: product.details?.material || "Premium Blend",
      },
    };

    // Include variation ID for WooCommerce order accuracy.
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any, delay: 0.2 }}
      className="w-full flex flex-col gap-4 pb-12"
    >
      {/* 1. Header (Collection, Title, Share) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-muted)]">
            {product.collection || product.category || "COLLECTION"}
          </span>
          <button 
            onClick={handleShare}
            className="text-[var(--text-primary)] hover:text-[var(--text-muted)] transition-colors"
            aria-label="Share product"
          >
            <Share2 size={20} strokeWidth={1.5} />
          </button>
        </div>
        <h1 className="font-serif text-2xl lg:text-3xl font-light text-[var(--text-primary)] leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[var(--border-secondary)] opacity-60" />

      {/* 2. Description */}
      <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
        {product.description || "A contemporary hand-tufted rug inspired by natural landscapes, crafted using New Zealand wool and bamboo silk for exceptional softness and depth."}
      </p>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[var(--border-secondary)] opacity-60" />

      {/* 3. Starting Price */}
      {displayPrice !== undefined && (
        <div className="flex flex-col gap-1">
          <span className="font-sans text-xs text-[var(--text-secondary)]">Starting from</span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl md:text-3xl text-[var(--text-primary)]">
              {formatPrice(displayPrice, isFallbackPrice ? "AED" : currency)}
            </span>
            {displayOnSale && displayRegularPrice && displayRegularPrice > displayPrice && (
              <span className="text-sm text-[var(--text-muted)] line-through">
                {formatPrice(displayRegularPrice, isFallbackPrice ? "AED" : currency)}
              </span>
            )}
          </div>
          <span className="font-sans text-xs text-[var(--text-muted)] mt-1">Includes VAT</span>
          {isFallbackPrice && (
            <p className="text-[10px] text-orange-600 mt-1">
              * {currency} pricing not available. Showing in AED.
            </p>
          )}
        </div>
      )}

      {/* 4. Colour Selector */}
      <div className="flex flex-col gap-4">
        <div className="font-sans text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">
          COLOUR: <span className="font-normal text-[var(--text-secondary)] normal-case tracking-normal">{activeColor.name}</span>
        </div>

        <div className="flex flex-wrap gap-4">
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
              className={`relative flex-shrink-0 w-12 h-12 rounded-full transition-all duration-300 ${activeColor.id === color.id ? 'ring-1 ring-offset-2 ring-[var(--text-primary)]' : 'hover:scale-105'}`}
              aria-label={`Select color ${color.name}`}
            >
              <div className="w-full h-full rounded-full overflow-hidden border border-[var(--border-secondary)]">
                {color.textureUrl || color.lifestyleUrl ? (
                  <img
                    src={color.textureUrl || color.lifestyleUrl}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: color.hex }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Size Selector */}
      {isVariable && (
        <div className="flex flex-col gap-3">
          <div className="font-sans text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">
            SIZE: <span className="font-normal text-[var(--text-secondary)] normal-case tracking-normal">{selectedVariation?.label || activeSize}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {product.variations!.map((variation) => {
              const isActive = selectedVariation?.id === variation.id;
              const isOutOfStock = variation.stockStatus === "outofstock";
              return (
                <button
                  key={variation.id}
                  onClick={() => !isOutOfStock && handleSizeClick(variation)}
                  disabled={isOutOfStock}
                  className={`py-2.5 px-5 rounded-full font-sans text-xs md:text-sm text-center transition-colors duration-300 border ${
                    isOutOfStock
                      ? "border-[var(--border-secondary)] text-[var(--text-muted)] opacity-50 cursor-not-allowed line-through"
                      : isActive
                        ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]"
                        : "border-[var(--border-secondary)] text-[var(--text-primary)] hover:border-[var(--text-primary)] bg-transparent"
                  }`}
                >
                  {variation.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Quantity & Add to Cart */}
      <div className="flex flex-col gap-3">
        <div className="font-sans text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">
          QUANTITY
        </div>
        <div className="flex items-center border border-[var(--border-secondary)] w-fit rounded-sm overflow-hidden bg-transparent">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <Minus size={14} strokeWidth={2} />
          </button>
          <div className="w-10 h-10 flex items-center justify-center font-sans text-sm font-medium text-[var(--text-primary)]">
            {quantity}
          </div>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="font-sans text-xs text-[var(--text-secondary)]">
          Estimated Delivery: 8-12 Weeks
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full py-4 bg-[#A38A61] hover:bg-[#8F7752] text-white font-sans text-xs tracking-widest uppercase font-medium transition-colors duration-300"
        >
          Add to Cart
        </button>
        <button className="w-full py-4 border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] font-sans text-xs tracking-widest uppercase font-medium transition-colors duration-300 hover:bg-[var(--bg-secondary)]">
          Request Customisation
        </button>
      </div>

      {/* 8. Trust Badges / Icons */}
      <div className="flex justify-between items-start mt-6 pt-5 border-t border-[var(--border-secondary)]">
        <div className="flex flex-col items-center gap-2 flex-1 text-center">
          <Globe size={24} strokeWidth={1} className="text-[var(--text-primary)]" />
          <span className="font-sans text-[10px] text-[var(--text-secondary)] leading-tight max-w-[80px]">Handcrafted</span>
        </div>
        <div className="flex flex-col items-center gap-2 flex-1 text-center">
          <Truck size={24} strokeWidth={1} className="text-[var(--text-primary)]" />
          <span className="font-sans text-[10px] text-[var(--text-secondary)] leading-tight max-w-[80px]">Worldwide Shipping</span>
        </div>
        <div className="flex flex-col items-center gap-2 flex-1 text-center">
          <Clock size={24} strokeWidth={1} className="text-[var(--text-primary)]" />
          <span className="font-sans text-[10px] text-[var(--text-secondary)] leading-tight max-w-[80px]">Made to Order</span>
        </div>
        <div className="flex flex-col items-center gap-2 flex-1 text-center">
          <ShieldCheck size={24} strokeWidth={1} className="text-[var(--text-primary)]" />
          <span className="font-sans text-[10px] text-[var(--text-secondary)] leading-tight max-w-[80px]">Secure Payment</span>
        </div>
      </div>

    </motion.div>
  );
}
