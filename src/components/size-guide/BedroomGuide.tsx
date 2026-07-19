"use client";

import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function BedroomGuide() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollBy({ left: -window.innerWidth * 0.85, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (mobileCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = mobileCarouselRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        mobileCarouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        mobileCarouselRef.current.scrollBy({ left: window.innerWidth * 0.85, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 768) { // Active on mobile
        scrollNext();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    // Hero container parallax / zoom effect
    gsap.fromTo(
      ".bed-hero-container",
      { y: 80, scale: 1.15 },
      {
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".bed-hero-container",
          start: "top bottom",
          end: "top 30%",
          scrub: 1,
        },
      }
    );

    // Fade up heading
    gsap.fromTo(
      ".bed-header",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Stagger cards
    gsap.fromTo(
      ".bed-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".bed-cards-container",
          start: "top 85%",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="bedroom" ref={sectionRef} className="w-full py-8 md:py-12 px-4 md:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="bed-header text-center mb-8 md:mb-12">
          <h2 className="font-sans text-xl lg:text-2xl font-light text-[var(--text-primary)] mb-3 leading-[1.2]">
            Bedroom
          </h2>
          <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] font-light max-w-[600px] mx-auto">
            Your bedroom should be a sanctuary. The right rug placement provides warmth underfoot the moment you wake up.
          </p>
        </div>

        {/* Large Hero Image */}
        <div className="bed-hero-container w-full h-[50vh] md:h-[65vh] lg:h-[75vh] mb-8 md:mb-16 overflow-hidden border border-[var(--border-secondary)]">
          <img
            src="/images/size-guide/bedroom_hero_wide_1784457317554.png"
            alt="Bedroom rug placement hero"
            className="w-full h-full object-cover object-[center_60%]"
          />
        </div>

        {/* Layout Cards */}
        <div className="bed-cards-container flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:grid md:grid-cols-3 md:gap-6 lg:gap-8 pb-4" ref={mobileCarouselRef}>
          
          {/* Card A */}
          <div className="bed-card min-w-[85vw] snap-center md:min-w-0 group flex flex-col border border-[var(--border-secondary)] bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500 hover:border-[var(--text-primary)]">
            <div className="aspect-[4/3] md:aspect-square w-full overflow-hidden border-b border-[var(--border-secondary)] relative">
              <img
                src="/images/size-guide/bedroom_full_1782565454914.png"
                alt="Large rug under bed"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col">
              <h3 className="font-sans text-base md:text-lg lg:text-xl font-light text-[var(--text-primary)] mb-2 md:mb-3">
                Full Frame
              </h3>
              <p className="font-sans text-xs md:text-sm lg:text-base text-[var(--text-secondary)] leading-relaxed mb-4 md:mb-8 flex-1">
                A large rug extending well beyond the sides and foot of the bed offers maximum comfort and a truly grand, luxurious feel to the master suite.
              </p>
              <Link
                href="/products?category=bedroom"
                className="hidden lg:inline-block font-sans text-xs md:text-sm tracking-widest uppercase px-6 py-4 border border-[var(--border-secondary)] text-[var(--text-primary)] bg-transparent group-hover:border-[var(--text-primary)] transition-all duration-300 ease-out text-center"
              >
                Shop Bedroom Rugs &rarr;
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="bed-card min-w-[85vw] snap-center md:min-w-0 group flex flex-col border border-[var(--border-secondary)] bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500 hover:border-[var(--text-primary)]">
            <div className="aspect-[4/3] md:aspect-square w-full overflow-hidden border-b border-[var(--border-secondary)] relative">
              <img
                src="/images/size-guide/bedroom_runners_1782565467316.png"
                alt="Bedside runners"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col">
              <h3 className="font-sans text-base md:text-lg lg:text-xl font-light text-[var(--text-primary)] mb-2 md:mb-3">
                Bedside Runners
              </h3>
              <p className="font-sans text-xs md:text-sm lg:text-base text-[var(--text-secondary)] leading-relaxed mb-4 md:mb-8 flex-1">
                For smaller spaces or asymmetrical rooms, two runners placed on either side of the bed provide targeted warmth where you step first.
              </p>
              <Link
                href="/products?category=bedroom"
                className="hidden lg:inline-block font-sans text-xs md:text-sm tracking-widest uppercase px-6 py-4 border border-[var(--border-secondary)] text-[var(--text-primary)] bg-transparent group-hover:border-[var(--text-primary)] transition-all duration-300 ease-out text-center"
              >
                Explore Runners &rarr;
              </Link>
            </div>
          </div>

          {/* Card C */}
          <div className="bed-card min-w-[85vw] snap-center md:min-w-0 group flex flex-col border border-[var(--border-secondary)] bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500 hover:border-[var(--text-primary)]">
            <div className="aspect-[4/3] md:aspect-square w-full overflow-hidden border-b border-[var(--border-secondary)] relative">
              <img
                src="/images/size-guide/bedroom_foot_1782565488826.png"
                alt="Foot of bed rug"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col">
              <h3 className="font-sans text-base md:text-lg lg:text-xl font-light text-[var(--text-primary)] mb-2 md:mb-3">
                Foot of the Bed
              </h3>
              <p className="font-sans text-xs md:text-sm lg:text-base text-[var(--text-secondary)] leading-relaxed mb-4 md:mb-8 flex-1">
                A medium-sized rug placed horizontally at the foot of the bed accents a bench or seating area, adding a touch of tailored elegance.
              </p>
              <Link
                href="/products?category=bedroom"
                className="hidden lg:inline-block font-sans text-xs md:text-sm tracking-widest uppercase px-6 py-4 border border-[var(--border-secondary)] text-[var(--text-primary)] bg-transparent group-hover:border-[var(--text-primary)] transition-all duration-300 ease-out text-center"
              >
                Shop Accent Rugs &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Mobile Arrows */}
        <div className="flex justify-end gap-3 md:hidden w-full mt-4">
          <button 
            onClick={scrollPrev}
            className="w-10 h-10 border border-[var(--border-secondary)] flex items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors duration-300"
            aria-label="Previous layout"
          >
            &larr;
          </button>
          <button 
            onClick={scrollNext}
            className="w-10 h-10 border border-[var(--border-secondary)] flex items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors duration-300"
            aria-label="Next layout"
          >
            &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
