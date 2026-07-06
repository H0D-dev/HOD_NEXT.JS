import React from "react";
import FeaturedProductsClientSection from "./FeaturedProductsClientSection";
import { getFeaturedProducts } from "@/src/lib/product/getFeaturedProducts";

const MOCK_RUGS_PRODUCTS = [
  {
    id: "r1",
    name: "Persian Heritage",
    category: "Hand Knotted",
    price: "From ₹24,999",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "persian-heritage"
  },
  {
    id: "r2",
    name: "Oasis Weave",
    category: "Flat Weave",
    price: "From ₹12,499",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "oasis-weave"
  },
  {
    id: "r3",
    name: "Modern Minimalist",
    category: "Hand Tufted",
    price: "From ₹18,999",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "modern-minimalist"
  },
  {
    id: "r4",
    name: "Vintage Anatolian",
    category: "Hand Knotted",
    price: "From ₹32,000",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "vintage-anatolian"
  },
  {
    id: "r5",
    name: "Nomad Tribal",
    category: "Flat Weave",
    price: "From ₹15,499",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "nomad-tribal"
  },
  {
    id: "r6",
    name: "Silk Cascade",
    category: "Hand Tufted",
    price: "From ₹45,000",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "silk-cascade"
  }
];

const MOCK_CURTAINS_PRODUCTS = [
  {
    id: "c1",
    name: "Velvet Drape",
    category: "Blackout",
    price: "From ₹8,999",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    slug: "velvet-drape"
  },
  {
    id: "c2",
    name: "Linen Sheer",
    category: "Sheer",
    price: "From ₹5,499",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    slug: "linen-sheer"
  },
  {
    id: "c3",
    name: "Silk Elegance",
    category: "Luxury",
    price: "From ₹14,999",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    slug: "silk-elegance"
  },
  {
    id: "c4",
    name: "Cotton Classic",
    category: "Standard",
    price: "From ₹4,000",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    slug: "cotton-classic"
  },
  {
    id: "c5",
    name: "Embroidered Panel",
    category: "Luxury",
    price: "From ₹12,999",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    slug: "embroidered-panel"
  },
  {
    id: "c6",
    name: "Thermal Weave",
    category: "Blackout",
    price: "From ₹7,499",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    slug: "thermal-weave"
  }
];

export default async function FeaturedProductsSection() {
  // Fetch products from WooCommerce API
  const rugsProducts = await getFeaturedProducts("rugs");
  const curtainsProducts = await getFeaturedProducts("curtains");

  // Fallback to mock data if the API returns an empty array
  const finalRugs = rugsProducts.length > 0 ? rugsProducts : MOCK_RUGS_PRODUCTS;
  const finalCurtains = curtainsProducts.length > 0 ? curtainsProducts : MOCK_CURTAINS_PRODUCTS;

  return (
    <FeaturedProductsClientSection 
      rugsProducts={finalRugs} 
      curtainsProducts={finalCurtains} 
    />
  );
}
