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

const expertiseAreas = [
  { title: "LUXURY RESIDENCES", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600" },
  { title: "PRIVATE VILLAS", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600" },
  { title: "BOUTIQUE HOTELS", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600" },
  { title: "COMMERCIAL", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" },
  { title: "YACHTS", image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=600" },
  { title: "ATELIERS", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600" },
];

export default function ExpertiseSection() {
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

    gsap.from(gsap.utils.toArray(gridRef.current?.children || []), {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 80%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#F9F9F6] pb-16 md:pb-24 pt-4 md:pt-8 overflow-hidden" 
      id="expertise-section"
      onMouseEnter={() => setCursorMode("default")}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Header */}
        <div ref={headerRef} className="flex justify-center mb-10 md:mb-16">
          <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-neutral-500">
            OUR EXPERTISE
          </h2>
        </div>

        {/* 6-Column Grid (3-Col on standard desktop to make cards larger) */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
          {expertiseAreas.map((area, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden aspect-[3/4] cursor-pointer"
              onMouseEnter={() => setCursorMode("view")}
              onMouseLeave={() => setCursorMode("default")}
            >
              <Image
                src={area.image}
                alt={area.title}
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
              
              {/* Text inside the card */}
              <div className="absolute bottom-6 w-full text-center px-4 pointer-events-none">
                <h3 className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-white">
                  {area.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
