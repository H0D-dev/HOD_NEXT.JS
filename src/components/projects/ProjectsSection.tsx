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

const projects = [
  {
    title: "VILLA LV01 - DUBAI",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "LUXURY PENTHOUSE",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "PRIVATE PALACE",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "BOUTIQUE HOTEL",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
  },
];

export default function ProjectsSection() {
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
    <section ref={sectionRef} className="w-full bg-[#F9F9F6] py-8 md:py-12 overflow-hidden" id="projects-section">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-8 md:mb-12">
        <div ref={headerRef} className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[42px] text-[#2C251F] leading-[1.15] mb-6">
              Featured projects
            </h2>
          </div>
        </div>

        {/* Clean 4-Column Grid */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="flex flex-col group cursor-pointer"
              onMouseEnter={() => setCursorMode("view")}
              onMouseLeave={() => setCursorMode("default")}
            >

              {/* Image Wrapper */}
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Text Below Image */}
              <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-[#2C251F]/70 mt-5 transition-colors group-hover:text-[#2C251F]">
                {project.title}
              </span>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
