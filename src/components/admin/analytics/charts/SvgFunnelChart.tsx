"use client";

import React from "react";
import { ArrowDown, CheckCircle2, ChevronRight } from "lucide-react";

export interface FunnelStageData {
  stage: string;
  label: string;
  count: number;
  conversionFromPrev: number; // e.g. 85.2%
  conversionOverall: number; // e.g. 3.4%
  dropoffRate?: number;
}

interface SvgFunnelChartProps {
  stages: FunnelStageData[];
  emptyMessage?: string;
}

export default function SvgFunnelChart({
  stages = [],
  emptyMessage = "No funnel data available for this range.",
}: SvgFunnelChartProps) {
  if (!stages.length) {
    return (
      <div className="flex items-center justify-center h-48 border border-dashed border-[var(--border-secondary,#262626)] text-xs text-[var(--text-muted,#777)] uppercase tracking-wider font-light">
        {emptyMessage}
      </div>
    );
  }

  const maxCount = Math.max(1, stages[0]?.count || 1);

  return (
    <div className="space-y-4">
      {stages.map((stage, idx) => {
        const widthPct = Math.max(12, (stage.count / maxCount) * 100);
        const isFirst = idx === 0;
        const isLast = idx === stages.length - 1;

        return (
          <div key={stage.stage} className="relative">
            {/* Step Block */}
            <div className="p-4 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#141414)] rounded-[2px] hover:border-[var(--accent-primary,#A38A61)]/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full border border-[var(--border-secondary,#333)] bg-[var(--bg-secondary,#1e1e1e)] text-[10px] font-mono flex items-center justify-center text-[var(--text-muted,#888)]">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--text-primary,#FAF9F5)] font-medium">
                      {stage.label}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="font-mono text-sm font-semibold text-[var(--text-primary,#FAF9F5)]">
                      {stage.count.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted,#777)] ml-1">sessions</span>
                  </div>

                  <div className="px-2.5 py-1 bg-[var(--bg-secondary,#1a1a1a)] border border-[var(--border-secondary,#333)] rounded-[1px] text-right min-w-[72px]">
                    <span className="text-[11px] font-mono text-[var(--accent-primary,#D4AF37)] font-medium">
                      {stage.conversionOverall.toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-[var(--text-secondary,#777)] block">overall</span>
                  </div>
                </div>
              </div>

              {/* Funnel Progress Width Bar */}
              <div className="h-2 w-full bg-[var(--bg-secondary,#181818)] rounded-[1px] overflow-hidden">
                <div
                  className="h-full rounded-[1px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: isLast ? "#10B981" : isFirst ? "#A38A61" : "#C5A880",
                  }}
                />
              </div>
            </div>

            {/* Dropoff connector badge */}
            {!isLast && (
              <div className="flex items-center justify-center my-1.5 gap-2 text-[10px] text-[var(--text-muted,#777)]">
                <ArrowDown size={11} className="text-[#A38A61]" />
                <span>
                  Stage Conversion: <strong className="text-emerald-400 font-mono">{stage.conversionFromPrev.toFixed(1)}%</strong>
                </span>
                {typeof stage.dropoffRate === "number" && (
                  <span className="text-rose-400/80 font-mono">
                    (Drop-off: {stage.dropoffRate.toFixed(1)}%)
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
