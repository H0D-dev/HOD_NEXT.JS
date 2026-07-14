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
    <section ref={sectionRef} className="w-full bg-brand-light py-8 md:py-12 overflow-hidden" id="collections-section">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-8 md:mb-12 flex justify-between items-end" ref={headerRef}>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[42px] text-[#2C251F] leading-[1.15] mb-6">
            Explore our collections
          </h2>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        {/* 4-Column Grid */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {collections.map((collection, index) => (
            <div
              key={index}
              className="relative group overflow-hidden aspect-[2/3] cursor-pointer collection-card"
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
                <h3 className="font-sans text-xs md:text-sm uppercase tracking-[0.2em] text-white">
                  {collection.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
