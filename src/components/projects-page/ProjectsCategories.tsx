"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCursorStore } from "@/src/lib/store/useCursorStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  {
    title: "RESIDENTIAL",
    desc: "Luxury villas, apartments, penthouses and private residences where handcrafted rugs become timeless centerpieces.",
    image: "/services_craft_1.png",
  },
  {
    title: "HOSPITALITY",
    desc: "Hotels, resorts, lounges and branded residences designed for exceptional guest experiences.",
    image: "/services_craft_2.png",
  },
  {
    title: "COMMERCIAL",
    desc: "Corporate headquarters, executive offices, retail environments and public spaces balancing aesthetics with durability.",
    image: "/services_craft_3.png",
  },
  {
    title: "CULTURAL SPACES",
    desc: "Museums, galleries, cultural centers and institutions where craftsmanship and design come together.",
    image: "/services_craft_4.png",
  },
];

export default function ProjectsCategories() {
  const setCursorMode = useCursorStore((state) => state.setMode);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(gsap.utils.toArray(gridRef.current?.children || []), {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 85%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full pt-8 pb-4 md:pt-12 md:pb-8 px-5 md:px-10 lg:px-16 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4 font-medium">
            Project Categories
          </span>
          <div className="w-12 h-[1px] bg-[var(--border-secondary)]"></div>
        </div>

        {/* Categories Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={`/projects/category/${cat.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="group flex flex-col cursor-pointer"
              onMouseEnter={() => setCursorMode("view")}
              onMouseLeave={() => setCursorMode("default")}
            >
              {/* Image Container with Title Overlay */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--bg-secondary)] mb-6">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-sans text-white text-base md:text-lg tracking-wide uppercase">
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Description Text */}
              <p className="text-sm font-light text-[var(--text-secondary)] leading-relaxed">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
