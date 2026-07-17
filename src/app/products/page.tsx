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

type RugCollection = {
  title: string;
  slug: string;
  image: string;
};

export default function CollectionsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [rugCollections, setRugCollections] = React.useState<RugCollection[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const rugsId = await getCategoryIdBySlug("rugs");
        if (rugsId) {
          const rugs = await getCategories(rugsId);
          if (Array.isArray(rugs) && rugs.length > 0) {
            setRugCollections(rugs.map(r => ({
              title: r.name,
              slug: r.slug,
              image: r.image?.src || "/rugs/set1-room.png"
            })));
          }
        }
      } catch (error) {
        console.error("Failed to fetch collections", error);
      } finally {
        setLoading(false);
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

    // Image Parallax
    const parallaxImages = gsap.utils.toArray(".parallax-image");
    parallaxImages.forEach((image: any) => {
      gsap.fromTo(
        image,
        { yPercent: -10, scale: 1.15 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: image.closest(".collection-animate"),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    });
  }, { scope: containerRef, dependencies: [rugCollections] });

  return (
    <main ref={containerRef} className="w-full flex flex-col bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 md:px-8 text-center pt-32 pb-8 lg:pt-40 lg:pb-12">
        <span className="hero-animate block text-[var(--text-muted)] font-sans text-[10px] md:text-xs uppercase tracking-widest mb-3 font-medium">
          Rug Collections
        </span>
        <h1 className="hero-animate font-serif text-2xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-[var(--text-primary)] mb-3 max-w-3xl">
          Handcrafted Rugs
        </h1>
        <p className="hero-animate font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)] max-w-xl">
          Discover handcrafted rugs designed to elevate refined living spaces.
        </p>
      </section>

      {/* Rug Collections */}
      <section className="collection-section w-full max-w-[1200px] mx-auto pb-8 md:pb-12 lg:pb-24 px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div 
                key={idx} 
                className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-secondary)] animate-pulse" 
              />
            ))
          ) : (
            rugCollections.map((col) => (
            <Link 
              key={col.slug} 
              href={`/products/rugs?category=${col.slug}`}
              className="collection-animate group flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
                <Image 
                  src={col.image} 
                  alt={col.title}
                  fill
                  className="parallax-image object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end items-center">
                  <span className="text-white font-sans text-xs md:text-sm uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
                    Explore Collection
                  </span>
                </div>
              </div>
              <h3 className="font-sans text-sm md:text-base font-normal text-[var(--text-primary)] text-center mt-4 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1">
                {col.title}
              </h3>
            </Link>
          )))}
        </div>
      </section>


    </main>
  );
}
