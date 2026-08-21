"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MetricCard, SectionCard, TabSkeletonLoader, ErrorState, EmptyState } from "./CommonComponents";
import SvgFunnelChart, { FunnelStageData } from "./charts/SvgFunnelChart";
import { DateRangeSelection } from "./DateRangePicker";
import { Filter, ArrowRight, Eye, ShoppingCart, CreditCard, CheckCircle2 } from "lucide-react";

interface FunnelTabProps {
  dateRange: DateRangeSelection;
}

export default function FunnelTab({ dateRange }: FunnelTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunnel = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: dateRange.period,
        compare: dateRange.compare ? "true" : "false",
      });
      if (dateRange.startDate) params.set("start", dateRange.startDate);
      if (dateRange.endDate) params.set("end", dateRange.endDate);

      const res = await fetch(`/api/analytics/funnel?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load funnel analytics (HTTP ${res.status})`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err.message || "Error fetching conversion funnel");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchFunnel();
  }, [fetchFunnel]);

  if (loading) return <TabSkeletonLoader cards={3} />;
  if (error) return <ErrorState message={error} onRetry={fetchFunnel} />;
  if (!data) return <EmptyState />;

  const stages: FunnelStageData[] = (data.stages || []).map((s: any) => ({
    stage: s.stage,
    label: s.label || s.stage,
    count: Number(s.count || 0),
    conversionFromPrev: Number(s.conversionFromPrev || s.stage_conversion_rate || 0),
    conversionOverall: Number(s.conversionOverall || s.overall_conversion_rate || 0),
    dropoffRate: typeof s.dropoffRate === "number" ? s.dropoffRate : undefined,
  }));

  const totalSessions = Number(data.totalSessions || (stages[0]?.count ?? 0));
  const overallConversion = Number(data.overallConversionRate || (stages[stages.length - 1]?.conversionOverall ?? 0));
  const purchasesCount = Number(stages[stages.length - 1]?.count ?? 0);

  return (
    <div className="space-y-8">
      {/* 1. Funnel High-Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Top of Funnel (Views)"
          value={totalSessions.toLocaleString()}
          subValue="Total product discovery sessions"
          icon={<Eye size={15} />}
        />
        <MetricCard
          label="Purchases Completed"
          value={purchasesCount.toLocaleString()}
          subValue="Verified orders created"
          icon={<CheckCircle2 size={15} />}
        />
        <MetricCard
          label="End-to-End Conversion"
          value={`${overallConversion.toFixed(2)}%`}
          subValue="Product View → Purchase Complete"
          icon={<Filter size={15} />}
        />
      </div>

      {/* 2. Strict Sequential 6-Stage Visual Funnel */}
      <SectionCard
        title="Strict Sequential Conversion Pipeline"
        subtitle="Step-by-step visitor progression through the purchase journey"
        badge="WordPress Analytics Pipeline"
      >
        <SvgFunnelChart stages={stages} />
      </SectionCard>

      {/* 3. Stage Diagnostics Table */}
      <SectionCard
        title="Stage Progression Diagnostics"
        subtitle="Granular breakdown of drop-off and conversion efficiencies"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-light">
            <thead>
              <tr className="border-b border-[var(--border-secondary,#333)] text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted,#888)]">
                <th className="pb-3 font-medium">Stage</th>
                <th className="pb-3 font-medium text-right">Sessions</th>
                <th className="pb-3 font-medium text-right">Stage Conversion</th>
                <th className="pb-3 font-medium text-right">Drop-off</th>
                <th className="pb-3 font-medium text-right">Overall Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary,#222)] font-mono">
              {stages.map((stage, idx) => (
                <tr key={stage.stage} className="hover:bg-[var(--bg-tertiary,#181818)] transition-colors">
                  <td className="py-3 font-sans text-xs text-[var(--text-primary,#FAF9F5)]">
                    <span className="text-[var(--text-muted,#777)] mr-2 font-mono">{idx + 1}.</span>
                    {stage.label}
                  </td>
                  <td className="py-3 text-right text-[var(--text-primary,#FAF9F5)]">
                    {stage.count.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-emerald-400">
                    {idx === 0 ? "100.0%" : `${stage.conversionFromPrev.toFixed(1)}%`}
                  </td>
                  <td className="py-3 text-right text-rose-400/80">
                    {idx === 0 ? "—" : typeof stage.dropoffRate === "number" ? `${stage.dropoffRate.toFixed(1)}%` : `${(100 - stage.conversionFromPrev).toFixed(1)}%`}
                  </td>
                  <td className="py-3 text-right text-[#D4AF37] font-medium">
                    {stage.conversionOverall.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
