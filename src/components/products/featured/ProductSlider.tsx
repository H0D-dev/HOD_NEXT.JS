"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ProductCard from "./ProductCard";
import { useCursorStore } from "@/src/lib/store/useCursorStore";

interface ProductSliderProps {
  products: any[];
  title?: string;
}

export interface ProductSliderHandle {
  scrollNext: () => void;
  scrollPrev: () => void;
}

const ProductSlider = forwardRef<ProductSliderHandle, ProductSliderProps>(
  ({ products, title }, ref) => {
    const setCursorMode = useCursorStore((state) => state.setMode);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null); // For mobile native scroll
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

    useImperativeHandle(ref, () => ({
      scrollNext: () => {
        if (isMobile && scrollContainerRef.current) {
          const scrollAmount = window.innerWidth * 0.7; // Approx width of one mobile card
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        } else {
          const currentX = x.get();
          const targetX = Math.max(constraints.left, currentX - 400); // Approx width of one desktop card
          x.set(targetX);
        }
      },
      scrollPrev: () => {
        if (isMobile && scrollContainerRef.current) {
          const scrollAmount = window.innerWidth * 0.7;
          scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
          const currentX = x.get();
          const targetX = Math.min(0, currentX + 400);
          x.set(targetX);
        }
      }
    }));

    if (isMobile) {
      // Mobile: Native snap scrolling container
      return (
        <div className="flex flex-col w-full">
          <div className="w-full pl-[var(--space-4)]" ref={containerRef}>
            <div 
              ref={scrollContainerRef}
              className="flex gap-1 overflow-x-auto snap-x snap-mandatory pr-[var(--space-4)] hide-scrollbar"
            >
              {products.map((product) => (
                <div key={product.id} className="snap-start flex-none w-[65vw] md:w-[45vw]">
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
      <div className="w-full overflow-hidden px-[var(--space-4)] min-[1440px]:pl-[max(var(--space-4),calc((100vw-var(--container-lg))/2+var(--space-4)))] min-[1440px]:pr-[max(var(--space-4),calc((100vw-var(--container-lg))/2+var(--space-4)))]" ref={containerRef}>
        <motion.div
          ref={trackRef}
          className="flex gap-1 md:gap-2 will-change-transform"
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
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[24vw] max-w-[400px] min-w-[260px]"
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
);

ProductSlider.displayName = "ProductSlider";
export default ProductSlider;
