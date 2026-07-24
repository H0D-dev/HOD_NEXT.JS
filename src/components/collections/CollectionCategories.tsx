"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCursorStore } from "@/src/lib/store/useCursorStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const collections = [
  { title: "BESPOKE RUGS", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800" },
  { title: "MODERN RUGS", image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800" },
  { title: "HAND-KNOTTED", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800" },
  { title: "VINTAGE KILIMS", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" },
];

export default function CollectionCategories() {
  const setCursorMode = useCursorStore((state) => state.setMode);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: -window.innerWidth * 0.65, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: window.innerWidth * 0.65, behavior: "smooth" });
    }
  };

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });



    // Simple Image Parallax
    gsap.utils.toArray<HTMLElement>('.parallax-img').forEach((img) => {
      const wrapper = img.closest('.collection-card');
      if (wrapper) {
        gsap.fromTo(img,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-brand-light pt-2 pb-2 md:py-4 lg:py-6 overflow-hidden" id="collections-section">
      <div className="mx-auto max-w-[1536px] px-6 sm:px-12 md:px-16 lg:px-24 mb-6 md:mb-10 text-center" ref={headerRef}>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-sans font-light text-xl lg:text-2xl leading-[1.2] tracking-wide text-[var(--text-primary)] mb-2 md:mb-4">
            Explore our collections
          </h2>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Horizontal scroll on mobile, 4-Column Grid on desktop */}
        <div 
          ref={gridRef} 
          className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 snap-x snap-mandatory md:snap-none gap-2 md:gap-4 hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {collections.map((collection, index) => (
            <div
              key={index}
              className="relative group overflow-hidden aspect-[2/3] w-[65vw] min-w-[65vw] sm:min-w-[45vw] md:w-full md:min-w-0 snap-start shrink-0 cursor-pointer collection-card"
              onMouseEnter={() => setCursorMode("view")}
              onMouseLeave={() => setCursorMode("default")}
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover scale-125 parallax-img"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none z-10" />

              {/* Text inside the card */}
              <div className="absolute bottom-8 w-full text-center px-4 pointer-events-none z-20">
                <h3 className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white">
                  {collection.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Mobile Only) */}
        <div className="flex justify-end gap-2 mt-2 md:hidden">
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
    </section>
  );
}
