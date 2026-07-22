"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCursorStore } from "@/src/lib/store/useCursorStore";
import { getCategories, getCategoryIdBySlug } from "@/src/services/Product";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RugCollection = {
  title: string;
  slug: string;
  image: string;
};

export default function ProductsCollections() {
  const setCursorMode = useCursorStore((state) => state.setMode);
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [collections, setCollections] = React.useState<RugCollection[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch Collections
  useEffect(() => {
    async function fetchCollections() {
      try {
        const rugsId = await getCategoryIdBySlug("rugs");
        if (rugsId) {
          const rugs = await getCategories(rugsId);
          if (Array.isArray(rugs) && rugs.length > 0) {
            setCollections(rugs.map(r => ({
              title: r.name,
              slug: r.slug,
              image: r.image?.src || "/products_hero.png"
            })));
          }
        }
      } catch (error) {
        console.error("Failed to fetch collections", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);

  // GSAP Animations
  useGSAP(() => {
    if (loading || collections.length === 0) return;

    // Grid Stagger
    gsap.fromTo(gsap.utils.toArray(gridRef.current?.children || []), 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        }
      }
    );

  }, { scope: containerRef, dependencies: [loading, collections] });

  const scrollPrev = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: -window.innerWidth * 0.75, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: window.innerWidth * 0.75, behavior: "smooth" });
    }
  };

  return (
    <section ref={containerRef} className="w-full pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-24 px-5 md:px-10 lg:px-16 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col">
        
        {/* Centered Title */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4 font-medium">
            Explore
          </span>
          <h2 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)]">
            Masterpieces By Design.
          </h2>
        </div>

        {/* Grid & Mobile Slider */}
        <div className="w-full">
          <div 
            ref={gridRef} 
            className="flex md:grid flex-nowrap md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              // Skeletons
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="snap-start flex-none w-[75vw] md:w-auto relative aspect-[4/5] bg-[var(--bg-secondary)] border border-[var(--border-secondary)] animate-pulse" />
              ))
            ) : (
              collections.map((col, idx) => (
                <div key={idx} className="snap-start flex-none w-[75vw] md:w-auto">
                  <Link
                    href={`/products/rugs?category=${col.slug}`}
                    className="collection-card flex flex-col group cursor-pointer w-full h-full"
                    onMouseEnter={() => setCursorMode("view")}
                    onMouseLeave={() => setCursorMode("default")}
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
                      <Image
                        src={col.image}
                        alt={col.title}
                        fill
                        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" />
                    </div>
                    
                    {/* Title & Accent line */}
                    <div className="mt-5 flex flex-col items-center">
                      <h3 className="font-sans text-[11px] md:text-xs uppercase tracking-widest text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--accent-primary)]">
                        {col.title}
                      </h3>
                      <div className="w-0 h-[1px] bg-[var(--accent-primary)] mt-2 transition-all duration-500 group-hover:w-12"></div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Navigation Arrows (Mobile Only) */}
          <div className="flex md:hidden justify-end gap-2 mt-6">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 border border-[#2C251F]/20 flex items-center justify-center rounded-full text-[#2C251F] hover:bg-[#2C251F] hover:text-white transition-colors duration-300"
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 border border-[#2C251F]/20 flex items-center justify-center rounded-full text-[#2C251F] hover:bg-[#2C251F] hover:text-white transition-colors duration-300"
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
