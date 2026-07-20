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
    image: "/services_exp_1.png",
  },
  {
    title: "LUXURY PENTHOUSE",
    image: "/services_exp_2.png",
  },
  {
    title: "PRIVATE PALACE",
    image: "/services_exp_3.png",
  },
  {
    title: "BOUTIQUE HOTEL",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
  },
];

export default function ServicesExpertise() {
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
    <section ref={sectionRef} className="w-full bg-[var(--bg-primary)] pt-8 pb-2 md:pt-12 md:pb-4 lg:pt-16 lg:pb-8 overflow-hidden">
      <div className="mx-auto max-w-[1536px] px-6 sm:px-12 md:px-16 lg:px-24 mb-6 md:mb-10">

        <div className="text-center mb-10 md:mb-16" ref={headerRef}>
          <div className="flex flex-col items-center justify-center">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4 md:mb-6 font-medium">
              Project Expertise
            </span>
            <h2 className="text-xl lg:text-2xl font-light text-[var(--text-primary)] leading-[1.15]">
              Spaces That Inspire.
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
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--text-secondary)] mt-5 transition-colors group-hover:text-[var(--accent-primary)]">
                {project.title}
              </span>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
