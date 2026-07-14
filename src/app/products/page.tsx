"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { getCategories, getCategoryIdBySlug } from "@/src/services/Product";

gsap.registerPlugin(ScrollTrigger);

const initialRugCollections = [
  { title: "Luxury", slug: "luxury", image: "/rugs/set1-room.png" },
  { title: "Modern", slug: "modern", image: "/rugs/set2-room.png" },
  { title: "Persian", slug: "persian", image: "/rugs/set3-room.png" },
];

const initialCurtainCollections = [
  { title: "Blackout", slug: "blackout", image: "/curtains/set1-room.png" },
  { title: "Sheer", slug: "sheer", image: "/curtains/set2-room.png" },
  { title: "Velvet", slug: "velvet", image: "/curtains/set3-room.png" },
];

export default function CollectionsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [rugCollections, setRugCollections] = React.useState(initialRugCollections);
  const [curtainCollections, setCurtainCollections] = React.useState(initialCurtainCollections);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const rugsId = await getCategoryIdBySlug("rugs");
        if (rugsId) {
          const rugs = await getCategories(rugsId);
          if (Array.isArray(rugs) && rugs.length > 0) {
            setRugCollections(rugs.map(r => {
              const fallback = initialRugCollections.find(ic => ic.slug === r.slug);
              return {
                title: r.name,
                slug: r.slug,
                image: r.image?.src || fallback?.image || "/rugs/set1-room.png"
              };
            }));
          }
        }

        const curtainsId = await getCategoryIdBySlug("curtains");
        if (curtainsId) {
          const curtains = await getCategories(curtainsId);
          if (Array.isArray(curtains) && curtains.length > 0) {
            setCurtainCollections(curtains.map(c => {
              const fallback = initialCurtainCollections.find(ic => ic.slug === c.slug);
              return {
                title: c.name,
                slug: c.slug,
                image: c.image?.src || fallback?.image || "/curtains/set1-room.png"
              };
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch collections", error);
      }
    }
    fetchCollections();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    // Hero Animations
    gsap.fromTo(
      ".hero-animate",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
      }
    );

    // Section Animations
    const sections = gsap.utils.toArray(".collection-section");
    
    sections.forEach((section: any) => {
      gsap.fromTo(
        section.querySelectorAll(".collection-animate"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="w-full flex flex-col bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 md:px-8 text-center pt-32 pb-16">
        <span className="hero-animate uppercase tracking-widest text-[var(--text-xs)] md:text-[var(--text-sm)] font-medium mb-[var(--space-3)] text-[var(--text-muted)]">
          Our Collections
        </span>
        <h1 className="hero-animate font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] text-[var(--text-primary)] leading-[1.1] mb-[var(--space-4)] max-w-4xl tracking-tight">
          Explore Our Collections
        </h1>
        <p className="hero-animate text-[var(--text-md)] md:text-[var(--text-lg)] text-[var(--text-secondary)] max-w-2xl font-light">
          Discover handcrafted rugs and premium curtains designed to elevate refined living spaces.
        </p>
      </section>

      {/* Rug Collections */}
      <section className="collection-section w-full max-w-[var(--container-lg)] mx-auto px-4 md:px-[var(--space-4)] lg:px-[var(--space-8)] py-[var(--space-7)] md:py-[var(--space-8)]">
        <div className="flex flex-col items-center text-center mb-[var(--space-6)] md:mb-[var(--space-7)]">
          <span className="collection-animate uppercase tracking-widest text-[var(--text-xs)] md:text-[var(--text-sm)] font-medium mb-[var(--space-2)] text-[var(--text-muted)]">
            Rug Collections
          </span>
          <h2 className="collection-animate font-serif text-[clamp(32px,5vw,64px)] text-[var(--text-primary)] mb-[var(--space-3)]">
            Rugs for Every Space
          </h2>
          <p className="collection-animate text-[var(--text-secondary)] max-w-xl text-[var(--text-sm)] md:text-[var(--text-md)]">
            Discover handcrafted rugs designed for luxury interiors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-4)] md:gap-[var(--space-5)]">
          {rugCollections.map((col) => (
            <Link 
              key={col.slug} 
              href={`/products/rugs?category=${col.slug}`}
              className="collection-animate group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-secondary)] mb-[var(--space-3)]">
                <Image 
                  src={col.image} 
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute inset-0 p-[var(--space-4)] flex flex-col justify-end items-center">
                  <span className="text-white text-[var(--text-sm)] tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
                    Explore Collection
                  </span>
                </div>
              </div>
              <h3 className="font-serif text-[var(--text-2xl)] md:text-[var(--text-3xl)] text-[var(--text-primary)] text-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1">
                {col.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Curtain Collections */}
      <section className="collection-section w-full max-w-[var(--container-lg)] mx-auto px-4 md:px-[var(--space-4)] lg:px-[var(--space-8)] py-[var(--space-7)] md:py-[var(--space-8)] border-t border-[var(--border-secondary)] mb-[var(--space-7)]">
        <div className="flex flex-col items-center text-center mb-[var(--space-6)] md:mb-[var(--space-7)]">
          <span className="collection-animate uppercase tracking-widest text-[var(--text-xs)] md:text-[var(--text-sm)] font-medium mb-[var(--space-2)] text-[var(--text-muted)]">
            Curtain Collections
          </span>
          <h2 className="collection-animate font-serif text-[clamp(32px,5vw,64px)] text-[var(--text-primary)] mb-[var(--space-3)]">
            Curtains for Elegant Interiors
          </h2>
          <p className="collection-animate text-[var(--text-secondary)] max-w-xl text-[var(--text-sm)] md:text-[var(--text-md)]">
            Curated curtain collections tailored for modern and timeless spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-4)] md:gap-[var(--space-5)]">
          {curtainCollections.map((col) => (
            <Link 
              key={col.slug} 
              href={`/products/curtains?category=${col.slug}`}
              className="collection-animate group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-secondary)] mb-[var(--space-3)]">
                <Image 
                  src={col.image} 
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute inset-0 p-[var(--space-4)] flex flex-col justify-end items-center">
                  <span className="text-white text-[var(--text-sm)] tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
                    Explore Collection
                  </span>
                </div>
              </div>
              <h3 className="font-serif text-[var(--text-2xl)] md:text-[var(--text-3xl)] text-[var(--text-primary)] text-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1">
                {col.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
