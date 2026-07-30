import React from "react";

export default function ProductLoadingSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 lg:pt-28 pb-16 px-6 lg:px-24 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="max-w-[1300px] mx-auto mb-6">
        <div className="h-3 w-48 bg-neutral-300/40 rounded"></div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1300px] mx-auto grid lg:grid-cols-[55%_45%] xl:grid-cols-[58%_42%] gap-10 lg:gap-0">
        {/* Left Column: Product Gallery Skeleton */}
        <div className="w-full lg:pr-8 xl:pr-10 lg:border-r lg:border-[var(--border-secondary)]">
          <div className="w-full aspect-[4/3] bg-neutral-300/30 rounded mb-4"></div>
          <div className="grid grid-cols-4 gap-3">
            <div className="aspect-[4/3] bg-neutral-300/30 rounded"></div>
            <div className="aspect-[4/3] bg-neutral-300/30 rounded"></div>
            <div className="aspect-[4/3] bg-neutral-300/30 rounded"></div>
            <div className="aspect-[4/3] bg-neutral-300/30 rounded"></div>
          </div>
        </div>

        {/* Right Column: Product Details Skeleton */}
        <div className="w-full lg:pl-8 xl:pl-10 flex flex-col gap-6 pt-2">
          {/* Subtitle & Title */}
          <div>
            <div className="h-3 w-28 bg-neutral-300/40 rounded mb-3"></div>
            <div className="h-8 w-3/4 bg-neutral-300/50 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-neutral-300/40 rounded mt-2"></div>
          </div>

          {/* Price */}
          <div className="h-6 w-32 bg-neutral-300/50 rounded"></div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[var(--border-secondary)]"></div>

          {/* Color Selector Skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-neutral-300/40 rounded"></div>
            <div className="flex gap-3 mt-1">
              <div className="w-8 h-8 rounded-full bg-neutral-300/40"></div>
              <div className="w-8 h-8 rounded-full bg-neutral-300/40"></div>
              <div className="w-8 h-8 rounded-full bg-neutral-300/40"></div>
            </div>
          </div>

          {/* Size Selector Skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-neutral-300/40 rounded"></div>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="h-10 bg-neutral-300/30 rounded border border-neutral-300/30"></div>
              <div className="h-10 bg-neutral-300/30 rounded border border-neutral-300/30"></div>
              <div className="h-10 bg-neutral-300/30 rounded border border-neutral-300/30"></div>
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <div className="h-12 w-full bg-neutral-400/50 rounded mt-4"></div>

          {/* Specifications Collapsible Skeleton */}
          <div className="flex flex-col gap-3 mt-6">
            <div className="h-10 w-full bg-neutral-300/20 rounded"></div>
            <div className="h-10 w-full bg-neutral-300/20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
