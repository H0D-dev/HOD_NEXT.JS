"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductStub } from "../../lib/catalogConfig";
import { useCurrencyStore } from "../../lib/store/useCurrencyStore";

interface ProductCardProps {
  product: ProductStub;
  baseRoute: string; // e.g. "/products/rugs"
}

export default function ProductCard({ product, baseRoute }: ProductCardProps) {
  const { currency } = useCurrencyStore();

  return (
    <Link
      href={`${baseRoute}/${product.slug}`}
      className="group block relative w-full transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-[var(--bg-primary)] pb-4"
    >
      <div className="relative w-full aspect-square overflow-hidden mb-4 bg-[var(--bg-secondary)]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />


      </div>

      <div className="flex flex-col items-start px-2 mt-2">
        <h3 className="font-sans text-[11px] md:text-xs uppercase tracking-widest text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[#d4b06a] mb-1">
          {product.title}
        </h3>
        <p className="font-sans text-[11px] md:text-xs text-[var(--text-primary)] font-medium tracking-wide mt-1">
          {product.price ? (
            <>
              {product.price} &bull; {product.category}
            </>
          ) : (
            <>
              {product.color} &bull; {product.category}
            </>
          )}
        </p>
        {product.isFallbackPrice && (
          <p className="text-[9px] lg:text-[10px] text-orange-600 mt-1 leading-tight">
            * {currency} pricing not available. Showing in AED.
          </p>
        )}
      </div>
    </Link>
  );
}
