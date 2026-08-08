"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCursorStore } from "@/src/lib/store/useCursorStore";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const collections = [
  { title: "THE CAPSULE", slug: "the-capsule", image: "/collections/capsule.webp" },
  { title: "TERRA", slug: "terra", image: "/collections/terra.webp" },
  { title: "THE CHROMA EDIT", slug: "the-chroma-edit", image: "/collections/chroma.webp" },
  { title: "BAUHAUS BLEND", slug: "bauhaus-blend", image: "/collections/bauhaus.webp" },
];

export default function CollectionCategories({ 
  title = "Explore our collections",
  disableParallax = false
}: { 
  title?: string;
  disableParallax?: boolean;
}) {
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
    if (!disableParallax) {
      gsap.utils.toArray<HTMLElement>('.parallax-img').forEach((img) => {
        const wrapper = img.closest('.collection-card');
        if (wrapper) {
          gsap.fromTo(img,
            { yPercent: 2 },
            {
              yPercent: -6,
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
    }
  }, { scope: sectionRef });

  if (disableParallax) {
    return (
      <section ref={sectionRef} className="w-full pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-6 lg:pb-8 px-5 md:px-10 lg:px-16 bg-[var(--bg-primary)]">
        <div className="max-w-[var(--container-lg)] mx-auto flex flex-col">
          <div className="flex flex-col items-center text-center mb-10 md:mb-12" ref={headerRef}>
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4 font-medium">
              Explore
            </span>
            <h2 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)]">
              {title}
            </h2>
          </div>
          <div className="w-full">
            <div ref={gridRef} className="flex md:grid flex-nowrap md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {collections.map((collection, index) => (
                <div key={index} className="snap-start flex-none w-[75vw] md:w-auto">
                  <Link href={`/products/rugs?collection=${collection.slug}`} className="collection-card flex flex-col group cursor-pointer w-full h-full" onMouseEnter={() => setCursorMode("view")} onMouseLeave={() => setCursorMode("default")}>
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
                      <Image src={collection.image} alt={collection.title} fill className="object-cover object-bottom transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" />
                    </div>
                    <div className="mt-5 flex flex-col items-center">
                      <h3 className="font-sans text-[11px] md:text-xs uppercase tracking-widest text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--accent-primary)]">{collection.title}</h3>
                      <div className="w-0 h-[1px] bg-[var(--accent-primary)] mt-2 transition-all duration-500 group-hover:w-12"></div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows (Mobile Only) */}
            <div className="flex justify-end gap-2 mt-6 md:hidden">
              <button onClick={scrollPrev} className="w-10 h-10 border border-[#2C251F]/20 flex items-center justify-center rounded-full text-[#2C251F] hover:bg-[#2C251F] hover:text-white transition-colors duration-300" aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={scrollNext} className="w-10 h-10 border border-[#2C251F]/20 flex items-center justify-center rounded-full text-[#2C251F] hover:bg-[#2C251F] hover:text-white transition-colors duration-300" aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="w-full bg-brand-light pt-2 pb-2 md:py-4 lg:py-6 overflow-hidden" id="collections-section">
      <div className="mx-auto max-w-[1536px] px-6 sm:px-12 md:px-16 lg:px-24 mb-6 md:mb-10 text-center" ref={headerRef}>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-sans font-light text-xl lg:text-2xl leading-[1.2] tracking-wide text-[var(--text-primary)] mb-2 md:mb-4">
            {title}
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
        {/* Horizontal scroll on mobile, 4-Column Grid on desktop */}
        <div 
          ref={gridRef} 
          className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 snap-x snap-mandatory md:snap-none gap-2 md:gap-4 hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {collections.map((collection, index) => (
            <Link
              key={index}
              href={`/products/rugs?collection=${collection.slug}`}
              className="relative group overflow-hidden aspect-[2/3] w-[65vw] min-w-[65vw] sm:min-w-[45vw] md:w-full md:min-w-0 snap-start shrink-0 cursor-pointer collection-card block"
              onMouseEnter={() => setCursorMode("view")}
              onMouseLeave={() => setCursorMode("default")}
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover object-bottom scale-110 parallax-img"
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
            </Link>
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
