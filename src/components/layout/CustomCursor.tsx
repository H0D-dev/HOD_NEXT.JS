"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCursorStore } from "@/src/lib/store/useCursorStore";
import "./CustomCursor.css";

export default function CustomCursor() {
  const mode = useCursorStore((state) => state.mode);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTouch, setIsTouch] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    setIsTouch(isTouchDevice);
  }, []);

  const isHiddenRef = useRef(false);

  // Global hover detection for buttons and links
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.native-pointer')) {
        isHiddenRef.current = true;
        gsap.to([cursorRef.current, dotRef.current], { opacity: 0, duration: 0.2 });
      } else {
        isHiddenRef.current = false;
      }
      
      if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };
    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);

  useGSAP(() => {
    if (isTouch || !cursorRef.current || !dotRef.current) return;

    gsap.set(cursorRef.current, { opacity: 0, xPercent: -50, yPercent: -50 });
    gsap.set(dotRef.current, { opacity: 0, xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });
    
    // Dot moves faster for more precise feel
    const dotXTo = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" });
    const dotYTo = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" });

    let lastX = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      if (cursorRef.current && cursorRef.current.style.opacity === "0" && !isHiddenRef.current) {
        gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 });
        gsap.to(dotRef.current, { opacity: 1, duration: 0.3 });
      }

      xTo(clientX);
      yTo(clientY);
      dotXTo(clientX);
      dotYTo(clientY);
      
      if (isDragging && cursorRef.current) {
        const deltaX = clientX - lastX;
        const rotation = Math.max(-15, Math.min(15, deltaX * 0.5));
        gsap.to(cursorRef.current, { rotation, duration: 0.2 });
      } else {
        gsap.to(cursorRef.current, { rotation: 0, duration: 0.2 });
      }
      lastX = clientX;
    };

    const onMouseDown = () => {
      setIsDragging(true);
      gsap.to(cursorRef.current, { scale: 0.85, duration: 0.2 });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      gsap.to(cursorRef.current, { scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isTouch, isDragging]);

  useGSAP(() => {
    if (isTouch || !cursorRef.current || !textRef.current || !dotRef.current) return;

    if (mode === "view") {
      gsap.to(cursorRef.current, {
        width: 100,
        height: 100,
        backgroundColor: "transparent",
        color: "#fff",
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: "1px",
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(textRef.current, { opacity: 1, duration: 0.2 });
      gsap.to(dotRef.current, { opacity: 0, duration: 0.2 });
    } else if (mode === "drag" && !isHoveringClickable) {
      gsap.to(cursorRef.current, {
        width: 80,
        height: 80,
        backgroundColor: "transparent",
        color: "var(--text-secondary)",
        borderColor: "var(--text-secondary)",
        borderWidth: "1px",
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(textRef.current, { opacity: 1, duration: 0.2 });
      gsap.to(dotRef.current, { opacity: 0, duration: 0.2 });
    } else if (isHoveringClickable) {
      gsap.to(cursorRef.current, {
        width: 48,
        height: 48,
        backgroundColor: "transparent",
        color: "transparent", // Hide text
        borderColor: "var(--text-secondary)",
        borderWidth: "1px",
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(textRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(dotRef.current, { opacity: 1, scale: 1, duration: 0.2 });
    } else {
      // Default state: Small circle with black dot, no text
      if (!isHiddenRef.current) {
        gsap.to(cursorRef.current, {
          width: 24,
          height: 24,
          backgroundColor: "transparent",
          color: "transparent",
          borderColor: "var(--text-secondary)",
          borderWidth: "1px",
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(textRef.current, { opacity: 0, duration: 0.2 });
        gsap.to(dotRef.current, { opacity: 1, scale: 1, duration: 0.2 });
      }
    }
  }, [mode, isTouch, isHoveringClickable]);

  if (isTouch) return null;

  return (
    <>
      <div 
        ref={cursorRef} 
        className={`custom-cursor pointer-events-none fixed top-0 left-0 rounded-full flex items-center justify-center ${mode === "view" ? "shadow-lg" : "mix-blend-difference"}`}
        style={{
          zIndex: 9999,
          width: '24px',
          height: '24px',
          border: '1px solid var(--text-secondary)',
          color: 'transparent'
        }}
      >
        <span ref={textRef} className="custom-cursor__text font-sans text-[10px] uppercase tracking-widest text-center px-2 font-medium transition-colors duration-300 opacity-0 leading-tight">
          {mode === "view" ? "Click to view more" : mode === "drag" ? "Drag" : ""}
        </span>
      </div>
      {/* Inner Dot */}
      <div 
        ref={dotRef}
        className="custom-cursor-dot pointer-events-none fixed top-0 left-0 rounded-full mix-blend-difference"
        style={{
          zIndex: 9999,
          width: '4px',
          height: '4px',
          backgroundColor: 'var(--text-secondary)'
        }}
      />
    </>
  );
}
