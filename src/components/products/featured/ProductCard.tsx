"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: string;
    image: string;
    slug: string;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ProductCard({ product, onMouseEnter, onMouseLeave }: ProductCardProps) {
  // Simple heuristic for demo routing
  const routeCategory = product.category.toLowerCase().includes('weave') || 
                        product.category.toLowerCase().includes('knotted') || 
                        product.category.toLowerCase().includes('tufted') 
                        ? 'rugs' : 'curtains';

  return (
    <Link 
      href={`/products/${routeCategory}/${product.slug}`}
      className="featured__card group block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      draggable={false}
    >
      <div className="featured__card-image-wrapper">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="featured__card-image object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 80vw, (max-width: 1024px) 45vw, 30vw"
          draggable={false}
        />
      </div>
      <div className="featured__card-content flex flex-col pt-4">
        <h3 className="featured__card-title font-serif text-2xl text-[var(--text-primary)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
          {product.name}
        </h3>
        <p className="featured__card-category font-sans text-xs uppercase tracking-widest text-[var(--text-muted)] mt-1 opacity-60 transition-opacity duration-500 group-hover:opacity-100">
          {product.category}
        </p>
        
        {/* Subtle underline animation */}
        <div className="relative mt-3 h-[1px] w-full bg-[var(--border-secondary)] overflow-hidden">
          <div className="absolute inset-y-0 left-0 h-full w-full bg-[var(--text-primary)] -translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 origin-left"></div>
        </div>
      </div>
    </Link>
  );
}
