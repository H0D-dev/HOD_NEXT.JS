"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import ProductsHero from "@/src/components/products/ProductsHero";
import ProductsIntro from "@/src/components/products/ProductsIntro";
import ProductsCollections from "@/src/components/products/ProductsCollections";

export default function CollectionsPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <ProductsHero />
      <ProductsIntro />
      <ProductsCollections />
    </main>
  );
}
