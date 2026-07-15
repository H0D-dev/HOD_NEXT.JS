"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Product, ProductVariation } from "./ProductPresentation";
import { Flower, Layers, Globe, Ruler, Sparkles, Home, Scale, Wind, RefreshCw, ShieldCheck, Sun, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductSpecificationsProps {
  product: Product;
  selectedVariation?: ProductVariation | null;
}

const getDetailIcon = (key: string) => {
  const k = key.toLowerCase();
  if (k.includes("material")) return <Flower size={20} strokeWidth={1} />;
  if (k.includes("construction")) return <Layers size={20} strokeWidth={1} />;
  if (k.includes("origin")) return <Globe size={20} strokeWidth={1} />;
  if (k.includes("dimension") || k.includes("pile")) return <Ruler size={20} strokeWidth={1} />;
  if (k.includes("fibre") || k.includes("fiber")) return <Sparkles size={20} strokeWidth={1} />;
  if (k.includes("suitable")) return <Home size={20} strokeWidth={1} />;
  if (k.includes("weight")) return <Scale size={20} strokeWidth={1} />;
  return <Sparkles size={20} strokeWidth={1} />;
};

const sizeGuideData = {
  LivingRoom: [
    { src: "/images/size-guide/living_room_front_1782565538635.png", label: "170 x 240 cm" },
    { src: "/images/size-guide/living_room_full_1782565528143.png", label: "200 x 300 cm" },
    { src: "/images/size-guide/living_room_lshape_1782565549792.png", label: "250 x 350 cm" },
  ],
  Bedroom: [
    { src: "/images/size-guide/bedroom_runners_1782565467316.png", label: "Runners" },
    { src: "/images/size-guide/bedroom_foot_1782565488826.png", label: "170 x 240 cm" },
    { src: "/images/size-guide/bedroom_full_1782565454914.png", label: "250 x 350 cm" },
  ],
  DiningRoom: [
    { src: "/images/size-guide/dining_room_rect_1782565935874.png", label: "200 x 300 cm" },
    { src: "/images/size-guide/dining_room_round_1782565945704.png", label: "240 x 240 cm" },
  ]
};

type RoomType = keyof typeof sizeGuideData;

export default function ProductSpecifications({ product, selectedVariation }: ProductSpecificationsProps) {
  const [activeTab, setActiveTab] = useState<RoomType>("LivingRoom");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 240;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Merge variation specific details
  const computedDetails = { ...product.details };

  if (selectedVariation) {
    if (selectedVariation.dimensions) computedDetails.dimensions = selectedVariation.dimensions;
    if (selectedVariation.weight) computedDetails.weight = selectedVariation.weight;
  }

  return (
    <section className="w-full bg-[var(--bg-primary)] border-t border-[var(--border-secondary)] text-[var(--text-primary)]">

      {/* Top Half: Materials & Construction (Gallery Row Layout) */}
      <div className="w-full border-b border-[var(--border-secondary)] bg-[var(--bg-primary)]">
        <div className="max-w-[1200px] mx-auto py-10 lg:py-14 px-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 md:gap-x-12 md:gap-y-10 lg:gap-x-24">
            {Object.entries(computedDetails).map(([key, value]) => {
              if (!value) return null;
              const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

              let displayValue = value;
              if (key.toLowerCase() === 'weight' && !String(value).toLowerCase().includes('kg')) {
                displayValue = `${value} kg`;
              } else if (key.toLowerCase() === 'dimensions' && !String(value).toLowerCase().includes('cm')) {
                displayValue = `${value} cm`;
              }

              return (
                <div key={key} className="flex flex-col items-center text-center gap-3 w-[120px] md:w-[140px]">
                  <div className="text-[var(--text-primary)] opacity-70 mb-1">
                    {getDetailIcon(key)}
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-sans text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">{formattedKey}</span>
                    <span className="font-sans text-sm md:text-[15px] font-medium text-[var(--text-primary)] tracking-tight">{displayValue}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Half: Care Guide & Size Guide */}
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-0">

        {/* Care Guide */}
        <div className="w-full lg:w-1/2 px-6 lg:px-12 pt-4 pb-10 lg:pt-8 lg:pb-12 flex flex-col">
          <h2 className="font-serif text-lg md:text-xl uppercase tracking-[0.15em] mb-6 font-medium text-center lg:text-left">Care Guide</h2>
          <div className="grid grid-cols-2 border-l border-t border-[var(--border-secondary)] w-full">
            
            <div className="flex flex-col items-center justify-start text-center gap-3 pt-6 px-3 pb-5 md:pt-8 md:px-6 md:pb-6 h-full border-r border-b border-[var(--border-secondary)] hover:bg-black/5 transition-colors">
              <Wind size={24} strokeWidth={1} className="text-[var(--text-primary)] shrink-0" />
              <span className="font-sans text-[11px] md:text-xs text-[var(--text-secondary)] leading-relaxed">Vacuum regularly using low suction.</span>
            </div>
            <div className="flex flex-col items-center justify-start text-center gap-3 pt-6 px-3 pb-5 md:pt-8 md:px-6 md:pb-6 h-full border-r border-b border-[var(--border-secondary)] hover:bg-black/5 transition-colors">
              <RefreshCw size={24} strokeWidth={1} className="text-[var(--text-primary)] shrink-0" />
              <span className="font-sans text-[11px] md:text-xs text-[var(--text-secondary)] leading-relaxed">Rotate every six months.</span>
            </div>
            <div className="flex flex-col items-center justify-start text-center gap-3 pt-6 px-3 pb-5 md:pt-8 md:px-6 md:pb-6 h-full border-r border-b border-[var(--border-secondary)] hover:bg-black/5 transition-colors">
              <ShieldCheck size={24} strokeWidth={1} className="text-[var(--text-primary)] shrink-0" />
              <span className="font-sans text-[11px] md:text-xs text-[var(--text-secondary)] leading-relaxed">Professional cleaning recommended.</span>
            </div>
            <div className="flex flex-col items-center justify-start text-center gap-3 pt-6 px-3 pb-5 md:pt-8 md:px-6 md:pb-6 h-full border-r border-b border-[var(--border-secondary)] hover:bg-black/5 transition-colors">
              <Sun size={24} strokeWidth={1} className="text-[var(--text-primary)] shrink-0" />
              <span className="font-sans text-[11px] md:text-xs text-[var(--text-secondary)] leading-relaxed">Avoid prolonged direct sunlight.</span>
            </div>

          </div>
        </div>

        {/* Size Guide */}
        <div className="w-full lg:w-1/2 px-6 lg:px-12 pt-4 pb-10 lg:pt-8 lg:pb-12 flex flex-col overflow-hidden">
          <h2 className="font-serif text-lg md:text-xl uppercase tracking-[0.15em] mb-3 font-medium text-center lg:text-left">Size Guide</h2>

          <div className="flex gap-5 border-b border-[var(--border-secondary)] mb-4 overflow-x-auto hide-scrollbar">
            {(Object.keys(sizeGuideData) as RoomType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-sans text-[11px] md:text-xs whitespace-nowrap transition-all border-b-2 -mb-[1px] ${activeTab === tab ? 'border-[var(--text-primary)] font-medium text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {tab.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => scroll('left')}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 hidden sm:flex h-[180px] items-center"
            >
              <ChevronLeft size={24} strokeWidth={1} />
            </button>

            <div 
              ref={scrollRef}
              className="flex-1 flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2 scroll-smooth"
            >
              {sizeGuideData[activeTab].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 shrink-0 snap-center min-w-[200px]">
                  <div className={`relative w-[200px] h-[180px] bg-white border flex items-center justify-center p-0 transition-colors ${idx === 0 ? 'border-[#C2A789]' : 'border-[var(--border-secondary)]'}`}>
                    <div className="relative w-full h-full">
                      <Image src={item.src} alt={item.label} fill className="object-contain" />
                    </div>
                  </div>
                  <span className="font-sans text-xs md:text-[13px] text-[var(--text-primary)] font-medium tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => scroll('right')}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 hidden sm:flex h-[180px] items-center"
            >
              <ChevronRight size={24} strokeWidth={1} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
