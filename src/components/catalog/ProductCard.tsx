"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductStub } from "../../lib/catalogConfig";

interface ProductCardProps {
  product: ProductStub;
  baseRoute: string; // e.g. "/products/rugs"
}

export default function ProductCard({ product, baseRoute }: ProductCardProps) {
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
        
        {/* Hover action overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
          <span className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-[var(--bg-primary)] bg-[var(--text-primary)] px-6 py-2 text-[var(--text-sm)] font-sans font-medium tracking-wide">
            View Product &rarr;
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start px-2">
        <span className="font-sans text-[10px] lg:text-[var(--text-xs)] uppercase tracking-widest text-[var(--text-muted)] mb-1">
          {product.collectionName}
        </span>
        <h3 className="font-serif text-[var(--text-lg)] text-[var(--text-primary)] leading-tight mb-1">
          {product.title}
        </h3>
        <p className="font-sans text-[var(--text-sm)] text-[var(--text-secondary)]">
          {product.color} &bull; {product.category}
        </p>
      </div>
    </Link>
  );
}
