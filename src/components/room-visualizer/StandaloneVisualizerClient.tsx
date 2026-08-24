"use client";

import React, { Suspense, useEffect, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, ProductColor, ProductVariation } from "@/src/components/product-presentation/ProductPresentation";
import { useVisualizerStore } from "@/src/lib/store/useVisualizerStore";
import { useCartStore } from "@/src/lib/store/useCartStore";
import { useCurrencyStore } from "@/src/lib/store/useCurrencyStore";
import { formatPrice } from "@/src/lib/utils/price";
import { Share2, Code, ArrowLeft, ShoppingBag, Check, Layers, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import EmbedModal from "./EmbedModal";

const VisualizationCanvas = dynamic(
  () => import("./VisualizationCanvas"),
  { ssr: false, loading: () => <CanvasSkeleton /> }
);

function CanvasSkeleton() {
  return (
    <div className="flex h-full min-h-[600px] w-full items-center justify-center bg-[#0d0d0d] text-[#888]">
      <div className="flex flex-col items-center space-y-3 text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-[#d4b06a] border-t-transparent animate-spin"></div>
        <span className="tracking-widest uppercase text-[10px]">Initializing 3D Room Visualizer Engine...</span>
      </div>
    </div>
  );
}

// Curated sample products with authentic rug textures (flat top-down weaves for 3D warping)
const SAMPLE_STANDALONE_PRODUCTS: Product[] = [
  {
    id: "101",
    name: "Mystic Dunes Hand-Knotted Wool & Silk",
    slug: "mystic-dunes-hand-knotted-rug",
    description: "A luxury hand-knotted rug crafted in New Zealand wool and bamboo silk.",
    collection: "Signature Artisanal",
    design: "Modern Organic",
    price: 6450,
    regularPrice: 7200,
    stockStatus: "instock",
    productType: "simple",
    colors: [
      {
        id: "c1",
        name: "Desert Gold & Silk",
        code: "MD-01",
        textureUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1600&auto=format&fit=crop",
        lifestyleUrl: "/images/products/category-luxury.webp",
        hex: "#D4AF37",
        slug: "mystic-dunes-hand-knotted-rug",
      },
    ],
    details: {
      material: "New Zealand Wool & Pure Bamboo Silk",
      construction: "Hand-Knotted 100-Knot Density",
      origin: "Jaipur, India",
      weaveType: "Cut Pile",
      dimensions: "240 x 300 cm",
    },
    currencyPrices: { AED: 6450, USD: 1750, EUR: 1620 },
  },
  {
    id: "102",
    name: "Aura Botanical Embossed Silk Carpet",
    slug: "aura-botanical-silk-carpet",
    description: "Pure mulberry silk masterpiece hand-knotted by master weavers.",
    collection: "Imperial Silk",
    design: "Contemporary Abstract",
    price: 8900,
    regularPrice: 9500,
    stockStatus: "instock",
    productType: "simple",
    colors: [
      {
        id: "c2",
        name: "Platinum Slate",
        code: "AU-02",
        textureUrl: "/rugs/Custom-Rug.png",
        lifestyleUrl: "/images/craftsmanship/craft_hero.webp",
        hex: "#8C8D8E",
        slug: "aura-botanical-silk-carpet",
      },
    ],
    details: {
      material: "100% Pure Mulberry Silk",
      construction: "Master Hand-Knotted 150-Knot",
      origin: "Jaipur Atelier",
      weaveType: "Low Profile Luster Sheared",
      dimensions: "300 x 400 cm",
    },
    currencyPrices: { AED: 8900, USD: 2420, EUR: 2240 },
  },
  {
    id: "103",
    name: "Mirage Heritage Handloom Geometric",
    slug: "mirage-heritage-loom-rug",
    description: "Textured handloom rug crafted from high-twist mountain wool.",
    collection: "Heritage Revival",
    design: "Refined Geometric",
    price: 5200,
    regularPrice: 5800,
    stockStatus: "instock",
    productType: "simple",
    colors: [
      {
        id: "c3",
        name: "Oatmeal & Emerald",
        code: "MR-03",
        textureUrl: "/images/products/Product-hero.png",
        lifestyleUrl: "/images/products/category-geometric.webp",
        hex: "#C2B280",
        slug: "mirage-heritage-loom-rug",
      },
    ],
    details: {
      material: "High-Twist Highland Wool",
      construction: "Handloom Weave",
      origin: "India",
      weaveType: "Textured Loop & Cut",
      dimensions: "200 x 300 cm",
    },
    currencyPrices: { AED: 5200, USD: 1415, EUR: 1310 },
  },
  {
    id: "104",
    name: "Jaipur Royal Medallion Hand-Knotted Rug",
    slug: "jaipur-royal-medallion-rug",
    description: "Intricate Persian-inspired medallion crafted in pure gazni wool and luster silk.",
    collection: "Heritage Palatial",
    design: "Traditional Medallion",
    price: 9800,
    regularPrice: 11000,
    stockStatus: "instock",
    productType: "simple",
    colors: [
      {
        id: "c4",
        name: "Ivory & Champagne",
        code: "JR-04",
        textureUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
        lifestyleUrl: "/images/products/category-form.webp",
        hex: "#D4C29A",
        slug: "jaipur-royal-medallion-rug",
      },
    ],
    details: {
      material: "Gazni Hand-Spun Wool & Pure Silk",
      construction: "Hand-Knotted 120-Knot",
      origin: "Jaipur, India",
      weaveType: "Cut Pile",
      dimensions: "270 x 360 cm",
    },
    currencyPrices: { AED: 9800, USD: 2670, EUR: 2460 },
  },
];

interface StandaloneVisualizerInnerProps {
  initialProducts?: Product[];
}

function StandaloneVisualizerInner({ initialProducts = SAMPLE_STANDALONE_PRODUCTS }: StandaloneVisualizerInnerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productParam = searchParams.get("product");
  const isEmbedMode = searchParams.get("embed") === "true";

  const productsList = initialProducts && initialProducts.length > 0 ? initialProducts : SAMPLE_STANDALONE_PRODUCTS;

  const [activeProduct, setActiveProduct] = useState<Product>(() => {
    if (productParam) {
      const match = productsList.find((p) => p.slug === productParam);
      if (match) return match;
    }
    return productsList[0];
  });

  const [activeColor, setActiveColor] = useState<ProductColor>(() => {
    return (
      activeProduct.colors?.[0] || {
        id: "default",
        name: "Standard",
        code: "STD",
        textureUrl: "/rugs/Custom-Rug.png",
        lifestyleUrl: "/about_hero_desktop.png",
        hex: "#D4AF37",
        slug: activeProduct.slug,
      }
    );
  });

  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const { dispatch } = useVisualizerStore();
  const { addItem, openDrawer } = useCartStore();
  const { currency } = useCurrencyStore();

  // If query parameter changes, sync active product
  useEffect(() => {
    if (productParam) {
      const match = productsList.find((p) => p.slug === productParam);
      if (match && match.slug !== activeProduct.slug) {
        setActiveProduct(match);
        if (match.colors?.[0]) {
          setActiveColor(match.colors[0]);
        }
      }
    }
  }, [productParam, productsList, activeProduct.slug]);

  // Keep visualizer store synced with current active product texture
  useEffect(() => {
    if (activeColor?.textureUrl) {
      dispatch({
        type: "SET_PRODUCT",
        payload: {
          productId: activeProduct.id,
          size: { width: 240, height: 300 },
        },
      });
    }
  }, [activeColor, activeProduct.id, dispatch]);

  const handleProductChange = (prodSlug: string) => {
    const nextProd = productsList.find((p) => p.slug === prodSlug);
    if (nextProd) {
      setActiveProduct(nextProd);
      const nextColor = nextProd.colors?.[0] || {
        id: `c-${nextProd.id}`,
        name: "Standard",
        code: nextProd.sku || "STD",
        textureUrl: "/rugs/Custom-Rug.png",
        lifestyleUrl: "/about_hero_desktop.png",
        hex: "#D4AF37",
        slug: nextProd.slug,
      };
      setActiveColor(nextColor);
      router.replace(`/room-visualizer?product=${nextProd.slug}`, { scroll: false });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${activeProduct.name} in Room Visualizer | House of Decór`,
          text: `Preview ${activeProduct.name} in 3D using the House of Decór Room Visualizer.`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Share link copied to clipboard!");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard!");
    }
  };

  const handleAddToCart = () => {
    const numericId = parseInt(activeProduct.id, 10) || 101;
    const aedBasePrice = activeProduct.currencyPrices?.AED || activeProduct.price || 6450;
    const cartItem: any = {
      id: `${activeProduct.id}-${activeColor.id}-${activeProduct.details?.dimensions || "Standard"}`,
      productId: numericId,
      name: activeProduct.name,
      slug: activeProduct.slug,
      category: "rug",
      price: activeProduct.currencyPrices?.[currency] || activeProduct.price || 6450,
      basePrice: aedBasePrice,
      currency: currency || "AED",
      image: activeColor.textureUrl || "/about_hero_desktop.png",
      quantity: 1,
      variant: {
        color: activeColor.name,
        size: activeProduct.details?.dimensions || "240 x 300 cm",
        material: activeProduct.details?.material || "Premium Silk & Wool",
      },
    };
    addItem(cartItem);
    setIsAddedToCart(true);
    toast.success(`${activeProduct.name} added to cart!`);
    setTimeout(() => {
      setIsAddedToCart(false);
      openDrawer();
    }, 800);
  };

  const price = activeProduct.currencyPrices?.[currency] || activeProduct.price || 6450;

  return (
    <div
      data-lenis-prevent
      className={`fixed inset-0 ${isEmbedMode ? "top-0" : "top-16 lg:top-20"} z-30 flex flex-col bg-[#0d0d0d] text-[#f5f3ef] overflow-hidden select-none`}
    >
      {/* Top Controls Bar */}
      {!isEmbedMode && (
        <header className="shrink-0 h-14 bg-[#141414] border-b border-[#262626] px-4 md:px-6 flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <Link
              href="/products/rugs"
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#888] hover:text-[#f5f3ef] transition-colors"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Rugs Catalog</span>
            </Link>
            <div className="h-4 w-[1px] bg-[#333] hidden sm:block" />
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#d4b06a]" />
              <h1 className="font-sans text-xs md:text-sm font-medium tracking-wider uppercase text-[#f5f3ef] truncate max-w-[160px] sm:max-w-none">
                Virtual Room Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Product Switcher */}
            <div className="relative max-w-[150px] sm:max-w-[220px] md:max-w-[280px]">
              <select
                value={activeProduct.slug}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#333] text-xs text-[#f5f3ef] px-2.5 py-1.5 pr-7 rounded-none outline-none focus:border-[#d4b06a] cursor-pointer appearance-none truncate"
                aria-label="Select Rug Design"
              >
                {productsList.map((p) => (
                  <option key={p.slug} value={p.slug} className="bg-[#1f1f1f]">
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#888]">
                <Layers size={12} />
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1.5 border border-[#333] hover:border-[#555] bg-[#1a1a1a] text-xs text-[#ccc] hover:text-[#fff] transition-colors"
              title="Share setup link"
            >
              <Share2 size={13} />
              <span className="hidden md:inline">Share</span>
            </button>

            {/* Embed Button */}
            <button
              onClick={() => setIsEmbedModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 border border-[#333] hover:border-[#555] bg-[#1a1a1a] text-xs text-[#ccc] hover:text-[#fff] transition-colors"
              title="Embed widget"
            >
              <Code size={13} />
              <span className="hidden md:inline">Embed</span>
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-[#d4b06a] hover:bg-[#c39f59] text-black text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
            >
              {isAddedToCart ? <Check size={14} /> : <ShoppingBag size={14} />}
              <span className="hidden sm:inline">{isAddedToCart ? "Added" : `Order (${formatPrice(price, currency)})`}</span>
              <span className="sm:hidden">{isAddedToCart ? "Added" : "Order"}</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Visualizer Canvas Area (Strictly fills the remaining viewport height) */}
      <main className="flex-1 w-full h-[calc(100%-3.5rem)] overflow-hidden relative flex flex-col">
        <VisualizationCanvas
          product={activeProduct}
          activeColor={activeColor}
          onColorChange={setActiveColor}
          selectedVariation={selectedVariation}
          onVariationChange={setSelectedVariation}
          onClose={() => {}}
        />
      </main>

      {/* Embed Modal */}
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        productSlug={activeProduct.slug}
      />
    </div>
  );
}

export default function StandaloneVisualizerClient({ initialProducts }: { initialProducts?: Product[] }) {
  return (
    <Suspense fallback={<CanvasSkeleton />}>
      <StandaloneVisualizerInner initialProducts={initialProducts} />
    </Suspense>
  );
}
