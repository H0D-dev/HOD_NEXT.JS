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
    // Fade up texts
    const textBlocks = gsap.utils.toArray<HTMLElement>(".lr-text-reveal");
    textBlocks.forEach((block) => {
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
    });

    // Image Parallax
    const images = gsap.utils.toArray<HTMLElement>(".lr-image-parallax");
    images.forEach((imgContainer) => {
      const img = imgContainer.querySelector("img");
      if (img) {
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
    <section id="living-room" ref={containerRef} className="w-full py-24 md:py-32 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="lr-text-reveal text-center max-w-[800px] mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-6xl text-[var(--text-primary)] mb-6">
            Living Room
          </h2>
          <p className="font-sans text-base md:text-lg text-[var(--text-secondary)] font-light">
            Choosing the right rug creates visual balance and unifies your seating arrangement.
          </p>
        </div>

        {/* Large Hero Image */}
        <div className="lr-image-parallax w-full aspect-[21/9] mb-32 overflow-hidden border border-[var(--border-secondary)]">
          <img 
            src="/images/size-guide/living_room_hero_1782565513474.png" 
            alt="Living Room rug placement hero" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Layout A — Full Coverage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-32 items-center">
          <div className="lr-text-reveal order-2 md:order-1">
            <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-6">
              Full Coverage
            </h3>
            <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              A large rug fully situated under the furniture creates a defined, room-within-a-room aesthetic. This is ideal for open-plan spaces, ensuring all pieces—sofa, chairs, and tables—are anchored on the same premium surface.
            </p>
          </div>
          <div className="lr-image-parallax overflow-hidden order-1 md:order-2 aspect-[4/3] bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
            <img 
              src="/images/size-guide/living_room_full_1782565528143.png" 
              alt="Living room full coverage layout" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Layout B — Front Legs Placement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-32 items-center">
          <div className="lr-image-parallax overflow-hidden aspect-[4/3] bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
            <img 
              src="/images/size-guide/living_room_front_1782565538635.png" 
              alt="Living room front legs layout" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lr-text-reveal">
            <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-6">
              Front Legs Placement
            </h3>
            <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              Placing just the front legs of your sofa and armchairs on the rug is a versatile approach that visually connects the seating arrangement while leaving the room feeling expansive and uncluttered.
            </p>
          </div>
        </div>

        {/* Layout C — L-Shaped Sofa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="lr-text-reveal order-2 md:order-1">
            <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-6">
              L-Shaped Sofa
            </h3>
            <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-10">
              An L-shaped sofa faces in two directions, so ensure the rug sits comfortably beneath both sections and aligns evenly. This maintains symmetry and balance within the architectural flow.
            </p>
            <Link 
              href="/products?category=living-room" 
              className="inline-block font-sans text-sm tracking-wider uppercase px-8 py-4 border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] transition-colors duration-500 ease-out"
            >
              Browse Living Room Rugs &rarr;
            </Link>
          </div>
          <div className="lr-image-parallax overflow-hidden order-1 md:order-2 aspect-[4/3] bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
            <img 
              src="/images/size-guide/living_room_lshape_1782565549792.png" 
              alt="L-shaped sofa layout" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
