"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    quote: "They didn't just weave a rug; they anchored our entire architectural vision. The texture and scale are breathtaking.",
    author: "Elena R.",
    role: "Lead Architect, Studio AR",
  },
  {
    quote: "The bespoke process was a masterclass in luxury. The bamboo silk piece they created for our penthouse is the defining feature of the home.",
    author: "Marcus T.",
    role: "Private Client, London",
  },
  {
    quote: "House of Décor understands the subtlety of true craftsmanship. Their ability to translate a complex sketch into a woven reality is unmatched.",
    author: "Sarah V.",
    role: "Interior Designer",
  }
];

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    // Fade up animations
    gsap.fromTo(
      ".test-elem",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );

    // Custom cursor logic
    if (cursorRef.current && containerRef.current) {
      const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3" });
      const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3" });

      const moveCursor = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      const handleMouseEnter = () => {
        gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3 });
      };

      const handleMouseLeave = () => {
        gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.3 });
      };

      const container = containerRef.current;
      container.addEventListener("mousemove", moveCursor);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", moveCursor);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="py-12 md:py-20 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)] overflow-hidden cursor-none"
    >
      {/* Custom Cursor */}
      <div 
        ref={cursorRef} 
        className="hidden md:block pointer-events-none fixed top-0 left-0 w-16 h-16 border border-[var(--border-primary)] rounded-full z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-50 mix-blend-difference"
      >
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col mb-8 border-b border-[var(--border-secondary)] pb-4">
          <div className="flex flex-col md:flex-row justify-between items-end w-full">
            <div className="flex flex-col max-w-2xl">
              <span className="test-elem text-[10px] uppercase tracking-[0.1em] font-medium text-[var(--text-secondary)] mb-2 font-sans">
                Client Perspectives
              </span>
              <h2 className="test-elem font-serif text-lg md:text-xl lg:text-2xl leading-[1.2] tracking-tight text-[var(--text-primary)] mb-4 md:mb-0">
                A Legacy of Trust.
              </h2>
            </div>
            
            <div className="test-elem flex gap-4 mt-4 md:mt-0 pb-2">
              <button 
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                className={`p-2 border border-[var(--border-primary)] rounded-full transition-colors cursor-pointer ${activeIndex === 0 ? 'opacity-30' : 'hover:bg-[var(--bg-secondary)]'}`}
                disabled={activeIndex === 0}
                aria-label="Previous testimonial"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button 
                onClick={() => setActiveIndex(Math.min(testimonials.length - 1, activeIndex + 1))}
                className={`p-2 border border-[var(--border-primary)] rounded-full transition-colors cursor-pointer ${activeIndex === testimonials.length - 1 ? 'opacity-30' : 'hover:bg-[var(--bg-secondary)]'}`}
                disabled={activeIndex === testimonials.length - 1}
                aria-label="Next testimonial"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Height drastically reduced for new compact font sizing */}
        <div className="test-elem relative h-[250px] sm:h-[180px] lg:h-[150px]">
          {testimonials.map((test, idx) => (
            <div 
              key={idx}
              className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                idx === activeIndex 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-8 pointer-events-none'
              }`}
            >
              <p className="font-serif text-lg md:text-xl lg:text-2xl leading-[1.4] text-[var(--text-primary)] max-w-4xl mb-6">
                &ldquo;{test.quote}&rdquo;
              </p>
              <div className="flex flex-col">
                <span className="font-serif text-lg text-[var(--text-primary)] mb-1">{test.author}</span>
                <span className="font-sans text-xs text-[var(--text-secondary)]">{test.role}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
