"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const topics = [
  {
    id: "weaving-techniques",
    title: "Weaving Techniques",
    description: "Explore our exquisite weaving techniques that blend tradition with modern artistry to create stunning, high-quality rugs.",
    image: "/rugs/weaving_techniques.png",
  },
  {
    id: "fibers-material",
    title: "Fibers & Material",
    description: "Discover our premium fibers and materials, chosen for their durability and beauty, ensuring every rug is a masterpiece.",
    image: "/rugs/fibers_material.png",
  },
  {
    id: "rug-making-process",
    title: "Rug Making Process",
    description: "Experience the meticulous rug-making process, where skilled artisans transform your design into a handcrafted work of art.",
    image: "/rugs/rug_making_process.png",
  },
  {
    id: "rug-guide",
    title: "Rug Guide",
    description: "Navigate your perfect rug choice with our comprehensive rug guide, featuring tips on style, size, and care for lasting beauty.",
    image: "/rugs/rug_guide.png",
  },
];

export default function KnowGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(() => {
    imagesRef.current.forEach((img, i) => {
      if (img) {
        gsap.to(img, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement, // Trigger on the image container
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-[var(--bg-primary)] py-12 lg:py-16" id="know-grid-section">
      <div className="w-full max-w-[var(--container-lg)] mx-auto px-4 md:px-8">
        
        <div className="flex justify-center items-center text-center mb-10 md:mb-12">
          <h2 className="font-sans font-light text-xl lg:text-2xl leading-[1.2] tracking-wide text-[var(--text-primary)]">
            The Craftsmanship
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-10">
          {topics.map((topic, idx) => (
             <div key={topic.id} className="flex flex-col items-start group">
             {/* To achieve parallax, we use a container with overflow hidden, 
                 and an image slightly taller that gets shifted down */}
             <div className="w-full aspect-square md:aspect-[2/3] overflow-hidden bg-[var(--bg-secondary)] mb-4 relative">
               <Image
                 ref={el => { imagesRef.current[idx] = el; }}
                 src={topic.image}
                 alt={topic.title}
                 width={600}
                 height={900}
                 className="w-full h-[115%] absolute -top-[7.5%] object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
               />
             </div>
             <span className="font-sans text-[10px] lg:text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
               0{idx + 1}
             </span>
             <h3 className="font-sans text-sm font-medium mb-1">
               {topic.title}
             </h3>
             <p className="font-sans text-sm font-light text-[var(--text-secondary)] leading-relaxed mb-4 max-w-[400px]">
               {topic.description}
             </p>
             <Link
               href={`/know-your-rug/${topic.id}`}
               className="font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] relative group-hover:text-[var(--text-primary)] transition-colors duration-300 pb-1"
             >
               EXPLORE
               <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[var(--border-secondary)] transition-colors duration-300 group-hover:bg-[var(--border-primary)]"></span>
             </Link>
           </div>
          ))}
        </div>

      </div>
    </section>
  );
}
