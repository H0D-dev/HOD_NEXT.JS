"use client";

import React from "react";

export interface BarChartItem {
  label: string;
  value: number;
  secondaryValue?: string | number;
  color?: string;
  meta?: string;
}

interface SvgBarChartProps {
  items: BarChartItem[];
  maxItems?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  layout?: "horizontal" | "vertical";
  barColor?: string;
  emptyMessage?: string;
}

export default function SvgBarChart({
  items = [],
  maxItems = 8,
  valuePrefix = "",
  valueSuffix = "",
  layout = "horizontal",
  barColor = "#A38A61",
  emptyMessage = "No ranked data available.",
}: SvgBarChartProps) {
  const displayItems = items.slice(0, maxItems);
  const maxValue = Math.max(1, ...displayItems.map((i) => i.value));

  if (!displayItems.length) {
    return (
      <div className="flex items-center justify-center h-40 border border-dashed border-[var(--border-secondary,#262626)] text-xs text-[var(--text-muted,#777)] uppercase tracking-wider font-light">
        {emptyMessage}
      </div>
    );
  }

  if (layout === "horizontal") {
    return (
      <div className="space-y-3.5">
        {displayItems.map((item, idx) => {
          const pct = Math.max(2, (item.value / maxValue) * 100);
          return (
            <div key={idx} className="group">
              <div className="flex items-baseline justify-between text-xs mb-1 gap-2">
                <span className="font-sans text-[11px] text-[var(--text-primary,#FAF9F5)] truncate font-normal">
                  {item.label}
                </span>
                <div className="flex items-center gap-2 shrink-0 text-right">
                  {item.secondaryValue && (
                    <span className="text-[10px] text-[var(--text-muted,#777)] font-mono">{item.secondaryValue}</span>
                  )}
                  <span className="font-mono text-xs text-[var(--text-primary,#FAF9F5)] font-medium">
                    {valuePrefix}
                    {item.value.toLocaleString()}
                    {valueSuffix}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-[var(--bg-tertiary,#1a1a1a)] rounded-[1px] overflow-hidden">
                <div
                  className="h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-[1px]"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: item.color || barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical Bar Chart
  return (
    <div className="w-full flex items-end justify-between gap-2 h-44 pt-6 pb-2 border-b border-[var(--border-secondary,#262626)]">
      {displayItems.map((item, idx) => {
        const heightPct = Math.max(6, (item.value / maxValue) * 100);
        return (
          <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
            <span className="text-[9px] font-mono text-[var(--text-muted,#777)] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
              {valuePrefix}
              {item.value.toLocaleString()}
            </span>
            <div
              className="w-full max-w-[28px] transition-all duration-500 rounded-t-[1px]"
              style={{
                height: `${heightPct}%`,
                backgroundColor: item.color || barColor,
              }}
            />
            <span className="text-[9px] text-[var(--text-secondary,#888)] truncate w-full text-center mt-2 font-light">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
