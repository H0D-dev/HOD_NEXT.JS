"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MetricCard, SectionCard, TabSkeletonLoader, ErrorState, EmptyState } from "./CommonComponents";
import SvgBarChart, { BarChartItem } from "./charts/SvgBarChart";
import { DateRangeSelection } from "./DateRangePicker";
import { Compass, UploadCloud, Download, ShoppingBag, Eye, DollarSign, Layers } from "lucide-react";

interface VisualizerTabProps {
  dateRange: DateRangeSelection;
}

export default function VisualizerTab({ dateRange }: VisualizerTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisualizer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: dateRange.period,
        compare: dateRange.compare ? "true" : "false",
      });
      if (dateRange.startDate) params.set("start", dateRange.startDate);
      if (dateRange.endDate) params.set("end", dateRange.endDate);

      const res = await fetch(`/api/analytics/visualizer?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load visualizer metrics (HTTP ${res.status})`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err.message || "Error fetching visualizer metrics");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchVisualizer();
  }, [fetchVisualizer]);

  if (loading) return <TabSkeletonLoader cards={4} />;
  if (error) return <ErrorState message={error} onRetry={fetchVisualizer} />;
  if (!data) return <EmptyState />;

  const metrics = data.metrics || data.summary || {};
  const comparison = data.comparison || {
    visualizerUsers: {},
    nonVisualizerUsers: {},
  };

  const vzUsers = comparison.visualizerUsers || {};
  const nonVzUsers = comparison.nonVisualizerUsers || {};

  const topVisualized: BarChartItem[] = (data.topVisualized || []).map((p: any) => ({
    label: p.name || p.title || `Product #${p.productId || p.id}`,
    value: Number(p.visualizerSessions || p.count || p.sessions || 0),
    secondaryValue: `${p.addToCartCount || 0} cart adds`,
  }));

  const toolsBreakdown: BarChartItem[] = (data.toolsBreakdown || []).map((t: any) => ({
    label: t.tool || t.name,
    value: Number(t.count || t.usages || 0),
  }));

  return (
    <div className="space-y-8">
      {/* 1. Visualizer Engagement KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Visualizer Sessions"
          value={(metrics.totalSessions || 0).toLocaleString()}
          change={metrics.sessionsChange}
          icon={<Compass size={15} />}
        />
        <MetricCard
          label="Products Loaded"
          value={(metrics.productsLoaded || 0).toLocaleString()}
          icon={<Eye size={15} />}
        />
        <MetricCard
          label="Custom Uploads"
          value={(metrics.customUploads || 0).toLocaleString()}
          icon={<UploadCloud size={15} />}
        />
        <MetricCard
          label="Preset Rooms"
          value={(metrics.presetSelections || 0).toLocaleString()}
          icon={<Layers size={15} />}
        />
        <MetricCard
          label="Exports / Downloads"
          value={(metrics.exportsCount || 0).toLocaleString()}
          icon={<Download size={15} />}
        />
        <MetricCard
          label="Visualizer Add-to-Cart"
          value={(metrics.visualizerAddToCartCount || 0).toLocaleString()}
          icon={<ShoppingBag size={15} />}
        />
      </div>

      {/* 2. Visualizer Users vs Non-Visualizer Users Comparison */}
      <SectionCard
        title="Visualizer User Comparison"
        subtitle="Observed performance metrics between visitors who engaged with the visualizer vs storefront-only sessions"
        badge="Session Attribution Linkage"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-secondary,#333)] text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted,#888)]">
                <th className="pb-3 font-medium">Cohort</th>
                <th className="pb-3 font-medium text-right">Add to Cart Rate</th>
                <th className="pb-3 font-medium text-right">Purchase Rate</th>
                <th className="pb-3 font-medium text-right">Average Order Value</th>
                <th className="pb-3 font-medium text-right">Total Attributed Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary,#222)] font-mono">
              <tr className="bg-[var(--accent-primary,#A38A61)]/5 hover:bg-[var(--accent-primary,#A38A61)]/10 transition-colors">
                <td className="py-3.5 font-sans font-medium text-[var(--text-primary,#FAF9F5)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  Visualizer Users
                </td>
                <td className="py-3.5 text-right font-medium text-emerald-400">
                  {((vzUsers.add_to_cart_rate || vzUsers.addToCartRate || 0) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 text-right font-medium text-[#D4AF37]">
                  {((vzUsers.purchase_rate || vzUsers.purchaseRate || 0) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 text-right text-[var(--text-primary,#FAF9F5)]">
                  AED {Number(vzUsers.aov || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 text-right text-emerald-400 font-semibold">
                  AED {Number(vzUsers.revenue || data.visualizerAssistedRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="hover:bg-[var(--bg-tertiary,#181818)] transition-colors">
                <td className="py-3.5 font-sans text-[var(--text-secondary,#aaa)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted,#777)]" />
                  Non-Visualizer Users
                </td>
                <td className="py-3.5 text-right text-[var(--text-secondary,#aaa)]">
                  {((nonVzUsers.add_to_cart_rate || nonVzUsers.addToCartRate || 0) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 text-right text-[var(--text-secondary,#aaa)]">
                  {((nonVzUsers.purchase_rate || nonVzUsers.purchaseRate || 0) * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 text-right text-[var(--text-secondary,#aaa)]">
                  AED {Number(nonVzUsers.aov || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 text-right text-[var(--text-secondary,#aaa)]">
                  AED {Number(nonVzUsers.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-[var(--bg-tertiary,#181818)] border border-[var(--border-secondary,#262626)] rounded-[1px] text-[11px] text-[var(--text-secondary,#888)] font-light leading-relaxed">
          <strong className="text-[var(--text-primary,#FAF9F5)] font-medium">Attribution Chain: </strong>
          <code>visualizer_* event → session_id → purchase_completed (same session) → order_id → WooCommerce Order Settlement → Revenue</code>. Figures represent observed correlation across active sessions.
        </div>
      </SectionCard>

      {/* 3. Top Visualized Pieces & Tool Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Most Visualized Products"
          subtitle="Catalog designs tested most frequently in AR canvas"
        >
          <SvgBarChart items={topVisualized} valueSuffix=" sessions" maxItems={6} />
        </SectionCard>

        <SectionCard
          title="Interactive Studio Tools Usage"
          subtitle="Tool popularity across perspective alignment and mask rendering"
        >
          <SvgBarChart items={toolsBreakdown} valueSuffix=" actions" barColor="#C5A880" maxItems={6} />
        </SectionCard>
      </div>
    </div>
  );
}
