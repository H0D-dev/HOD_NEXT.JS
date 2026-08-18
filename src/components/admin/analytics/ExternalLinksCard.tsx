"use client";

import React from "react";
import { ExternalLink, Activity, Zap } from "lucide-react";

export default function ExternalLinksCard() {
  return (
    <div className="border border-[var(--border-secondary,#262626)] bg-[var(--bg-secondary,#141414)] rounded-[2px] p-5">
      <div className="flex items-center justify-between mb-3 border-b border-[var(--border-secondary,#222)] pb-3">
        <div>
          <h4 className="font-sans text-xs uppercase tracking-[0.16em] text-[var(--text-primary,#FAF9F5)] font-medium">
            Core Web Infrastructure
          </h4>
          <p className="font-sans text-[11px] text-[var(--text-secondary,#888)] font-light mt-0.5">
            Production telemetry & edge network performance
          </p>
        </div>
        <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-[1px]">
          Vercel Connected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {/* Vercel Analytics */}
        <a
          href="https://vercel.com/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-4 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#1a1a1a)] hover:border-[var(--accent-primary,#A38A61)] rounded-[1px] transition-all flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[var(--border-secondary,#333)] bg-[var(--bg-primary,#111)] flex items-center justify-center text-[#A38A61]">
              <Activity size={15} />
            </div>
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-primary,#FAF9F5)] font-medium block group-hover:text-[#D4AF37] transition-colors">
                Vercel Analytics
              </span>
              <span className="text-[10px] text-[var(--text-secondary,#777)] font-light">
                Real-time traffic & pageviews
              </span>
            </div>
          </div>
          <ExternalLink size={14} className="text-[var(--text-muted,#777)] group-hover:text-[#D4AF37] transition-colors" />
        </a>

        {/* Vercel Speed Insights */}
        <a
          href="https://vercel.com/insights"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-4 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#1a1a1a)] hover:border-[var(--accent-primary,#A38A61)] rounded-[1px] transition-all flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[var(--border-secondary,#333)] bg-[var(--bg-primary,#111)] flex items-center justify-center text-[#A38A61]">
              <Zap size={15} />
            </div>
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-primary,#FAF9F5)] font-medium block group-hover:text-[#D4AF37] transition-colors">
                Speed Insights
              </span>
              <span className="text-[10px] text-[var(--text-secondary,#777)] font-light">
                Core Web Vitals & LCP / CLS
              </span>
            </div>
          </div>
          <ExternalLink size={14} className="text-[var(--text-muted,#777)] group-hover:text-[#D4AF37] transition-colors" />
        </a>
      </div>
    </div>
  );
}
