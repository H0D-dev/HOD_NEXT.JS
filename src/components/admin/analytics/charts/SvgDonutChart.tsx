"use client";

import React from "react";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface SvgDonutChartProps {
  segments: DonutSegment[];
  totalLabel?: string;
  size?: number;
  strokeWidth?: number;
  emptyMessage?: string;
}

export default function SvgDonutChart({
  segments = [],
  totalLabel = "Total",
  size = 180,
  strokeWidth = 24,
  emptyMessage = "No breakdown available.",
}: SvgDonutChartProps) {
  const totalValue = segments.reduce((sum, s) => sum + s.value, 0);

  if (!segments.length || totalValue === 0) {
    return (
      <div className="flex items-center justify-center h-40 border border-dashed border-[var(--border-secondary,#262626)] text-xs text-[var(--text-muted,#777)] uppercase tracking-wider font-light">
        {emptyMessage}
      </div>
    );
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const segmentPaths = segments.map((seg) => {
    const percent = seg.value / totalValue;
    const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
    const strokeDashoffset = -circumference * accumulatedPercent;
    accumulatedPercent += percent;

    return {
      ...seg,
      percent: percent * 100,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {/* SVG Radial */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1a1a1a"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {segmentPaths.map((seg, idx) => (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
          ))}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted,#888)] font-light">
            {totalLabel}
          </span>
          <span className="text-sm md:text-base font-semibold font-mono text-[var(--text-primary,#FAF9F5)]">
            {totalValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        {segmentPaths.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-[var(--text-primary,#FAF9F5)] truncate text-[11px] font-light">
                {seg.label}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-[11px] text-[var(--text-secondary,#aaa)] font-medium">
                {seg.percent.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
