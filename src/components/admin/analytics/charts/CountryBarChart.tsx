"use client";

import React, { useState } from "react";
import { CountryMetric, CityMetric } from "@/src/lib/analytics/types";
import { Globe, MapPin, DollarSign, TrendingUp } from "lucide-react";

interface CountryBarChartProps {
  countries: CountryMetric[];
  cities: CityMetric[];
  maxItems?: number;
}

export default function CountryBarChart({
  countries = [],
  cities = [],
  maxItems = 8,
}: CountryBarChartProps) {
  const [viewMode, setViewMode] = useState<"countries" | "cities">("countries");

  const isCountries = viewMode === "countries";
  const rawList = isCountries ? countries : cities;
  const displayItems = rawList.slice(0, maxItems);
  const maxSessions = Math.max(1, ...displayItems.map((item) => item.sessions || 0));

  return (
    <div className="space-y-4">
      {/* Sub-header Toolbar with View Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-secondary,#262626)]">
        <div className="flex items-center gap-2">
          {isCountries ? (
            <Globe size={14} className="text-[var(--accent-primary,#D4AF37)]" />
          ) : (
            <MapPin size={14} className="text-[var(--accent-primary,#D4AF37)]" />
          )}
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary,#aaa)] font-medium">
            {isCountries ? "Top Countries by Traffic & Revenue" : "Top Cities Breakdown"}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-0.5 bg-[var(--bg-tertiary,#141414)] border border-[var(--border-secondary,#2b2b2b)] rounded-[2px]">
          <button
            type="button"
            onClick={() => setViewMode("countries")}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-medium rounded-[1px] transition-colors ${
              isCountries
                ? "bg-[#A38A61]/20 text-[#D4AF37] border border-[#A38A61]/30 font-semibold"
                : "text-[var(--text-muted,#777)] hover:text-white"
            }`}
          >
            Countries ({countries.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cities")}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-medium rounded-[1px] transition-colors ${
              !isCountries
                ? "bg-[#A38A61]/20 text-[#D4AF37] border border-[#A38A61]/30 font-semibold"
                : "text-[var(--text-muted,#777)] hover:text-white"
            }`}
          >
            Cities ({cities.length})
          </button>
        </div>
      </div>

      {displayItems.length === 0 ? (
        <div className="flex items-center justify-center h-44 border border-dashed border-[var(--border-secondary,#262626)] text-xs text-[var(--text-muted,#777)] uppercase tracking-wider font-light">
          No regional telemetry recorded for this timeframe.
        </div>
      ) : (
        <div className="space-y-3">
          {displayItems.map((item: any, idx) => {
            const sessions = item.sessions || 0;
            const revenue = Number(item.revenue || 0);
            const orders = item.orders || 0;
            const flag = item.flag || "🌐";
            const label = isCountries ? item.country : item.city;
            const subLabel = isCountries ? item.code : `${item.country} (${item.countryCode})`;
            const widthPct = Math.max(3, (sessions / maxSessions) * 100);
            const sharePct = item.sharePercentage || 0;

            return (
              <div
                key={idx}
                className="group relative p-2.5 hover:bg-[var(--bg-tertiary,#171717)] rounded-[2px] transition-colors border border-transparent hover:border-[var(--border-secondary,#262626)]"
              >
                {/* Primary Data Row */}
                <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 truncate">
                    <span className="text-base leading-none select-none shrink-0" title={label}>
                      {flag}
                    </span>
                    <span className="font-sans text-xs text-[var(--text-primary,#FAF9F5)] font-medium truncate">
                      {label}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.14em] font-mono px-1.5 py-0.2 bg-[var(--bg-secondary,#222)] border border-[var(--border-secondary,#333)] text-[var(--text-muted,#888)] rounded-[1px]">
                      {subLabel}
                    </span>
                  </div>

                  {/* Metrics & Share */}
                  <div className="flex items-center gap-4 shrink-0 text-right font-mono">
                    {/* Revenue & Orders */}
                    {revenue > 0 && (
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[11px] text-[#D4AF37] font-medium">
                          AED {revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted,#777)]">
                          {orders} {orders === 1 ? "order" : "orders"}
                        </span>
                      </div>
                    )}

                    {/* Sessions & Share */}
                    <div className="flex flex-col items-end min-w-[70px]">
                      <span className="text-xs text-[var(--text-primary,#FAF9F5)] font-semibold">
                        {sessions.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary,#888)]">
                        {sharePct.toFixed(1)}% share
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vercel-Style Proportional Bar */}
                <div className="h-1.5 w-full bg-[var(--bg-secondary,#202020)] rounded-[1px] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#A38A61] to-[#D4AF37] rounded-[1px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-110"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
