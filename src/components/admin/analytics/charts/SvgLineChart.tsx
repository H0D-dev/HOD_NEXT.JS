"use client";

import React, { useState, useMemo, useRef } from "react";

export interface LineChartPoint {
  date: string;
  label?: string;
  value: number;
  compareValue?: number;
}

interface SvgLineChartProps {
  data: LineChartPoint[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  primaryLabel?: string;
  compareLabel?: string;
  strokeColor?: string;
  compareStrokeColor?: string;
  showArea?: boolean;
  emptyMessage?: string;
}

export default function SvgLineChart({
  data = [],
  height = 240,
  valuePrefix = "",
  valueSuffix = "",
  primaryLabel = "Current Period",
  compareLabel = "Previous Period",
  strokeColor = "#A38A61",
  compareStrokeColor = "#666666",
  showArea = true,
  emptyMessage = "No trend data available for this range.",
}: SvgLineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasData = data && data.length > 0;
  const hasCompare = hasData && data.some((d) => typeof d.compareValue === "number");

  const { minVal, maxVal, points, comparePoints, viewBoxWidth, viewBoxHeight, padding } = useMemo(() => {
    if (!hasData) {
      return { minVal: 0, maxVal: 100, points: [], comparePoints: [], viewBoxWidth: 800, viewBoxHeight: height, padding: { top: 20, right: 20, bottom: 30, left: 50 } };
    }

    const pad = { top: 20, right: 20, bottom: 30, left: 55 };
    const vbWidth = 800;
    const vbHeight = height;
    const chartWidth = vbWidth - pad.left - pad.right;
    const chartHeight = vbHeight - pad.top - pad.bottom;

    const allValues = data.flatMap((d) => [d.value, ...(typeof d.compareValue === "number" ? [d.compareValue] : [])]);
    const rawMin = Math.min(0, ...allValues);
    const rawMax = Math.max(10, ...allValues);
    const maxValWithPadding = rawMax * 1.15;

    const stepX = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

    const computeY = (val: number) => {
      const normalized = (val - rawMin) / (maxValWithPadding - rawMin || 1);
      return pad.top + chartHeight - normalized * chartHeight;
    };

    const pts = data.map((d, i) => ({
      x: pad.left + i * stepX,
      y: computeY(d.value),
      d,
    }));

    const cPts = data.map((d, i) => ({
      x: pad.left + i * stepX,
      y: typeof d.compareValue === "number" ? computeY(d.compareValue) : computeY(0),
      d,
    }));

    return {
      minVal: rawMin,
      maxVal: maxValWithPadding,
      points: pts,
      comparePoints: cPts,
      viewBoxWidth: vbWidth,
      viewBoxHeight: vbHeight,
      padding: pad,
    };
  }, [data, height, hasData]);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 border border-dashed border-[var(--border-secondary,#262626)] text-xs text-[var(--text-muted,#777)] uppercase tracking-wider font-light">
        {emptyMessage}
      </div>
    );
  }

  // Generate SVG path strings
  const primaryLinePath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, "");
  const primaryAreaPath =
    showArea && points.length > 1
      ? `${primaryLinePath} L ${points[points.length - 1].x} ${viewBoxHeight - padding.bottom} L ${points[0].x} ${viewBoxHeight - padding.bottom} Z`
      : "";

  const compareLinePath = hasCompare
    ? comparePoints.reduce((acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, "")
    : "";

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3 text-[11px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: strokeColor }} />
            <span className="text-[var(--text-secondary,#aaa)]">{primaryLabel}</span>
          </div>
          {hasCompare && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed inline-block" style={{ borderColor: compareStrokeColor }} />
              <span className="text-[var(--text-muted,#777)]">{compareLabel}</span>
            </div>
          )}
        </div>
        {activePoint && (
          <div className="flex items-center gap-3 text-xs bg-[var(--bg-tertiary,#1f1f1f)] px-3 py-1 border border-[var(--border-secondary,#333)] rounded-[2px]">
            <span className="font-light text-[var(--text-muted,#888)]">{activePoint.d.date}</span>
            <span className="font-medium text-[var(--text-primary,#FAF9F5)]">
              {valuePrefix}
              {activePoint.d.value.toLocaleString()}
              {valueSuffix}
            </span>
            {typeof activePoint.d.compareValue === "number" && (
              <span className="text-[var(--text-secondary,#777)] text-[10px]">
                (prev: {valuePrefix}
                {activePoint.d.compareValue.toLocaleString()}
                {valueSuffix})
              </span>
            )}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = padding.top + (viewBoxHeight - padding.top - padding.bottom) * (1 - pct);
            const labelVal = minVal + pct * (maxVal - minVal);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={viewBoxWidth - padding.right}
                  y2={y}
                  stroke="#262626"
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#737373"
                  fontFamily="sans-serif"
                >
                  {valuePrefix}
                  {labelVal >= 1000 ? `${(labelVal / 1000).toFixed(1)}k` : labelVal.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {primaryAreaPath && <path d={primaryAreaPath} fill="url(#primaryAreaGrad)" />}

          {/* Previous Period Line */}
          {compareLinePath && (
            <path
              d={compareLinePath}
              fill="none"
              stroke={compareStrokeColor}
              strokeWidth="1.25"
              strokeDasharray="4 4"
            />
          )}

          {/* Primary Trend Line */}
          <path
            d={primaryLinePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover Crosshair and Markers */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={viewBoxHeight - padding.bottom}
                stroke="#A38A61"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.7"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                fill="#FAF9F5"
                stroke={strokeColor}
                strokeWidth="2"
              />
            </g>
          )}

          {/* Interactive Mouse Hover Columns */}
          {points.map((p, i) => {
            const stepW = viewBoxWidth / points.length;
            return (
              <rect
                key={i}
                x={p.x - stepW / 2}
                y={padding.top}
                width={stepW}
                height={viewBoxHeight - padding.top - padding.bottom}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}

          {/* X Axis Labels */}
          {points.map((p, i) => {
            // Show every Nth label to avoid overlapping
            const total = points.length;
            const step = total > 15 ? Math.ceil(total / 7) : total > 7 ? 2 : 1;
            if (i % step !== 0 && i !== total - 1) return null;

            return (
              <text
                key={i}
                x={p.x}
                y={viewBoxHeight - 8}
                textAnchor="middle"
                fontSize="9"
                fill="#8C857E"
                fontFamily="sans-serif"
              >
                {p.d.label || p.d.date}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
