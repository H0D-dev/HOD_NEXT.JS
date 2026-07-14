import React from "react";

interface CatalogHeaderProps {
  title: string;
  subtitle: string;
}

export default function CatalogHeader({ title, subtitle }: CatalogHeaderProps) {
  return (
    <div className="w-full flex flex-col lg:flex-row justify-between lg:items-end mb-4 pt-12 lg:pt-16 border-b border-[var(--border-secondary)] pb-6 lg:pb-8">
      <h1 className="font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] text-[var(--text-primary)] leading-[1.1] mb-2 lg:mb-0 tracking-tight">
        {title}
      </h1>
      <p className="font-sans text-[var(--text-md)] lg:text-[var(--text-lg)] text-[var(--text-secondary)] font-light max-w-sm">
        {subtitle}
      </p>
    </div>
  );
}
