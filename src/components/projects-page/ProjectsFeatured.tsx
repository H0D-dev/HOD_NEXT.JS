"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCursorStore } from "@/src/lib/store/useCursorStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    title: "VILLA LV01",
    meta: "Dubai, UAE • Luxury Villas • 2024",
    desc: "A bespoke hand-knotted rug designed for the grand living space, crafted in New Zealand wool and bamboo silk. The design seamlessly integrates with the villa's modern architectural lines, bringing warmth to the expansive marble floors. Our artisans spent over four months meticulously weaving the subtle gradient patterns.",
    image: "/services_exp_1.png",
  },
  {
    title: "LUXURY PENTHOUSE",
    meta: "Dubai, UAE • Residential • 2023",
    desc: "Custom rugs for luxury living areas and private suites, designed for comfort, durability and elegance. Featuring a blend of pure silk and hand-spun wool, the collection elevates the panoramic skyline views. Each piece was tailored to perfectly frame the custom Italian furniture arrangements.",
    image: "/services_exp_2.png",
  },
  {
    title: "PRIVATE PALACE",
    meta: "Abu Dhabi, UAE • Royal Palaces • 2022",
    desc: "Handcrafted palace-size rugs made using the finest materials and traditional weaving techniques to complement monumental architecture. The intricate floral motifs were inspired by the region's heritage, utilizing a rich palette of deep gold and sapphire. Installed across the main majlis and reception halls.",
    image: "/services_exp_3.png",
  },
  {
    title: "BOUTIQUE HOTEL",
    meta: "Dubai, UAE • Hospitality • 2023",
    desc: "Contemporary rugs for executive offices and meeting spaces, balancing aesthetics with high-traffic performance. The geometric designs introduce a subtle modern edge while maintaining the hotel's luxurious ambiance. Constructed with high-density commercial-grade wool for lasting durability.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
  },
];

export default function ProjectsFeatured() {
  const setCursorMode = useCursorStore((state) => state.setMode);
  const containerRef = useRef<HTMLElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollBy({ left: -window.innerWidth * 0.85, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollBy({ left: window.innerWidth * 0.85, behavior: "smooth" });
    }
  };

  useGSAP(() => {
    const textBlocks = gsap.utils.toArray<HTMLElement>(".project-text-reveal");

    textBlocks.forEach((block, i) => {
      // Fade up animation for the text block itself
      gsap.fromTo(
        block,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
          },
        }
      );

      // ScrollTrigger for crossfading the sticky images on desktop
      ScrollTrigger.create({
        trigger: block,
        start: "top 60%",
        end: "bottom 60%",
        onEnter: () => {
          gsap.to(".project-image", { opacity: 0, duration: 0.6, overwrite: "auto", ease: "power2.inOut" });
          gsap.to(`.project-image-${i}`, { opacity: 1, duration: 0.6, overwrite: "auto", ease: "power2.inOut" });
        },
        onEnterBack: () => {
          gsap.to(".project-image", { opacity: 0, duration: 0.6, overwrite: "auto", ease: "power2.inOut" });
          gsap.to(`.project-image-${i}`, { opacity: 1, duration: 0.6, overwrite: "auto", ease: "power2.inOut" });
        }
      });
      // ScrollTrigger for background color change
      ScrollTrigger.create({
        trigger: ".sticky-container-trigger",
        start: "top 25%", // Approximately when the sticky element pins
        onEnter: () => {
          gsap.to(containerRef.current, { backgroundColor: "var(--bg-secondary)", duration: 0.8, ease: "power2.out", overwrite: "auto" });
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, { backgroundColor: "var(--bg-primary)", duration: 0.8, ease: "power2.out", overwrite: "auto" });
        }
      });

    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full pt-8 pb-4 md:pt-12 md:pb-8 bg-[var(--bg-primary)] transition-colors duration-1000">
      <div className="max-w-[var(--container-lg)] mx-auto px-5 md:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4 font-medium">
            Featured Projects
          </span>
          <div className="w-12 h-[1px] bg-[var(--border-secondary)]"></div>
        </div>

        {/* Sticky Scroll Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative sticky-container-trigger">
          
          {/* Left Column Wrapper */}
          <div className="lg:col-span-5 flex flex-col w-full">
            {/* Scrolling Text Blocks */}
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 lg:flex-col lg:pb-[15vh] w-full" ref={mobileCarouselRef}>
              
              {projects.map((project, idx) => (
                <div 
                  key={idx} 
                  className={`project-text-reveal min-w-[85vw] snap-center lg:min-w-0 flex flex-col justify-center p-4 pb-4 lg:p-6 lg:min-h-[60vh] lg:py-16 ${idx !== projects.length - 1 ? 'lg:border-b lg:border-[var(--border-secondary)]' : ''} border border-[var(--border-secondary)] bg-[var(--bg-primary)] lg:bg-transparent lg:border-t-0 lg:border-l-0 lg:border-r-0 lg:px-0`}
                >
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-light text-[var(--text-primary)] mb-1 mt-2 lg:mt-0">
                    {project.title}
                  </h3>
                  <p className="text-[10px] lg:text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 lg:mb-4">
                    {project.meta}
                  </p>
                  <p className="text-sm lg:text-base font-light text-[var(--text-secondary)] leading-relaxed mb-3 lg:mb-6 max-w-md">
                    {project.desc}
                  </p>

                  {/* Mobile Fallback Inline Image */}
                  <div className="block lg:hidden w-full aspect-[4/3] max-h-[50vh] mt-4 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}

            </div>

            {/* Mobile Arrows */}
            <div className="flex justify-end gap-1 lg:hidden w-full mt-2">
              <button 
                onClick={scrollPrev}
                className="p-2 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-300 flex items-center justify-center"
                aria-label="Previous project"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button 
                onClick={scrollNext}
                className="p-2 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-300 flex items-center justify-center"
                aria-label="Next project"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          {/* Right Column — Sticky Desktop Images */}
          <div className="hidden lg:block lg:col-span-7 h-full">
            {/* Starts exactly below a typical 80px header, spans the rest of the screen */}
            <div className="sticky top-20 h-[calc(100vh-5rem)] flex flex-col justify-center pb-10">
              <div 
                className="w-full h-[75vh] max-h-[750px] relative bg-[var(--bg-secondary)] border border-[var(--border-secondary)] overflow-hidden group"
                onMouseEnter={() => setCursorMode("view")}
                onMouseLeave={() => setCursorMode("default")}
              >
                {projects.map((project, idx) => (
                  <img
                    key={idx}
                    src={project.image}
                    alt={project.title}
                    className={`project-image project-image-${idx} absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-110`}
                    style={{ opacity: idx === 0 ? 1 : 0 }}
                  />
                ))}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
