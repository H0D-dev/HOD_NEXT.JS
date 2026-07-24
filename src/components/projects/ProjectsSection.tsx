"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    image: "/images/home/featured-projects/FP-Villa-LV.png",
  },
  {
    title: "LUXURY PENTHOUSE",
    image: "/images/home/featured-projects/FP-Penthouse.png",
  },
  {
    title: "GHARAFA PALACE - QATAR",
    image: "/images/home/featured-projects/FP-Gharafa-Palace-Qatar.png",
  },
  {
    title: "DUBAI MALL",
    image: "/images/home/featured-projects/FP-Dubai-Mall.png",
  },
];

export default function ProjectsSection() {
  const setCursorMode = useCursorStore((state) => state.setMode);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState<number>(0);

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
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-[var(--bg-primary)] pt-8 pb-2 md:pt-12 md:pb-4 lg:pt-12 lg:pb-2 overflow-hidden" id="projects-section">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-8 md:px-10 lg:px-16 mb-6 md:mb-10 text-center" ref={headerRef}>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-sans font-light text-xl lg:text-2xl leading-[1.2] tracking-wide text-[var(--text-primary)] mb-2 md:mb-4">
            Featured projects
          </h2>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Accordion Container */}
        <div className="relative flex flex-row w-full h-[350px] md:h-[520px] gap-2 md:gap-4">
          
          {projects.map((project, index) => {
            const isActive = activeIndex === index;
            
            return (
              <div
                key={index}
                className={`relative group overflow-hidden cursor-pointer transition-all duration-1000 ease-out flex ${
                  isActive ? "flex-[8] md:flex-[5]" : "flex-1"
                }`}
                onMouseEnter={() => {
                  setActiveIndex(index);
                  setCursorMode("view");
                }}
                onMouseLeave={() => {
                  setCursorMode("default");
                }}
                onClick={() => setActiveIndex(index)}
              >
                {/* Background Image */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] md:w-[1000px] lg:w-[1200px] h-full pointer-events-none">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 150vw, 1200px"
                  />
                </div>

                {/* Overlays for contrast */}
                <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ease-out z-10 ${isActive ? 'opacity-20' : 'opacity-50'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 z-10 pointer-events-none" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 w-full p-2 sm:p-4 md:p-6 lg:p-8 z-20 flex flex-col justify-end h-full pointer-events-none">
                  
                  <div className={`flex flex-col transition-transform duration-1000 ease-out ${isActive ? 'translate-y-0' : 'translate-y-2'}`}>
                    <span className="font-sans font-light text-white/70 text-xs md:text-sm mb-1 md:mb-2 transition-opacity duration-1000 ease-out">
                      0{index + 1}
                    </span>
                    
                    <h3 className={`font-sans font-normal text-white uppercase tracking-widest whitespace-nowrap transition-all duration-1000 ease-out origin-left ${
                      isActive 
                        ? 'text-xs md:text-sm lg:text-base scale-100' 
                        : 'text-[10px] md:text-xs -rotate-90 absolute bottom-8 origin-bottom-left translate-x-2 lg:translate-x-4'
                    }`}>
                      {project.title}
                    </h3>
                    
                    {/* View Project Link (Only visible when active) */}
                    <div className={`mt-4 md:mt-6 overflow-hidden transition-all duration-1000 ease-out ${isActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <Link href="/projects" className="inline-block text-xs uppercase tracking-wider text-white border-b border-white/40 pb-1 group-hover:border-white transition-colors pointer-events-auto">
                        View Project
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
          
          {/* Mobile Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between px-2 md:hidden pointer-events-none z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
              }}
              className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-sm text-white rounded-full pointer-events-auto active:bg-black/60 transition-colors shadow-lg"
              aria-label="Previous project"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev + 1) % projects.length);
              }}
              className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-sm text-white rounded-full pointer-events-auto active:bg-black/60 transition-colors shadow-lg"
              aria-label="Next project"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
