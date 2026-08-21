"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MetricCard, SectionCard, TabSkeletonLoader, ErrorState, EmptyState } from "./CommonComponents";
import SvgLineChart, { LineChartPoint } from "./charts/SvgLineChart";
import SvgFunnelChart from "./charts/SvgFunnelChart";
import SvgBarChart from "./charts/SvgBarChart";
import ExternalLinksCard from "./ExternalLinksCard";
import { DateRangeSelection } from "./DateRangePicker";
import { Sparkles, Eye, TrendingUp, ShoppingBag, DollarSign, Globe, Share2 } from "lucide-react";

interface OverviewTabProps {
  dateRange: DateRangeSelection;
  onNavigateTab?: (tab: string) => void;
}

export default function OverviewTab({ dateRange, onNavigateTab }: OverviewTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: dateRange.period,
        compare: dateRange.compare ? "true" : "false",
      });
      if (dateRange.startDate) params.set("start", dateRange.startDate);
      if (dateRange.endDate) params.set("end", dateRange.endDate);

      const res = await fetch(`/api/analytics/overview?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Authentication or permission error.");
        }
        throw new Error(`Failed to load overview (HTTP ${res.status})`);
      }
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err.message || "Network error loading analytics overview");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (loading) return <TabSkeletonLoader cards={4} />;
  if (error) return <ErrorState message={error} onRetry={fetchOverview} />;
  if (!data) return <EmptyState />;

  const summary = data.summary || {};
  const revenueTrend: LineChartPoint[] = (data.revenueTrend || []).map((t: any) => ({
    date: t.date || t.label,
    label: t.label || t.date,
    value: Number(t.revenue || t.value || 0),
    compareValue: typeof t.compareRevenue === "number" ? t.compareRevenue : undefined,
  }));

  const funnelStages = (data.funnelSnapshot || []).map((s: any) => ({
    stage: s.stage,
    label: s.label || s.stage,
    count: Number(s.count || 0),
    conversionFromPrev: Number(s.conversionFromPrev || s.stage_conversion_rate || 0),
    conversionOverall: Number(s.conversionOverall || s.overall_conversion_rate || 0),
    dropoffRate: typeof s.dropoffRate === "number" ? s.dropoffRate : undefined,
  }));

  const topProducts = (data.topProducts || []).map((p: any) => ({
    label: p.name || p.title || `Product #${p.id}`,
    value: Number(p.totalRevenue || p.revenue || p.sales || 0),
    secondaryValue: `${p.unitsSold || p.quantity || 0} sold`,
  }));

  const visualizerSnapshot = data.visualizerSnapshot || {};

  return (
    <div className="space-y-8">
      {/* 1. Primary Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Net Revenue"
          value={`AED ${(summary.netRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={summary.revenueChange}
          subValue={summary.grossRevenue ? `AED ${(summary.grossRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gross` : undefined}
          icon={<DollarSign size={16} />}
        />
        <MetricCard
          label="Orders"
          value={(summary.totalOrders || 0).toLocaleString()}
          change={summary.ordersChange}
          subValue={`${summary.refundsCount || 0} refunds`}
          icon={<ShoppingBag size={16} />}
        />
        <MetricCard
          label="Average Order Value"
          value={`AED ${(summary.averageOrderValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={summary.aovChange}
          icon={<TrendingUp size={16} />}
        />
        <MetricCard
          label="Conversion Rate"
          value={`${(summary.conversionRate || 0).toFixed(2)}%`}
          change={summary.conversionRateChange}
          subValue={`${(summary.sessionsCount || 0).toLocaleString()} sessions`}
          icon={<Eye size={16} />}
        />
      </div>

      {/* 2. Revenue Trend Over Time */}
      <SectionCard
        title="Revenue Trend"
        subtitle="WooCommerce confirmed sales over selected timeframe"
        action={
          onNavigateTab && (
            <button
              onClick={() => onNavigateTab("sales")}
              className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent-primary,#D4AF37)] hover:underline font-medium"
            >
              Detailed Sales →
            </button>
          )
        }
      >
        <SvgLineChart
          data={revenueTrend}
          valuePrefix="AED "
          primaryLabel="Net Revenue"
          compareLabel="Previous Period"
        />
      </SectionCard>

      {/* 3. Funnel & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sequential Conversion Funnel Snapshot */}
        <div className="lg:col-span-7">
          <SectionCard
            title="Conversion Funnel"
            subtitle="Sequential stage progression & session volume"
            action={
              onNavigateTab && (
                <button
                  onClick={() => onNavigateTab("funnel")}
                  className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent-primary,#D4AF37)] hover:underline font-medium"
                >
                  Full Funnel →
                </button>
              )
            }
          >
            <SvgFunnelChart stages={funnelStages} />
          </SectionCard>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-5">
          <SectionCard
            title="Top Products by Revenue"
            subtitle="Best selling catalog pieces"
            action={
              onNavigateTab && (
                <button
                  onClick={() => onNavigateTab("products")}
                  className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent-primary,#D4AF37)] hover:underline font-medium"
                >
                  All Products →
                </button>
              )
            }
          >
            <SvgBarChart items={topProducts} valuePrefix="AED " maxItems={5} />
          </SectionCard>
        </div>
      </div>

      {/* 4. Room Visualizer Snapshot */}
      <SectionCard
        title="Room Visualizer Impact"
        subtitle="Customer interaction with AR canvas & custom room staging"
        badge="Engagement Intelligence"
        action={
          onNavigateTab && (
            <button
              onClick={() => onNavigateTab("visualizer")}
              className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent-primary,#D4AF37)] hover:underline font-medium"
            >
              Visualizer Metrics →
            </button>
          )
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#1a1a1a)] rounded-[1px]">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary,#888)] font-light">
              Visualizer Sessions
            </span>
            <div className="text-xl font-mono font-semibold text-[var(--text-primary,#FAF9F5)] mt-1">
              {(visualizerSnapshot.totalSessions || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#1a1a1a)] rounded-[1px]">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary,#888)] font-light">
              Products Loaded
            </span>
            <div className="text-xl font-mono font-semibold text-[var(--text-primary,#FAF9F5)] mt-1">
              {(visualizerSnapshot.productsLoaded || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#1a1a1a)] rounded-[1px]">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary,#888)] font-light">
              Room Uploads
            </span>
            <div className="text-xl font-mono font-semibold text-[var(--text-primary,#FAF9F5)] mt-1">
              {(visualizerSnapshot.customUploads || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#1a1a1a)] rounded-[1px]">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary,#888)] font-light">
              Visualizer Add-to-Cart
            </span>
            <div className="text-xl font-mono font-semibold text-[var(--accent-primary,#D4AF37)] mt-1">
              {(visualizerSnapshot.visualizerAddToCartCount || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 5. Geography & Traffic Inbound Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Markets */}
        <div className="lg:col-span-6">
          <SectionCard
            title="Top Regional Markets"
            subtitle="Customer origin & revenue distribution"
            badge="Geography"
            action={
              onNavigateTab && (
                <button
                  onClick={() => onNavigateTab("attribution")}
                  className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent-primary,#D4AF37)] hover:underline font-medium"
                >
                  Full Geo Breakdown →
                </button>
              )
            }
          >
            <div className="space-y-3">
              {(data.topCountriesSnapshot || []).length === 0 ? (
                <div className="flex items-center justify-center h-28 border border-dashed border-[var(--border-secondary,#262626)] text-xs text-[var(--text-muted,#777)] uppercase tracking-wider font-light">
                  No regional orders recorded for this timeframe.
                </div>
              ) : (
                (data.topCountriesSnapshot || []).slice(0, 4).map((c: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-[var(--bg-tertiary,#171717)] border border-[var(--border-secondary,#262626)] rounded-[1px]"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base leading-none select-none">{c.flag || "🌐"}</span>
                      <span className="text-xs font-sans font-medium text-[var(--text-primary,#FAF9F5)] truncate">
                        {c.country}
                      </span>
                      <span className="text-[9px] font-mono px-1 bg-[var(--bg-secondary,#222)] text-[var(--text-muted,#888)] rounded-[1px]">
                        {c.code}
                      </span>
                    </div>
                    <div className="text-right font-mono shrink-0">
                      <span className="text-xs text-[#D4AF37] font-medium block">
                        AED {Number(c.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-[9px] text-[var(--text-muted,#777)]">
                        {c.orders || 0} {c.orders === 1 ? "order" : "orders"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>

        {/* Traffic Channels */}
        <div className="lg:col-span-6">
          <SectionCard
            title="Inbound Traffic Channels"
            subtitle="Referral and search acquisition mix"
            badge="Channels"
            action={
              onNavigateTab && (
                <button
                  onClick={() => onNavigateTab("attribution")}
                  className="text-[10px] uppercase tracking-[0.14em] text-[var(--accent-primary,#D4AF37)] hover:underline font-medium"
                >
                  Attribution Hub →
                </button>
              )
            }
          >
            <div className="space-y-3">
              {(data.topSourcesSnapshot || []).length === 0 ? (
                <div className="flex items-center justify-center h-28 border border-dashed border-[var(--border-secondary,#262626)] text-xs text-[var(--text-muted,#777)] uppercase tracking-wider font-light">
                  No traffic channel telemetry recorded for this timeframe.
                </div>
              ) : (
                (data.topSourcesSnapshot || []).slice(0, 4).map((s: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-[var(--bg-tertiary,#171717)] border border-[var(--border-secondary,#262626)] rounded-[1px]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Share2 size={13} className="text-[var(--accent-primary,#D4AF37)] shrink-0" />
                      <span className="text-xs font-sans font-medium text-[var(--text-primary,#FAF9F5)] truncate">
                        {s.source}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[var(--bg-secondary,#222)] text-sky-400 border border-sky-500/20 rounded-[1px]">
                        {s.channel}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[var(--text-primary,#FAF9F5)] shrink-0">
                      {s.share}% share
                    </span>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* 6. External Infrastructure Telemetry Links */}
      <ExternalLinksCard />
    </div>
  );
}
