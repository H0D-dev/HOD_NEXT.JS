"use client";

import React, { useEffect } from "react";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenisInstance: any = null;
    let animationFrameId: number;

    // Dynamically import Lenis on client mount to keep it out of critical bundle
    import("lenis").then((LenisModule) => {
      const Lenis = LenisModule.default;
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        if (lenisInstance) {
          lenisInstance.raf(time);
          animationFrameId = requestAnimationFrame(raf);
        }
      }

      animationFrameId = requestAnimationFrame(raf);
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
