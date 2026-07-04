"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function QuoteBlock() {
  const quoteRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".quote-text",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 75%",
        },
      }
    );
  }, { scope: quoteRef });

  return (
    <section 
      ref={quoteRef}
      className="w-full py-16 md:py-32 px-4 md:px-8 bg-[var(--bg-tertiary)] flex justify-center items-center text-center"
    >
      <div className="max-w-[800px] mx-auto flex flex-col items-center">
        <h2 className="quote-text font-serif text-[clamp(28px,5vw,48px)] italic leading-[1.2] text-[var(--text-primary)] mb-8">
          “A rug or curtain can anchor a room, define a space, and completely transform how a home feels.”
        </h2>
        <span className="quote-text font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-[var(--text-muted)]">
          House of Décor
        </span>
      </div>
    </section>
  );
}
