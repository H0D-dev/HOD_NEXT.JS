"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Gem, PenTool, Leaf, Globe, MapPin, CheckCircle } from "lucide-react";

export default function ServicesWhyUs() {
  const cards = [
    { icon: <Gem strokeWidth={1} size={32} />, title: "Handmade\nExcellence", desc: "Meticulously handcrafted by skilled artisans using traditional techniques." },
    { icon: <PenTool strokeWidth={1} size={32} />, title: "Bespoke\nDesign", desc: "Tailored designs, custom sizes, and unique patterns made for your space." },
    { icon: <Leaf strokeWidth={1} size={32} />, title: "Premium Natural\nMaterials", desc: "The finest wool, silk, and natural fibers for unmatched quality and beauty." },
    { icon: <Globe strokeWidth={1} size={32} />, title: "Global\nCraftsmanship", desc: "Collaborating with master weavers from heritage weaving regions." },
    { icon: <MapPin strokeWidth={1} size={32} />, title: "Dubai-Based\nSupport", desc: "Local expertise, on-ground support, and personalized client experience." },
    { icon: <CheckCircle strokeWidth={1} size={32} />, title: "End-to-End Project\nManagement", desc: "Seamless execution from concept to installation and beyond." },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let intervalId: NodeJS.Timeout;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        // Only auto-scroll if container has overflow (mobile)
        if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          
          // If at the end, snap back to start
          if (scrollContainer.scrollLeft >= maxScroll - 10) {
            scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            // Scroll right by roughly one card width (cards are ~85% width)
            scrollContainer.scrollBy({ left: scrollContainer.clientWidth * 0.8, behavior: "smooth" });
          }
        }
      }, 1500);
    };

    startAutoScroll();

    // Pause on interaction
    const handleTouch = () => {
      clearInterval(intervalId);
      // Resume auto-scroll after 5 seconds of inactivity
      setTimeout(() => {
        clearInterval(intervalId);
        startAutoScroll();
      }, 5000);
    };

    scrollContainer.addEventListener("touchstart", handleTouch, { passive: true });
    
    return () => {
      clearInterval(intervalId);
      scrollContainer.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 px-5 md:px-10 lg:px-16 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left: Sticky Title */}
        <div className="lg:w-1/4 shrink-0">
          <div className="sticky top-32 flex flex-col">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6 font-medium">
              Why House of Decor
            </span>
            <h2 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)]">
              More Than Rugs.<br className="hidden lg:block" /> A Partnership in<br className="hidden lg:block" /> Excellence.
            </h2>
          </div>
        </div>

        {/* Right: Grid */}
        <div className="lg:w-3/4 w-full">
          <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4 md:pb-0">
            {cards.map((card, i) => (
              <div
                key={i}
                className="flex-none w-[85%] sm:w-[60%] md:w-auto snap-center flex flex-col items-center text-center p-5 md:p-6 bg-[var(--bg-primary)] border border-[var(--border-secondary)] hover:border-[var(--accent-primary)] transition-all duration-300 group"
              >
                <div className="text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300 mb-4">
                  {card.icon}
                </div>
                <h3 className="font-sans text-sm lg:text-base font-light text-[var(--text-primary)] whitespace-pre-line leading-relaxed mb-2 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="font-sans text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
