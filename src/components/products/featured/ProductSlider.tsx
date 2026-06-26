"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ProductCard from "./ProductCard";
import { useCursorStore } from "@/src/lib/store/useCursorStore";
import "./FeaturedProducts.css";

interface ProductSliderProps {
  products: any[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
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
      const scrollableWidth = trackWidth - containerWidth;
      setConstraints({ right: 0, left: -scrollableWidth });
    }
  };

  // Recalculate on load (images might change width)
  useEffect(() => {
    const timer = setTimeout(updateConstraints, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isMobile) {
    // Mobile: Native snap scrolling container
    return (
      <div className="featured__slider-mobile-container" ref={containerRef}>
        <div className="featured__slider-mobile-track">
          {products.map((product) => (
            <div key={product.id} className="featured__slider-mobile-item">
              <ProductCard 
                product={product} 
                onMouseEnter={() => {}} 
                onMouseLeave={() => {}} 
              />
            </div>
          ))}
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
