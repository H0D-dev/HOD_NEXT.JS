"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import "./RugCard.css";

interface RugCardProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  parallaxOffset?: { x: number; y: number };
}

export default function RugCard({
  src,
  alt,
  className = "",
  style,
  parallaxOffset = { x: 0, y: 0 },
}: RugCardProps) {
  return (
    <motion.div
      className={`rug-card ${className}`}
      style={{
        ...style,
        position: "relative",
        x: parallaxOffset.x,
        y: parallaxOffset.y,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        style={{ objectFit: "cover" }}
        loading="eager"
      />
    </motion.div>
  );
}
