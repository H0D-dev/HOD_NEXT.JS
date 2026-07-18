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

export default async function FeaturedProductsSection() {
  // Fetch featured products from WooCommerce API (all categories)
  const rugsProducts = await getFeaturedProducts();

  // Fallback to mock data if the API returns an empty array or fails
  const finalRugs = rugsProducts.length > 0 ? rugsProducts : MOCK_RUGS_PRODUCTS;

  return (
    <FeaturedProductsClientSection 
      rugsProducts={finalRugs} 
    />
  );
}
