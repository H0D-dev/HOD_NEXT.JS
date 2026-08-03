"use client";

import React from "react";
import ProductsHero from "@/src/components/products/ProductsHero";
import ProductsIntro from "@/src/components/products/ProductsIntro";
import ProductsCollections from "@/src/components/products/ProductsCollections";
import CollectionCategories from "@/src/components/collections/CollectionCategories";

export default function ProductsClient() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <ProductsHero />
      <ProductsIntro />
      <CollectionCategories title="Collections" disableParallax={true} />
      <ProductsCollections />
    </main>
  );
}

