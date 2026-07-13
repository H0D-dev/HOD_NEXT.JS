"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const feedImages = [
  { src: "/images/social/feed_1.png", alt: "Minimalist rug styling" },
  { src: "/images/social/feed_2.png", alt: "Close up of rug texture" },
  { src: "/images/social/feed_3.png", alt: "Cozy minimalist living room corner" },
  { src: "/images/social/feed_4.png", alt: "Beautifully styled wooden coffee table" },
  { src: "/images/social/feed_5.png", alt: "Warm minimalist living room" }
];

export default function SocialFeedSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".social-image", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-[#F9F9F6] py-8 md:py-12 border-t border-[#2C251F]/5">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="text-center mb-10 md:mb-16 px-6">
          <Link 
            href="https://instagram.com/houseofdecor.rugs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block font-sans text-[11px] md:text-xs uppercase tracking-[0.15em] text-[#2C251F]/70 hover:text-[#2C251F] transition-colors"
          >
            FOLLOW US @HOUSEOFDECOR.RUGS
          </Link>
        </div>
        
        {/* Full width or near full width grid with small gaps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 md:px-8 lg:px-12">
          {feedImages.map((image, index) => (
            <div 
              key={index} 
              className={`social-image relative w-full aspect-square overflow-hidden group ${
                index === 4 ? 'hidden lg:block' : index === 3 ? 'hidden md:block lg:block' : ''
              }`}
            >
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-[#2C251F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
