"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function CurtainGuide() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".curtain-section");
    
    sections.forEach((section) => {
      // Text fade up
      const text = section.querySelector(".curtain-text");
      if (text) {
        gsap.fromTo(
          text,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          }
        );
      }
      
      // Image Parallax
      const imgContainer = section.querySelector(".curtain-image-container");
      const img = imgContainer?.querySelector("img");
      if (imgContainer && img) {
        gsap.fromTo(
          img,
          { scale: 1.1, y: -20 },
          {
            scale: 1,
            y: 20,
            ease: "none",
            scrollTrigger: {
              trigger: imgContainer,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    });
  }, { scope: containerRef });

  return (
    <section id="curtains" ref={containerRef} className="w-full py-24 md:py-32 px-4 md:px-8 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-24">
          <h2 className="font-serif text-4xl md:text-6xl text-[var(--text-primary)] mb-6">
            Curtains & Windows
          </h2>
          <p className="font-sans text-base md:text-lg text-[var(--text-secondary)] font-light">
            Properly fitted curtains elevate the architectural framing of a room, manipulating perceived height and space.
          </p>
        </div>

        {/* Part 1: Curtain Length */}
        <div className="curtain-section grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-32">
          <div className="curtain-text order-2 md:order-1">
            <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-6">
              Curtain Length
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-sans text-sm tracking-widest uppercase text-[var(--text-primary)] mb-2">Sill Length</h4>
                <p className="font-sans text-sm md:text-base text-[var(--text-secondary)]">Ends exactly at the window sill. Perfect for kitchens and bathrooms where deep drops aren&apos;t practical.</p>
              </div>
              <div>
                <h4 className="font-sans text-sm tracking-widest uppercase text-[var(--text-primary)] mb-2">Floor Length</h4>
                <p className="font-sans text-sm md:text-base text-[var(--text-secondary)]">Grazes the floor perfectly. The most popular choice for a crisp, tailored look in modern living spaces.</p>
              </div>
              <div>
                <h4 className="font-sans text-sm tracking-widest uppercase text-[var(--text-primary)] mb-2">Puddle</h4>
                <p className="font-sans text-sm md:text-base text-[var(--text-secondary)]">Fabric pools on the floor (2-4 extra inches). Ideal for formal dining rooms and adding romantic luxury.</p>
              </div>
            </div>
          </div>
          <div className="curtain-image-container overflow-hidden order-1 md:order-2 aspect-[3/4] bg-[var(--bg-primary)] border border-[var(--border-secondary)]">
            <img 
              src="/images/size-guide/curtain_length_1782565958694.png" 
              alt="Curtain lengths illustration" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Part 2: Curtain Width */}
        <div className="curtain-section grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-32">
          <div className="curtain-image-container overflow-hidden aspect-[3/4] bg-[var(--bg-primary)] border border-[var(--border-secondary)]">
            <img 
              src="/images/size-guide/curtain_width_1782565971656.png" 
              alt="Curtain width illustration" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="curtain-text">
            <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-6">
              Curtain Width
            </h3>
            <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
              To ensure your curtains look full and luxurious when closed, the combined width of the panels should be 1.5x to 2x the width of your window.
            </p>
            <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              Skimping on fabric results in flat panels that look unfinished. More gather equals a more opulent aesthetic.
            </p>
          </div>
        </div>

        {/* Part 3: Rod Placement */}
        <div className="curtain-section grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="curtain-text order-2 md:order-1">
            <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-6">
              Rod Placement
            </h3>
            <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-10">
              Mount rods higher and wider than the actual window frame. Installing the rod closer to the ceiling creates the illusion of grandeur and expanded vertical height, while wide placement makes the window appear larger.
            </p>
            <Link 
              href="/products?category=curtains" 
              className="inline-block font-sans text-sm tracking-wider uppercase px-8 py-4 border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-black transition-colors duration-500 ease-out"
            >
              Explore Curtains &rarr;
            </Link>
          </div>
          <div className="curtain-image-container overflow-hidden order-1 md:order-2 aspect-[3/4] bg-[var(--bg-primary)] border border-[var(--border-secondary)]">
            <img 
              src="/images/size-guide/curtain_rod_1782565984150.png" 
              alt="Rod placement architectural" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
