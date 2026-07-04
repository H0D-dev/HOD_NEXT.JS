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
    <section id="bedroom" ref={sectionRef} className="w-full py-16 md:py-32 px-4 md:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="bed-header text-center mb-16">
          <h2 className="font-serif text-[clamp(32px,5vw,64px)] text-[var(--text-primary)]">
            Bedroom
          </h2>
        </div>

        {/* Large Hero Image */}
        <div className="w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] mb-24 overflow-hidden border border-[var(--border-secondary)]">
          <img 
            src="/images/size-guide/bedroom_hero_1782565501415.png" 
            alt="Bedroom rug placement hero" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Layout Cards */}
        <div className="bed-cards-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card A */}
          <div className="bed-card flex flex-col border border-[var(--border-secondary)] bg-[var(--surface-primary)]">
            <div className="aspect-square w-full overflow-hidden border-b border-[var(--border-secondary)]">
              <img 
                src="/images/size-guide/bedroom_full_1782565454914.png" 
                alt="Large rug under bed" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="font-serif text-[clamp(20px,4vw,32px)] text-[var(--text-primary)] mb-4">
                Full Frame
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 flex-1">
                A large rug extending well beyond the sides and foot of the bed offers maximum comfort and a truly grand, luxurious feel to the master suite.
              </p>
              <Link 
                href="/products?category=bedroom" 
                className="font-sans text-xs tracking-wider uppercase text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors underline underline-offset-4"
              >
                Shop Bedroom Rugs &rarr;
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="bed-card flex flex-col border border-[var(--border-secondary)] bg-[var(--surface-primary)]">
            <div className="aspect-square w-full overflow-hidden border-b border-[var(--border-secondary)]">
              <img 
                src="/images/size-guide/bedroom_runners_1782565467316.png" 
                alt="Bedside runners" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="font-serif text-[clamp(20px,4vw,32px)] text-[var(--text-primary)] mb-4">
                Bedside Runners
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 flex-1">
                For smaller spaces or asymmetrical rooms, two runners placed on either side of the bed provide targeted warmth where you step first.
              </p>
              <Link 
                href="/products?category=bedroom" 
                className="font-sans text-xs tracking-wider uppercase text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors underline underline-offset-4"
              >
                Explore Runners &rarr;
              </Link>
            </div>
          </div>

          {/* Card C */}
          <div className="bed-card flex flex-col border border-[var(--border-secondary)] bg-[var(--surface-primary)]">
            <div className="aspect-square w-full overflow-hidden border-b border-[var(--border-secondary)]">
              <img 
                src="/images/size-guide/bedroom_foot_1782565488826.png" 
                alt="Foot of bed rug" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="font-serif text-[clamp(20px,4vw,32px)] text-[var(--text-primary)] mb-4">
                Foot of the Bed
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 flex-1">
                A medium-sized rug placed horizontally at the foot of the bed accents a bench or seating area, adding a touch of tailored elegance.
              </p>
              <Link 
                href="/products?category=bedroom" 
                className="font-sans text-xs tracking-wider uppercase text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors underline underline-offset-4"
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
