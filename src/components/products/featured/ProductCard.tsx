"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const routeCategory = 'rugs';
  const targetHref = `/products/${routeCategory}/${product.slug}`;

  const handleMouseEnter = () => {
    onMouseEnter();
    router.prefetch(targetHref);
  };

  return (
    <Link 
      href={targetHref}
      className="group flex flex-col no-underline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      draggable={false}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#EBE7E0] mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 80vw, (max-width: 1024px) 45vw, 30vw"
          draggable={false}
        />
      </div>
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}
