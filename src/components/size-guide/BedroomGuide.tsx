"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function BedroomGuide() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
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
          <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[var(--text-primary)] mb-4 leading-[1.2]">
            Bedroom
          </h2>
          <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] font-light max-w-[600px] mx-auto">
            Your bedroom should be a sanctuary. The right rug placement provides warmth underfoot the moment you wake up.
          </p>
        </div>

        {/* Large Hero Image */}
        <div className="w-full aspect-[4/3] md:aspect-[21/9] mb-12 md:mb-16 overflow-hidden border border-[var(--border-secondary)]">
          <img 
            src="/images/size-guide/bedroom_hero_1782565501415.png" 
            alt="Bedroom rug placement hero" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Layout Cards */}
        <div className="bed-cards-container grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card A */}
          <div className="bed-card group flex flex-col border border-[var(--border-secondary)] bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500 hover:border-[var(--text-primary)]">
            <div className="aspect-square w-full overflow-hidden border-b border-[var(--border-secondary)] relative">
              <img 
                src="/images/size-guide/bedroom_full_1782565454914.png" 
                alt="Large rug under bed" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h3 className="font-serif text-lg md:text-xl text-[var(--text-primary)] mb-3">
                Full Frame
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 flex-1">
                A large rug extending well beyond the sides and foot of the bed offers maximum comfort and a truly grand, luxurious feel to the master suite.
              </p>
              <Link 
                href="/products?category=bedroom" 
                className="inline-block font-sans text-xs md:text-sm tracking-widest uppercase px-6 py-4 border border-[var(--border-secondary)] text-[var(--text-primary)] bg-transparent group-hover:border-[var(--text-primary)] transition-all duration-300 ease-out text-center"
              >
                Shop Bedroom Rugs &rarr;
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="bed-card group flex flex-col border border-[var(--border-secondary)] bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500 hover:border-[var(--text-primary)]">
            <div className="aspect-square w-full overflow-hidden border-b border-[var(--border-secondary)] relative">
              <img 
                src="/images/size-guide/bedroom_runners_1782565467316.png" 
                alt="Bedside runners" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h3 className="font-serif text-lg md:text-xl text-[var(--text-primary)] mb-3">
                Bedside Runners
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 flex-1">
                For smaller spaces or asymmetrical rooms, two runners placed on either side of the bed provide targeted warmth where you step first.
              </p>
              <Link 
                href="/products?category=bedroom" 
                className="inline-block font-sans text-xs md:text-sm tracking-widest uppercase px-6 py-4 border border-[var(--border-secondary)] text-[var(--text-primary)] bg-transparent group-hover:border-[var(--text-primary)] transition-all duration-300 ease-out text-center"
              >
                Explore Runners &rarr;
              </Link>
            </div>
          </div>

          {/* Card C */}
          <div className="bed-card group flex flex-col border border-[var(--border-secondary)] bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500 hover:border-[var(--text-primary)]">
            <div className="aspect-square w-full overflow-hidden border-b border-[var(--border-secondary)] relative">
              <img 
                src="/images/size-guide/bedroom_foot_1782565488826.png" 
                alt="Foot of bed rug" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h3 className="font-serif text-lg md:text-xl text-[var(--text-primary)] mb-3">
                Foot of the Bed
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 flex-1">
                A medium-sized rug placed horizontally at the foot of the bed accents a bench or seating area, adding a touch of tailored elegance.
              </p>
              <Link 
                href="/products?category=bedroom" 
                className="inline-block font-sans text-xs md:text-sm tracking-widest uppercase px-6 py-4 border border-[var(--border-secondary)] text-[var(--text-primary)] bg-transparent group-hover:border-[var(--text-primary)] transition-all duration-300 ease-out text-center"
              >
                Shop Accent Rugs &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
