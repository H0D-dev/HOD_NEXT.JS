"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ProductCard from "./ProductCard";
import { useCursorStore } from "@/src/lib/store/useCursorStore";
import "./FeaturedProducts.css";

interface ProductSliderProps {
  products: any[];
  title?: string;
}

export default function ProductSlider({ products, title }: ProductSliderProps) {
  const setCursorMode = useCursorStore((state) => state.setMode);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);
  const springX = useSpring(x, { damping: 50, stiffness: 400 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateConstraints();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateConstraints = () => {
    if (containerRef.current && trackRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const trackWidth = trackRef.current.scrollWidth;

      // Get padding-right of container to ensure we can drag past it
      const computedStyle = window.getComputedStyle(containerRef.current);
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;

      // We need to drag further left by paddingRight so the last item isn't covered by padding
      const scrollableWidth = Math.max(0, trackWidth - containerWidth + paddingRight + paddingLeft);

      setConstraints({ right: 0, left: -scrollableWidth });
    }
  };

  // Recalculate on load (images might change width)
  useEffect(() => {
    const timer = setTimeout(updateConstraints, 500);
    return () => clearTimeout(timer);
  }, []);

  const renderTitleArea = () => {
    if (!title) return null;
    return (
      <div className="featured__title-area flex flex-col justify-center shrink-0">
        <h3 className="font-serif text-4xl lg:text-6xl text-[var(--text-primary)] mb-6">
          {title}
        </h3>
        <div className="flex items-center text-[var(--text-secondary)] gap-3 opacity-60">
          <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -scale-x-100">
            <path d="M40 6L30 0.226497V11.7735L40 6ZM0 7H31V5H0V7Z" fill="currentColor" />
          </svg>
          <span className="font-sans text-xs uppercase tracking-widest">Drag</span>
        </div>
      </div>
    );
  };

  if (isMobile) {
    // Mobile: Native snap scrolling container
    return (
      <div className="flex flex-col w-full">
        {title && (
          <div className="px-[var(--space-4)] mb-4">
            <h3 className="font-serif text-4xl text-[var(--text-primary)]">{title}</h3>
          </div>
        )}
        <div className="featured__slider-mobile-container" ref={containerRef}>
          <div className="featured__slider-mobile-track">
            {products.map((product) => (
              <div key={product.id} className="featured__slider-mobile-item">
                <ProductCard
                  product={product}
                  onMouseEnter={() => { }}
                  onMouseLeave={() => { }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Framer Motion draggable gallery
  return (
    <div className="featured__slider-desktop-container" ref={containerRef}>
      <motion.div
        ref={trackRef}
        className="featured__slider-desktop-track flex gap-2 md:gap-3"
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 60 }}
        style={{ x: springX }}
        onDragStart={() => {
          document.body.classList.add("dragging");
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          document.body.classList.remove("dragging");
          // Add a small delay before allowing clicks again
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 150);
        }}
      >
        {title && (
          <div className="shrink-0 w-[180px] lg:w-[240px] flex flex-col justify-center">
            {renderTitleArea()}
          </div>
        )}
        {products.map((product) => (
          <div
            key={product.id}
            className="featured__slider-desktop-item shrink-0"
            onClickCapture={(e) => {
              if (isDraggingRef.current) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <ProductCard
              product={product}
              onMouseEnter={() => setCursorMode("view")}
              onMouseLeave={() => setCursorMode("default")}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
