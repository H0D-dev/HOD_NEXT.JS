"use client";

import React, { useState } from "react";
import { TrafficChannelMetric, ReferrerMetric } from "@/src/lib/analytics/types";
import { Share2, Link2, DollarSign, Compass, Search, Globe, MessageCircle } from "lucide-react";

interface SourcesBarChartProps {
  channels: TrafficChannelMetric[];
  referrers: ReferrerMetric[];
  maxItems?: number;
}

export default function SourcesBarChart({
  channels = [],
  referrers = [],
  maxItems = 8,
}: SourcesBarChartProps) {
  const [viewMode, setViewMode] = useState<"channels" | "referrers">("channels");

  const isChannels = viewMode === "channels";
  const rawList = isChannels ? channels : referrers;
  const displayItems = rawList.slice(0, maxItems);
  const maxSessions = Math.max(1, ...displayItems.map((item) => item.sessions || 0));

  function getChannelBadge(channel: string) {
    const ch = channel.toLowerCase();
    if (ch.includes("search")) {
      return {
        label: channel,
        className: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        icon: <Search size={11} className="text-sky-400" />,
      };
    }
    if (ch.includes("social")) {
      return {
        label: channel,
        className: "bg-pink-500/10 text-pink-400 border-pink-500/20",
        icon: <Share2 size={11} className="text-pink-400" />,
      };
    }
    if (ch.includes("direct")) {
      return {
        label: channel,
        className: "bg-[#A38A61]/15 text-[#D4AF37] border-[#A38A61]/30",
        icon: <Compass size={11} className="text-[#D4AF37]" />,
      };
    }
    if (ch.includes("paid")) {
      return {
        label: channel,
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        icon: <DollarSign size={11} className="text-emerald-400" />,
      };
    }
    return {
      label: channel,
      className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: <Globe size={11} className="text-purple-400" />,
    };
  }

  return (
    <div className="space-y-4">
      {/* Sub-header Toolbar with View Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-secondary,#262626)]">
        <div className="flex items-center gap-2">
          {isChannels ? (
            <Share2 size={14} className="text-[var(--accent-primary,#D4AF37)]" />
          ) : (
            <Link2 size={14} className="text-[var(--accent-primary,#D4AF37)]" />
          )}
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary,#aaa)] font-medium">
            {isChannels ? "Acquisition Channels" : "Top Referrer Domains"}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-0.5 bg-[var(--bg-tertiary,#141414)] border border-[var(--border-secondary,#2b2b2b)] rounded-[2px]">
          <button
            type="button"
            onClick={() => setViewMode("channels")}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-medium rounded-[1px] transition-colors ${
              isChannels
                ? "bg-[#A38A61]/20 text-[#D4AF37] border border-[#A38A61]/30 font-semibold"
                : "text-[var(--text-muted,#777)] hover:text-white"
            }`}
          >
            Channels ({channels.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode("referrers")}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-medium rounded-[1px] transition-colors ${
              !isChannels
                ? "bg-[#A38A61]/20 text-[#D4AF37] border border-[#A38A61]/30 font-semibold"
                : "text-[var(--text-muted,#777)] hover:text-white"
            }`}
          >
            Referrers ({referrers.length})
          </button>
        </div>
      </div>

      {displayItems.length === 0 ? (
        <div className="flex items-center justify-center h-44 border border-dashed border-[var(--border-secondary,#262626)] text-xs text-[var(--text-muted,#777)] uppercase tracking-wider font-light">
          No traffic source data available for this timeframe.
        </div>
      ) : (
        <div className="space-y-3">
          {displayItems.map((item: any, idx) => {
            const sessions = item.sessions || 0;
            const revenue = Number(item.revenue || 0);
            const purchases = item.purchases || 0;
            const label = isChannels ? item.channel : item.domain || item.referrer;
            const channelName = isChannels ? item.channel : item.channel || "Referral";
            const badge = getChannelBadge(channelName);
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
                    <span className="p-1 rounded-[2px] bg-[var(--bg-primary,#111)] border border-[var(--border-secondary,#282828)] shrink-0">
                      {badge.icon}
                    </span>
                    <span className="font-sans text-xs text-[var(--text-primary,#FAF9F5)] font-medium truncate">
                      {label}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-[0.14em] font-mono px-1.5 py-0.2 border rounded-[1px] ${badge.className}`}
                    >
                      {channelName}
                    </span>
                  </div>

                  {/* Metrics & Share */}
                  <div className="flex items-center gap-4 shrink-0 text-right font-mono">
                    {/* Commerce Attribution */}
                    {revenue > 0 && (
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[11px] text-[#D4AF37] font-medium">
                          AED {revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted,#777)]">
                          {purchases} {purchases === 1 ? "order" : "orders"}
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
                    className="h-full bg-gradient-to-r from-sky-500/80 via-[#A38A61] to-[#D4AF37] rounded-[1px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-110"
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
