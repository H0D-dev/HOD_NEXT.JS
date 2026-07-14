"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ZoomIn, ZoomOut } from "lucide-react";
import { ProductColor, Product } from "./ProductPresentation";

interface ProductGalleryProps {
  product: Product;
  activeColor: ProductColor;
}

export default function ProductGallery({ product, activeColor }: ProductGalleryProps) {
  // Collect available images for the active color
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");

  // Zoom state
  const [isHoverZoomed, setIsHoverZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [mobileScale, setMobileScale] = useState(1);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const newImages = [];
    if (activeColor.textureUrl) newImages.push(activeColor.textureUrl);
    if (activeColor.lifestyleUrl) newImages.push(activeColor.lifestyleUrl);

    // Fallback if the active color has no images, but the product has a main image
    if (newImages.length === 0 && product.image) {
      newImages.push(product.image);
    }

    setImages(newImages);
    if (newImages.length > 0) {
      setMainImage(newImages[0]);
    }
  }, [activeColor, product.image]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (isDesktop) setIsHoverZoomed(true);
  };

  const handleMouseLeave = () => {
    if (isDesktop) {
      setIsHoverZoomed(false);
      setZoomPosition({ x: 50, y: 50 });
    }
  };

  return (
    <div className="w-full flex justify-center lg:justify-end xl:justify-center lg:sticky lg:top-28">
      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 w-full max-w-[700px] xl:max-w-[750px] items-start">
        
        {/* Thumbnails (Left side on desktop, bottom on mobile) */}
        <div className="flex lg:flex-col gap-3 w-full lg:w-20 shrink-0 overflow-x-auto lg:overflow-y-auto hide-scrollbar snap-x lg:snap-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMainImage(img);
                setMobileScale(1); // Reset mobile scale on image change
              }}
              className={`relative w-20 aspect-[3/4] shrink-0 snap-center transition-all duration-300 bg-white border ${
                mainImage === img 
                  ? "border-[var(--accent-primary)] p-[2px] shadow-sm" 
                  : "border-[var(--border-secondary)] hover:border-[var(--text-muted)] p-[2px]"
              }`}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image 
                  src={img} 
                  alt={`${product.name} view ${idx + 1}`} 
                  fill 
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Main Image Viewer */}
        <div 
          className="relative w-full flex-1 aspect-[2/3] bg-white border border-[var(--border-secondary)] p-1 native-pointer"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative w-full h-full overflow-hidden cursor-pointer">
            <AnimatePresence mode="wait">
              {mainImage && (
                <motion.div
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className={`absolute inset-0 w-full h-full cursor-pointer ${mobileScale > 1 && !isDesktop ? 'overflow-auto hide-scrollbar touch-pan-x touch-pan-y' : 'overflow-hidden'}`}
                >
                  <div 
                    className="relative w-full h-full cursor-pointer"
                    style={{
                      cursor: "pointer",
                      width: !isDesktop && mobileScale > 1 ? `${mobileScale * 100}%` : '100%',
                      height: !isDesktop && mobileScale > 1 ? `${mobileScale * 100}%` : '100%',
                      transform: isDesktop && isHoverZoomed ? 'scale(2)' : 'scale(1)',
                      transformOrigin: isDesktop && isHoverZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
                      transition: isDesktop && isHoverZoomed ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
                    }}
                  >
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover cursor-pointer"
                      priority
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Zoom Controls */}
          {!isDesktop && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileScale(prev => Math.min(3, prev + 0.5));
                }}
                className="w-10 h-10 bg-white shadow-md border border-[var(--border-secondary)] flex items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                aria-label="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileScale(prev => Math.max(1, prev - 0.5));
                }}
                className="w-10 h-10 bg-white shadow-md border border-[var(--border-secondary)] flex items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                aria-label="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
