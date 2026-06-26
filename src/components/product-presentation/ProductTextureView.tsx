"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductColor } from "./ProductPresentation";

interface ProductTextureViewProps {
  activeColor: ProductColor;
}

export default function ProductTextureView({ activeColor }: ProductTextureViewProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <div className="relative w-full h-full min-h-[50vh] lg:min-h-[calc(100vh-6rem)] bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden">
        {/* Texture Image Container */}
        <div className="relative w-full max-w-[90%] md:max-w-[80%] aspect-square flex items-center justify-center overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeColor.id}
              src={activeColor.textureUrl}
              alt={`${activeColor.name} texture`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as any, // ease-premium
              }}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </AnimatePresence>
        </div>

        {/* Play Button */}
        <button 
          onClick={() => setIsVideoOpen(true)}
          className="absolute bottom-[var(--space-4)] left-[var(--space-4)] lg:bottom-[var(--space-6)] lg:left-[var(--space-6)] w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md transition-transform duration-500 hover:scale-110 z-10"
          aria-label="Play craftsmanship video"
        >
          <svg 
            width="16" 
            height="18" 
            viewBox="0 0 16 18" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 text-[var(--text-primary)]"
          >
            <path d="M15.5 8.13397C16.1667 8.51887 16.1667 9.48113 15.5 9.86603L2 17.6603C1.33333 18.0452 0.5 17.564 0.5 16.7942L0.5 1.20577C0.5 0.43597 1.33333 -0.045155 2 0.339745L15.5 8.13397Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white hover:text-[var(--accent-primary)] transition-colors z-50"
              aria-label="Close video"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
              className="relative w-full max-w-5xl aspect-video bg-black flex items-center justify-center"
            >
              {/* Dummy Video Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <p className="font-sans font-medium uppercase tracking-widest text-sm">Craftsmanship Video Playback</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
