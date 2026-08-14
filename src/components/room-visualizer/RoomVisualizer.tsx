'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Product, ProductColor, ProductVariation } from '@/src/components/product-presentation/ProductPresentation';
import { useCartStore } from '@/src/lib/store/useCartStore';
import { useCurrencyStore } from '@/src/lib/store/useCurrencyStore';
import { formatPrice } from '@/src/lib/utils/price';
import toast from 'react-hot-toast';
import { ArrowLeft, ShieldCheck, X, ShoppingBag, Check } from 'lucide-react';

const VisualizationCanvas = dynamic(
  () => import('./VisualizationCanvas'),
  { ssr: false, loading: () => <CanvasSkeleton /> }
);

function CanvasSkeleton() {
  return (
    <div className="flex h-full min-h-[500px] w-full items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)]">
      <div className="flex items-center space-x-2 text-xs">
        <div className="w-4 h-4 rounded-full border-2 border-[#A38A61] border-t-transparent animate-spin"></div>
        <span>Initializing Room Visualizer Engine...</span>
      </div>
    </div>
  );
}

interface RoomVisualizerProps {
  product: Product;
  activeColor: ProductColor;
  onColorChange: (color: ProductColor) => void;
  selectedVariation: ProductVariation | null;
  onVariationChange: (variation: ProductVariation | null) => void;
  onClose: () => void;
}

export default function RoomVisualizer({
  product,
  activeColor,
  onColorChange,
  selectedVariation,
  onVariationChange,
  onClose,
}: RoomVisualizerProps) {
  const [mounted, setMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const { addItem, openDrawer } = useCartStore();
  const { currency, setCurrency } = useCurrencyStore();

  const isVariable = product.productType === 'variable' && Array.isArray(product.variations) && product.variations.length > 0;

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

  const displayStockStatus = useMemo(() => {
    if (isVariable && selectedVariation && selectedVariation.stockStatus) {
      return selectedVariation.stockStatus;
    }
    return product.stockStatus;
  }, [isVariable, selectedVariation, product.stockStatus]);

  const isOutOfStock = displayStockStatus === "outofstock";

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product variant is currently out of stock.");
      return;
    }

    const numericId = typeof product.id === "string" ? parseInt(product.id, 10) : Number(product.id);
    const isRug = product.category?.toLowerCase().includes("rug") ?? true;

    const cartItem: any = {
      id: isVariable && selectedVariation
        ? `${product.id}-${selectedVariation.id}-${activeColor.id}`
        : `${product.id}-${activeColor.id}-${product.details?.dimensions || "Standard Size"}`,
      productId: numericId || 0,
      slug: product.slug,
      name: product.name,
      category: isRug ? "rug" : "curtain",
      image: activeColor.textureUrl || product.image || "/products_hero.png",
      price: displayPrice,
      currency: isFallbackPrice ? "AED" : currency,
      quantity: 1,
      variant: {
        color: activeColor.name,
        size: isVariable && selectedVariation ? selectedVariation.label : (product.details?.dimensions || "Standard Size"),
        material: product.details?.material || "Premium Blend",
      },
    };

    if (isVariable && selectedVariation && selectedVariation.id > 0) {
      cartItem.variationId = selectedVariation.id;
    }

    const result = addItem(cartItem);

    if (!result.success) {
      toast.error(result.error || "Failed to add item to cart.");
      return;
    }

    // Success feedback
    setIsAdded(true);
    toast.success(`"${product.name}" added to your cart!`, {
      duration: 3500,
      icon: '🛍️',
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 2500);

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
    <div className="fixed inset-0 z-[2000] flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] animate-in fade-in duration-300">
      {/* Studio Header Bar */}
      <header className="shrink-0 border-b border-[var(--border-secondary)] bg-[var(--bg-secondary)] px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="inline-flex items-center space-x-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Back to Product Page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Product</span>
          </button>
          <div className="h-4 w-px bg-[var(--border-secondary)]"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#2B2B2B] flex items-center justify-center text-white font-bold text-xs">
              H
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)] tracking-tight">
              House of Décor
            </span>
            <span className="hidden sm:inline text-[var(--text-muted)] text-xs">/</span>
            <span className="hidden sm:inline text-xs font-medium text-[var(--text-secondary)]">
              Room Visualizer Studio
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
              isOutOfStock
                ? "bg-[var(--surface-secondary)] text-[var(--text-muted)] border border-[var(--border-secondary)] line-through cursor-not-allowed"
                : isAdded
                ? "bg-emerald-700 text-white"
                : "bg-[#A38A61] hover:bg-[#8F7752] text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ADDED TO CART!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isOutOfStock ? "OUT OF STOCK" : `[ ${formatPrice(displayPrice, isFallbackPrice ? "AED" : currency)} ] ADD TO CART`}</span>
              </>
            )}
          </button>

          <span className="hidden md:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] text-[11px] font-medium text-[var(--text-primary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89970]" />
            <span>Studio Engine Ready</span>
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-secondary)] hover:border-[var(--border-primary)] transition-colors text-[var(--text-primary)] cursor-pointer"
            aria-label="Close Visualizer Studio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="flex-1 overflow-hidden relative">
        {mounted ? (
          <VisualizationCanvas
            product={product}
            activeColor={activeColor}
            onColorChange={onColorChange}
            selectedVariation={selectedVariation}
            onVariationChange={onVariationChange}
            onClose={onClose}
          />
        ) : (
          <CanvasSkeleton />
        )}
      </main>
    </div>
  );
}
