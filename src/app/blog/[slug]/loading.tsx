import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] pt-24 lg:pt-32 pb-16 px-6 md:px-16 lg:px-24 animate-pulse">
      <div className="max-w-4xl mx-auto">
        <div className="h-3 w-32 bg-neutral-300/40 rounded mb-6"></div>
        <div className="h-10 w-4/5 bg-neutral-300/50 rounded mb-4"></div>
        <div className="h-4 w-48 bg-neutral-300/30 rounded mb-8"></div>
        <div className="w-full aspect-[16/9] bg-neutral-300/30 rounded mb-8"></div>
        <div className="flex flex-col gap-4">
          <div className="h-4 w-full bg-neutral-300/30 rounded"></div>
          <div className="h-4 w-11/12 bg-neutral-300/30 rounded"></div>
          <div className="h-4 w-4/5 bg-neutral-300/30 rounded"></div>
        </div>
      </div>
    </div>
  );
}
