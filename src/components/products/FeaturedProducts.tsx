"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./FeaturedProducts.css";

const DUMMY_PRODUCTS = [
  {
    id: "p1",
    name: "Persian Heritage",
    category: "Hand Knotted",
    price: "From ₹24,999",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "persian-heritage"
  },
  {
    id: "p2",
    name: "Oasis Weave",
    category: "Flat Weave",
    price: "From ₹12,499",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "oasis-weave"
  },
  {
    id: "p3",
    name: "Modern Minimalist",
    category: "Hand Tufted",
    price: "From ₹18,999",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "modern-minimalist"
  },
  {
    id: "p4",
    name: "Vintage Anatolian",
    category: "Hand Knotted",
    price: "From ₹32,000",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "vintage-anatolian"
  },
  {
    id: "p5",
    name: "Nomad Tribal",
    category: "Flat Weave",
    price: "From ₹15,499",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "nomad-tribal"
  },
  {
    id: "p6",
    name: "Silk Cascade",
    category: "Hand Tufted",
    price: "From ₹45,000",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "silk-cascade"
  },
  {
    id: "p7",
    name: "Desert Dune",
    category: "Hand Knotted",
    price: "From ₹28,500",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "desert-dune"
  },
  {
    id: "p8",
    name: "Geometric Slate",
    category: "Flat Weave",
    price: "From ₹11,999",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    slug: "geometric-slate"
  }
];

export default function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      
      // Get the exact width of a single card to ensure flawless snapping
      const firstCard = scrollRef.current.firstElementChild as HTMLElement;
      let scrollAmount = clientWidth * 0.8; // Fallback
      if (firstCard) {
        const gap = 16; // var(--space-4)
        scrollAmount = firstCard.clientWidth + gap;
      }

      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <section className="featured">
      <div className="featured__container">
        <div className="featured__top">
          <div className="featured__top-left flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <h2 className="featured__heading font-sans relative inline-flex">
                Featured
                <sup className="text-2xl md:text-4xl font-light ml-2 md:ml-4 mt-2 md:mt-6 tracking-normal text-[var(--text-secondary)]">(04)</sup>
              </h2>
            </div>
            <p className="featured__description font-sans">
              Explore our curated collection of handcrafted rugs designed for luxury interiors.
            </p>
          </div>
        </div>

        <motion.div
          className="featured__grid"
          ref={scrollRef}
          onScroll={handleScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            show: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {DUMMY_PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              className="featured__card"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
              }}
            >
              <div className="featured__card-image-wrapper">
                <img src={product.image} alt={product.name} className="featured__card-image" />
                <div className="featured__card-overlay">
                  <span className="featured__card-cta font-sans">Explore &rarr;</span>
                </div>
              </div>

              <div className="featured__card-content">
                <p className="featured__card-category font-sans">{product.category}</p>
                <div className="featured__card-info">
                  <h3 className="featured__card-title font-serif">{product.name}</h3>
                  <p className="featured__card-price font-sans">{product.price}</p>
                </div>
                <div className="featured__card-mobile-cta font-sans">
                  Explore Product &rarr;
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="featured__controls">
          <div className="featured__progress-bar">
            <div
              className="featured__progress-indicator"
              style={{ width: `${Math.max(5, scrollProgress)}%` }}
            />
          </div>
          <div className="featured__nav-buttons">
            <button
              className="featured__nav-btn featured__nav-btn--prev"
              onClick={() => scroll('left')}
              aria-label="Previous products"
            >
              &larr;
            </button>
            <button
              className="featured__nav-btn featured__nav-btn--next"
              onClick={() => scroll('right')}
              aria-label="Next products"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
