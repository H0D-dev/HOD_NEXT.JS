"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MetricCard, SectionCard, TabSkeletonLoader, ErrorState, EmptyState } from "./CommonComponents";
import { DateRangeSelection } from "./DateRangePicker";
import { Share2, Globe, Link2, DollarSign } from "lucide-react";

interface AttributionTabProps {
  dateRange: DateRangeSelection;
}

export default function AttributionTab({ dateRange }: AttributionTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttribution = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: dateRange.period,
        compare: dateRange.compare ? "true" : "false",
      });
      if (dateRange.startDate) params.set("start", dateRange.startDate);
      if (dateRange.endDate) params.set("end", dateRange.endDate);

      const res = await fetch(`/api/analytics/attribution?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load attribution metrics (HTTP ${res.status})`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err.message || "Error fetching attribution data");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAttribution();
  }, [fetchAttribution]);

  if (loading) return <TabSkeletonLoader cards={3} />;
  if (error) return <ErrorState message={error} onRetry={fetchAttribution} />;
  if (!data) return <EmptyState />;

  const utmSources = data.utmSources || data.sources || [];
  const utmCampaigns = data.utmCampaigns || data.campaigns || [];
  const referrers = data.referrers || [];

  return (
    <div className="space-y-8">
      {/* Attribution Model Notice */}
      <div className="p-4 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#141414)] rounded-[1px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent-primary,#D4AF37)] font-semibold block">
            Attribution Engine: First-Touch UTM Session Linkage
          </span>
          <p className="text-[11px] text-[var(--text-secondary,#888)] font-light mt-0.5">
            Initial campaign parameters are captured at session start and preserved across customer shopping journeys.
          </p>
        </div>
        <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-[var(--bg-secondary,#1e1e1e)] border border-[var(--border-secondary,#333)] text-[var(--text-muted,#888)] font-mono shrink-0">
          Model: First-Touch
        </span>
      </div>

      {/* 1. UTM Sources Table */}
      <SectionCard
        title="Acquisition Sources (UTM Source)"
        subtitle="Inbound traffic channels and downstream conversion"
      >
        {utmSources.length === 0 ? (
          <p className="text-xs text-[var(--text-muted,#777)] font-light py-6 text-center">
            No UTM source attribution recorded for this date range.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="border-b border-[var(--border-secondary,#333)] text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted,#888)]">
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium text-right">Sessions</th>
                  <th className="pb-3 font-medium text-right">Product Views</th>
                  <th className="pb-3 font-medium text-right">Cart Adds</th>
                  <th className="pb-3 font-medium text-right">Purchases</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-secondary,#222)] font-mono">
                {utmSources.map((s: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[var(--bg-tertiary,#181818)] transition-colors">
                    <td className="py-3 font-sans text-[var(--text-primary,#FAF9F5)] font-medium">
                      {s.source || s.utm_source || "Direct / Organic"}
                    </td>
                    <td className="py-3 text-right text-[var(--text-primary,#FAF9F5)]">
                      {(s.sessions || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-[var(--text-secondary,#aaa)]">
                      {(s.productViews || s.views || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-[var(--text-secondary,#aaa)]">
                      {(s.addToCart || s.cartAdds || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-emerald-400 font-medium">
                      {(s.purchases || s.orders || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-[#D4AF37] font-medium">
                      AED {Number(s.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* 2. UTM Campaigns */}
      <SectionCard
        title="Marketing Campaigns (UTM Campaign)"
        subtitle="Campaign performance and conversion volume"
      >
        {utmCampaigns.length === 0 ? (
          <p className="text-xs text-[var(--text-muted,#777)] font-light py-6 text-center">
            No named marketing campaigns active for this date range.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="border-b border-[var(--border-secondary,#333)] text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted,#888)]">
                  <th className="pb-3 font-medium">Campaign</th>
                  <th className="pb-3 font-medium text-right">Sessions</th>
                  <th className="pb-3 font-medium text-right">Orders</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-secondary,#222)] font-mono">
                {utmCampaigns.map((c: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[var(--bg-tertiary,#181818)] transition-colors">
                    <td className="py-3 font-sans text-[var(--text-primary,#FAF9F5)]">
                      {c.campaign || c.utm_campaign}
                    </td>
                    <td className="py-3 text-right text-[var(--text-primary,#FAF9F5)]">
                      {(c.sessions || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-emerald-400">
                      {(c.purchases || c.orders || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-[#D4AF37]">
                      AED {Number(c.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
