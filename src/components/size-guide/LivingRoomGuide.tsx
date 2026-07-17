"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function LivingRoomGuide() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Fade up texts and setup image crossfade
    const textBlocks = gsap.utils.toArray<HTMLElement>(".lr-text-reveal");
    
    // Set initial image states
    gsap.set(".lr-image", { opacity: 0 });
    gsap.set(".lr-image-0", { opacity: 1 });

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
          gsap.to(".lr-image", { opacity: 0, duration: 0.4, overwrite: "auto" });
          gsap.to(`.lr-image-${i}`, { opacity: 1, duration: 0.4, overwrite: "auto" });
        },
        onEnterBack: () => {
          gsap.to(".lr-image", { opacity: 0, duration: 0.4, overwrite: "auto" });
          gsap.to(`.lr-image-${i}`, { opacity: 1, duration: 0.4, overwrite: "auto" });
        }
      });
    });

  }, { scope: containerRef });

  return (
    <section id="living-room" ref={containerRef} className="w-full py-8 md:py-12 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-[800px] mx-auto mb-10 md:mb-12">
          <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[var(--text-primary)] mb-4 md:mb-6 leading-[1.2]">
            Living Room
          </h2>
          <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] font-light">
            Choosing the right rug creates visual balance and unifies your seating arrangement.
          </p>
        </div>

        {/* Large Hero Image */}
        <div className="w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] mb-12 md:mb-16 overflow-hidden border border-[var(--border-secondary)]">
          <img 
            src="/images/size-guide/living_room_hero_1782565513474.png" 
            alt="Living Room rug placement hero" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Sticky Scroll Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative">
          
          {/* Left Column — Scrolling Text Blocks */}
          <div className="lg:col-span-5 flex flex-col lg:pb-[30vh]">
            
            {/* Block 0 — Full Coverage */}
            <div className="lr-text-reveal flex flex-col justify-center min-h-[40vh] lg:min-h-[50vh] py-12 lg:py-16 border-t border-[var(--border-secondary)] lg:border-none">
              <h3 className="font-serif text-lg md:text-xl text-[var(--text-primary)] mb-3 md:mb-4">
                Full Coverage
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                A large rug fully situated under the furniture creates a defined, room-within-a-room aesthetic. This is ideal for open-plan spaces, ensuring all pieces—sofa, chairs, and tables—are anchored on the same premium surface.
              </p>
              {/* Mobile Fallback Image */}
              <div className="block lg:hidden w-full aspect-[4/3] mt-8 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] overflow-hidden">
                <img 
                  src="/images/size-guide/living_room_full_1782565528143.png" 
                  alt="Living room full coverage layout" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Block 1 — Front Legs Placement */}
            <div className="lr-text-reveal flex flex-col justify-center min-h-[40vh] lg:min-h-[50vh] py-12 lg:py-16 border-t border-[var(--border-secondary)] lg:border-none">
              <h3 className="font-serif text-lg md:text-xl text-[var(--text-primary)] mb-3 md:mb-4">
                Front Legs Placement
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                Placing just the front legs of your sofa and armchairs on the rug is a versatile approach that visually connects the seating arrangement while leaving the room feeling expansive and uncluttered.
              </p>
              {/* Mobile Fallback Image */}
              <div className="block lg:hidden w-full aspect-[4/3] mt-8 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] overflow-hidden">
                <img 
                  src="/images/size-guide/living_room_front_1782565538635.png" 
                  alt="Living room front legs layout" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Block 2 — L-Shaped Sofa */}
            <div className="lr-text-reveal flex flex-col justify-center min-h-[40vh] lg:min-h-[50vh] py-12 lg:py-16 border-t lg:border-none border-b border-[var(--border-secondary)] lg:pb-24">
              <h3 className="font-serif text-lg md:text-xl text-[var(--text-primary)] mb-3 md:mb-4">
                L-Shaped Sofa
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8">
                An L-shaped sofa faces in two directions, so ensure the rug sits comfortably beneath both sections and aligns evenly. This maintains symmetry and balance within the architectural flow.
              </p>
              <Link 
                href="/products?category=living-room" 
                className="inline-block self-start font-sans text-xs md:text-sm tracking-widest uppercase px-6 py-4 border border-[var(--accent-primary)] text-[var(--text-primary)] bg-transparent hover:bg-[var(--accent-primary)] hover:text-[#111] transition-colors duration-500 ease-out"
              >
                Browse Living Room Rugs
              </Link>
              {/* Mobile Fallback Image */}
              <div className="block lg:hidden w-full aspect-[4/3] mt-8 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] overflow-hidden">
                <img 
                  src="/images/size-guide/living_room_lshape_1782565549792.png" 
                  alt="L-shaped sofa layout" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

          {/* Right Column — Sticky Desktop Images */}
          <div className="hidden lg:block lg:col-span-7 sticky top-24 lg:top-28 h-[calc(100vh-8rem)] max-h-[800px]">
            <div className="w-full h-full relative bg-[var(--bg-secondary)] border border-[var(--border-secondary)] overflow-hidden">
              <img 
                src="/images/size-guide/living_room_full_1782565528143.png" 
                alt="Living room full coverage layout" 
                className="lr-image lr-image-0 absolute inset-0 w-full h-full object-cover"
              />
              <img 
                src="/images/size-guide/living_room_front_1782565538635.png" 
                alt="Living room front legs layout" 
                className="lr-image lr-image-1 absolute inset-0 w-full h-full object-cover"
              />
              <img 
                src="/images/size-guide/living_room_lshape_1782565549792.png" 
                alt="L-shaped sofa layout" 
                className="lr-image lr-image-2 absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
