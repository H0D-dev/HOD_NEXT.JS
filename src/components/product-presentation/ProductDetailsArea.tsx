"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductInfoCard from "./ProductInfoCard";
import { ProductColor, Product } from "./ProductPresentation";

interface ProductDetailsAreaProps {
  product: Product;
  activeColor: ProductColor;
  onColorChange: (color: ProductColor) => void;
}

export default function ProductDetailsArea({ product, activeColor, onColorChange }: ProductDetailsAreaProps) {
  return (
    <div className="relative w-full h-full flex flex-col lg:block bg-white lg:bg-transparent">
      
      {/* Mobile: Inline Product Info Card */}
      <div className="w-full z-10 px-0 lg:hidden relative">
        <ProductInfoCard 
          product={product} 
          activeColor={activeColor} 
          onColorChange={onColorChange} 
        />
      </div>

      {/* Lifestyle Background */}
      <div className="relative w-full h-[50vh] lg:h-full lg:min-h-screen overflow-hidden lg:absolute lg:inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeColor.id}
            src={activeColor.lifestyleUrl}
            alt={`${activeColor.name} lifestyle`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>
      </div>
      
    </div>
  );
}
