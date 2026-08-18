"use client";

import React from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Inbox, RefreshCw } from "lucide-react";

// ── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  change?: number | null; // percentage change vs comparison period
  changeLabel?: string;
  loading?: boolean;
  prefix?: string;
  suffix?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  subValue,
  change,
  changeLabel = "vs prev period",
  loading = false,
  prefix = "",
  suffix = "",
  badge,
  icon,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="p-5 border border-[var(--border-secondary,#262626)] bg-[var(--bg-secondary,#141414)] rounded-[2px] animate-pulse">
        <div className="h-3 w-24 bg-[var(--border-secondary,#333)] mb-4 rounded-[1px]"></div>
        <div className="h-7 w-36 bg-[var(--border-secondary,#333)] mb-2 rounded-[1px]"></div>
        <div className="h-3 w-20 bg-[var(--border-secondary,#333)] rounded-[1px]"></div>
      </div>
    );
  }

  const isPositive = typeof change === "number" && change > 0;
  const isNegative = typeof change === "number" && change < 0;

  return (
    <div className="group relative p-5 border border-[var(--border-secondary,#262626)] bg-[var(--bg-secondary,#141414)] rounded-[2px] transition-all duration-300 hover:border-[var(--accent-primary,#A38A61)]/60 overflow-hidden">
      {/* Top progress line hover accent */}
      <div className="absolute top-0 left-0 h-[2px] bg-[var(--accent-primary,#A38A61)] w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary,#888)] font-medium truncate">
          {label}
        </span>
        {badge && (
          <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] font-semibold bg-[#A38A61]/15 text-[#D4AF37] border border-[#A38A61]/30 rounded-[1px]">
            {badge}
          </span>
        )}
        {icon && <div className="text-[var(--text-secondary,#888)]">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        {prefix && <span className="text-sm font-light text-[var(--text-secondary,#888)]">{prefix}</span>}
        <span className="font-sans text-2xl lg:text-3xl font-light text-[var(--text-primary,#FAF9F5)] tracking-tight">
          {value}
        </span>
        {suffix && <span className="text-xs font-light text-[var(--text-secondary,#888)]">{suffix}</span>}
      </div>

      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[var(--border-secondary,#222)]/60 text-[11px]">
        {typeof change === "number" ? (
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex items-center font-medium ${
                isPositive ? "text-emerald-400" : isNegative ? "text-rose-400" : "text-[var(--text-muted,#777)]"
              }`}
            >
              {isPositive && <ArrowUpRight size={13} className="inline" />}
              {isNegative && <ArrowDownRight size={13} className="inline" />}
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[var(--text-secondary,#777)] font-light">{changeLabel}</span>
          </div>
        ) : subValue ? (
          <span className="text-[10px] text-[var(--text-secondary,#777)] font-light truncate">{subValue}</span>
        ) : (
          <span className="text-[10px] text-[var(--text-secondary,#555)] font-light">—</span>
        )}
      </div>
    </div>
  );
}

// ── Tab Skeleton Loader ─────────────────────────────────────────────────────

export function TabSkeletonLoader({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-8 animate-pulse">
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cards} gap-4`}>
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="p-5 border border-[var(--border-secondary,#262626)] bg-[var(--bg-secondary,#141414)] rounded-[2px]">
            <div className="h-3 w-20 bg-[var(--border-secondary,#333)] mb-3 rounded-[1px]"></div>
            <div className="h-8 w-32 bg-[var(--border-secondary,#333)] mb-2 rounded-[1px]"></div>
            <div className="h-3 w-16 bg-[var(--border-secondary,#333)] rounded-[1px]"></div>
          </div>
        ))}
      </div>
      <div className="p-6 border border-[var(--border-secondary,#262626)] bg-[var(--bg-secondary,#141414)] h-72 rounded-[2px]">
        <div className="h-4 w-32 bg-[var(--border-secondary,#333)] mb-4 rounded-[1px]"></div>
        <div className="h-48 w-full bg-[var(--border-secondary,#222)] rounded-[1px]"></div>
      </div>
    </div>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────

export function EmptyState({
  title = "No data for this period",
  message = "Try selecting a broader date range or adjusting filters.",
  onReset,
}: {
  title?: string;
  message?: string;
  onReset?: () => void;
}) {
  return (
    <div className="p-12 text-center border border-[var(--border-secondary,#262626)] bg-[var(--bg-secondary,#141414)] rounded-[2px] flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full border border-[var(--border-secondary,#333)] flex items-center justify-center text-[var(--text-muted,#777)] mb-4">
        <Inbox size={22} strokeWidth={1.2} />
      </div>
      <h3 className="font-sans text-sm md:text-base font-light text-[var(--text-primary,#FAF9F5)] uppercase tracking-wider mb-1">
        {title}
      </h3>
      <p className="font-sans text-xs text-[var(--text-secondary,#888)] max-w-sm font-light leading-relaxed mb-5">
        {message}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-medium border border-[var(--border-secondary,#333)] text-[var(--text-primary,#FAF9F5)] hover:border-[var(--accent-primary,#A38A61)] transition-colors"
        >
          Reset Date Range
        </button>
      )}
    </div>
  );
}

// ── Error State ─────────────────────────────────────────────────────────────

export function ErrorState({
  title = "Unable to load analytics data",
  message = "A network or server error occurred while querying the analytics service.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-8 border border-rose-900/40 bg-rose-950/10 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 border border-rose-500/30 bg-rose-500/10 text-rose-400 rounded-[1px] mt-0.5">
          <AlertTriangle size={18} strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="font-sans text-sm font-medium text-rose-200">{title}</h4>
          <p className="font-sans text-xs text-rose-300/80 font-light mt-0.5 max-w-xl leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-semibold border border-rose-500/40 text-rose-200 hover:bg-rose-900/20 transition-colors shrink-0"
        >
          <RefreshCw size={12} />
          Retry Query
        </button>
      )}
    </div>
  );
}

// ── Section Card Shell ──────────────────────────────────────────────────────

export function SectionCard({
  title,
  subtitle,
  badge,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-[var(--border-secondary,#262626)] bg-[var(--bg-secondary,#141414)] rounded-[2px] overflow-hidden ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-[var(--border-secondary,#222)] gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-sans text-xs md:text-sm font-medium uppercase tracking-[0.16em] text-[var(--text-primary,#FAF9F5)]">
              {title}
            </h3>
            {badge && (
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] font-medium bg-[#A38A61]/15 text-[#D4AF37] border border-[#A38A61]/30 rounded-[1px]">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="font-sans text-[11px] text-[var(--text-secondary,#888)] font-light mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
