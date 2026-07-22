import React from "react";

interface CatalogHeaderProps {
  title: string;
  subtitle: string;
}

export default function CatalogHeader({ title, subtitle }: CatalogHeaderProps) {
  return (
    <div className="w-full flex flex-col lg:flex-row justify-between lg:items-end mb-4 pt-4 lg:pt-6 border-b border-[var(--border-secondary)] pb-6 lg:pb-8">
      <h1 className="font-sans font-light text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[var(--text-primary)] leading-[1.1] mb-2 lg:mb-0 tracking-tight">
        {title}
      </h1>
      <p className="font-sans text-[10px] md:text-xs text-[#8C8C8C] font-light max-w-sm uppercase tracking-[0.1em] mt-2 md:mt-0">
        {subtitle}
      </p>
    </div>
  );
}
