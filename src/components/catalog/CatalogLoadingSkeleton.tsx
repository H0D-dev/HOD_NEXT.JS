import React from "react";

interface CatalogLoadingSkeletonProps {
  title?: string;
  category?: string;
}

export default function CatalogLoadingSkeleton({ title }: CatalogLoadingSkeletonProps) {
  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 lg:pt-28 pb-16 px-6 md:px-12 lg:px-16 animate-pulse">
      {/* Catalog Header Skeleton */}
      <div className="max-w-[1400px] mx-auto text-center flex flex-col items-center mb-8 md:mb-12">
        <div className="h-3 w-28 bg-neutral-300/40 rounded mb-4"></div>
        <div className="h-9 w-64 md:w-96 bg-neutral-300/50 rounded mb-4"></div>
        <div className="h-4 w-3/4 max-w-xl bg-neutral-300/30 rounded"></div>
      </div>

      {/* Controls Bar Skeleton */}
      <div className="max-w-[1400px] mx-auto flex justify-between items-center py-4 border-y border-[var(--border-secondary)] mb-8">
        <div className="h-9 w-28 bg-neutral-300/40 rounded"></div>
        <div className="h-4 w-24 bg-neutral-300/30 rounded"></div>
        <div className="h-9 w-36 bg-neutral-300/40 rounded"></div>
      </div>

      {/* Product Grid Skeleton (8 Product Cards) */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col">
            {/* Card Image Skeleton */}
            <div className="w-full aspect-[3/4] bg-neutral-300/30 rounded mb-3"></div>
            {/* Title & Category Line */}
            <div className="h-4 w-3/4 bg-neutral-300/40 rounded mb-2"></div>
            {/* Price Line */}
            <div className="h-3 w-1/3 bg-neutral-300/30 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
