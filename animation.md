# House of Décor — Animations & Effects Guide

This document outlines the standard animations, GSAP effects, and micro-interactions used throughout the House of Décor website to maintain a premium, luxury aesthetic. Implement these conventions when building new pages or components.

## 1. Smooth Scrolling (Lenis)

All pages should utilize Lenis to create a buttery smooth scrolling experience.

### Implementation
Add the following `useEffect` to your page component (e.g., `page.tsx`), and ensure the component is marked as a client component (`"use client";`).

```tsx
"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export default function Page() {
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

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      {/* Page Content */}
    </main>
  );
}
```

## 2. Text Selection (Highlight) Color

The text selection highlight should feel intentional and on-brand, rather than the browser's default blue. 

This has been configured globally in `src/app/globals.css`:
```css
::selection {
    background: var(--text-primary);
    color: var(--bg-primary);
}
```
**Usage**: You do not need to add custom Tailwind `selection:` classes manually anymore. It will automatically apply a black background with white text (in light mode) and white background with black text (in dark mode) globally.

## 3. GSAP Fade-Ups & Staggers

For standard text reveals, hero sections, and grids of cards, use GSAP `ScrollTrigger` and `fromTo`.

### Standard Fade-Up Setup
```tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Component() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".animate-element",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15, // Stagger for multiple elements
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // Triggers when the top of container hits 80% of viewport
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef}>
      <h2 className="animate-element">Title</h2>
      <p className="animate-element">Description</p>
    </section>
  );
}
```

## 4. Scroll-Jacking (Pinned Sections)

For sections where content must change dynamically as you scroll without moving down the page immediately (like the `MaterialCare` or Size Guide diagrams), use a pinned container.

### Setup Structure
1. Create a tall outer container (e.g., `h-[400vh]`).
2. Create an inner `h-screen` container.
3. Pin the inner container using GSAP `ScrollTrigger`.
4. Use the `self.progress` (0 to 1) in the `onUpdate` callback to update React state (e.g., active tabs/images).

```tsx
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: outerContainerRef.current,
      start: "top top",
      end: "+=300%", // The amount of scroll distance the user must travel
      pin: innerContainerRef.current, // Pin the viewport container
      scrub: true,
      onUpdate: (self) => {
        // self.progress goes from 0.0 to 1.0
        let newIndex = Math.floor(self.progress * items.length);
        if (newIndex >= items.length) newIndex = items.length - 1;
        setActiveIndex(newIndex);
      }
    });
  }, { scope: outerContainerRef });
```

## 5. Micro-Animations (CSS/Tailwind)

For hovers on buttons or cards, use standard CSS transitions utilizing our premium easing curves.

**Cards:**
```tsx
className="transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--bg-tertiary)]"
```

**Icons inside Cards:**
```tsx
className="transition-colors duration-500 group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-primary)]"
```

**CTAs (Fill Animation):**
```tsx
<a className="group relative inline-flex items-center justify-center px-12 py-5 border overflow-hidden">
  <span className="relative z-10 transition-colors duration-[0.6s]">Button Text</span>
  <div className="absolute inset-0 bg-black translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
</a>
```
