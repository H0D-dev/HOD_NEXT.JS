"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    quote: "House of Decor transformed our vision into a rug that feels like part of our home's architecture.",
    author: "PRIVATE HOMEOWNER",
    location: "DUBAI"
  },
  {
    quote: "Their understanding of scale, material, and spatial harmony is completely unmatched in the industry.",
    author: "INTERIOR ARCHITECT",
    location: "LONDON"
  },
  {
    quote: "A seamless process from the initial sketches to the final installation. The quality is truly exceptional.",
    author: "BOUTIQUE HOTEL",
    location: "PARIS"
  }
];

export default function TestimonialCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from([leftContentRef.current, rightContentRef.current], {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });
  }, { scope: sectionRef });

  return (
    <>
      {/* ── Testimonials Section ── */}
      <section ref={sectionRef} className="w-full bg-brand-light py-24 md:py-32" id="testimonials-section">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col items-center text-center mb-16 md:mb-24" ref={leftContentRef}>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-400 font-sans">
              CLIENT VOICES
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {testimonials.map((item, index) => (
              <div 
                key={index} 
                className={`flex flex-col text-center items-center px-8 lg:px-16 ${
                  index === 1 ? 'md:border-l md:border-r border-neutral-300' : ''
                }`}
              >
                <span className="text-[#E3D5C4] text-6xl font-serif leading-none mb-4">"</span>
                <p className="text-lg md:text-xl font-serif italic text-neutral-800 leading-relaxed mb-8">
                  {item.quote}
                </p>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans block">
                  {item.author}<br />{item.location}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA Section (Inset Card) ── */}
      <section className="w-full bg-[#F9F9F6] py-24 px-6 md:px-12" id="cta-section">
        <div 
          ref={rightContentRef}
          className="w-full max-w-[1400px] mx-auto bg-[#1A1A1A] rounded-sm py-24 px-8 md:px-16 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Subtle radial/linear gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/40"></div>
          
          <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight z-10 relative">
            Let's Create<br />Something Timeless.
          </h3>
          
          <p className="text-sm md:text-base text-neutral-400 mt-6 mb-12 font-sans leading-relaxed max-w-xl z-10 relative">
            Whether you're designing a villa, yacht, hospitality project, or private residence, our team will create a rug that is uniquely yours.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10 z-10 relative w-full sm:w-auto">
            <button className="bg-brand-gold hover:bg-brand-gold-dark text-white text-[10px] md:text-xs uppercase tracking-[0.2em] py-4 px-8 transition-colors duration-300 font-sans w-full sm:w-auto">
              Book a Design Consultation
            </button>
            <button className="bg-transparent border border-white/40 hover:border-brand-gold hover:text-brand-gold text-white text-[10px] md:text-xs uppercase tracking-[0.2em] py-4 px-8 transition-colors duration-300 font-sans w-full sm:w-auto">
              Contact Our Studio
            </button>
          </div>

        </div>
      </section>
    </>
  );
}
