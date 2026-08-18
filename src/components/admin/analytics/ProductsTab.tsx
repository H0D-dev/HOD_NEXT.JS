"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MetricCard, SectionCard, TabSkeletonLoader, ErrorState, EmptyState } from "./CommonComponents";
import SvgBarChart, { BarChartItem } from "./charts/SvgBarChart";
import { DateRangeSelection } from "./DateRangePicker";
import { Layers, Sparkles, TrendingDown, TrendingUp, Package, AlertCircle } from "lucide-react";

interface ProductsTabProps {
  dateRange: DateRangeSelection;
}

export default function ProductsTab({ dateRange }: ProductsTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metricView, setMetricView] = useState<"revenue" | "units" | "orders">("revenue");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: dateRange.period,
        compare: dateRange.compare ? "true" : "false",
      });
      if (dateRange.startDate) params.set("start", dateRange.startDate);
      if (dateRange.endDate) params.set("end", dateRange.endDate);

      const res = await fetch(`/api/analytics/products?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load product analytics (HTTP ${res.status})`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err.message || "Error fetching product metrics");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <TabSkeletonLoader cards={4} />;
  if (error) return <ErrorState message={error} onRetry={fetchProducts} />;
  if (!data) return <EmptyState />;

  const topByRevenue: BarChartItem[] = (data.topByRevenue || []).map((p: any) => ({
    label: p.name || p.title || `Product #${p.id}`,
    value: Number(p.totalRevenue || p.revenue || 0),
    secondaryValue: `${p.unitsSold || 0} units`,
  }));

  const topByUnits: BarChartItem[] = (data.topByUnits || []).map((p: any) => ({
    label: p.name || p.title || `Product #${p.id}`,
    value: Number(p.unitsSold || p.quantity || 0),
    secondaryValue: `AED ${(p.totalRevenue || 0).toLocaleString()}`,
  }));

  const topByOrders: BarChartItem[] = (data.topByOrders || []).map((p: any) => ({
    label: p.name || p.title || `Product #${p.id}`,
    value: Number(p.ordersCount || p.orders || 0),
    secondaryValue: `AED ${(p.totalRevenue || 0).toLocaleString()}`,
  }));

  const opportunityMatrix = data.opportunityMatrix || {
    highViewsLowPurchases: [],
    lowViewsHighPurchases: [],
  };

  const highViewsLowPurchases = opportunityMatrix.highViewsLowPurchases || [];
  const lowViewsHighPurchases = opportunityMatrix.lowViewsHighPurchases || [];

  const variantPerformance = data.variations || [];
  const sizePerformance = data.sizes || [];

  return (
    <div className="space-y-8">
      {/* 1. Metric Selector & Top Products Chart */}
      <SectionCard
        title="Top Performing Products"
        subtitle="Catalog ranked by sales velocity and volume"
        action={
          <div className="flex items-center gap-1 bg-[var(--bg-tertiary,#1a1a1a)] p-1 border border-[var(--border-secondary,#333)] rounded-[2px]">
            <button
              onClick={() => setMetricView("revenue")}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-[1px] transition-colors ${
                metricView === "revenue"
                  ? "bg-[#A38A61] text-white font-medium"
                  : "text-[var(--text-secondary,#888)] hover:text-white"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setMetricView("units")}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-[1px] transition-colors ${
                metricView === "units"
                  ? "bg-[#A38A61] text-white font-medium"
                  : "text-[var(--text-secondary,#888)] hover:text-white"
              }`}
            >
              Units Sold
            </button>
            <button
              onClick={() => setMetricView("orders")}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-[1px] transition-colors ${
                metricView === "orders"
                  ? "bg-[#A38A61] text-white font-medium"
                  : "text-[var(--text-secondary,#888)] hover:text-white"
              }`}
            >
              Orders
            </button>
          </div>
        }
      >
        {metricView === "revenue" && <SvgBarChart items={topByRevenue} valuePrefix="AED " maxItems={8} />}
        {metricView === "units" && <SvgBarChart items={topByUnits} valueSuffix=" units" maxItems={8} />}
        {metricView === "orders" && <SvgBarChart items={topByOrders} valueSuffix=" orders" maxItems={8} />}
      </SectionCard>

      {/* 2. Product Opportunity Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Views / Low Purchase */}
        <SectionCard
          title="High Views / Low Purchase"
          subtitle="Observed performance pattern: Strong discovery, lower conversion"
          badge="Attention Required"
        >
          {highViewsLowPurchases.length === 0 ? (
            <p className="text-xs text-[var(--text-muted,#777)] font-light py-6 text-center">
              No products matching this threshold in the current period.
            </p>
          ) : (
            <div className="space-y-3">
              {highViewsLowPurchases.slice(0, 5).map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#181818)] rounded-[1px] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <span className="font-medium text-[var(--text-primary,#FAF9F5)] block truncate">
                      {p.name || p.title}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary,#888)]">
                      {(p.views || 0).toLocaleString()} views · {p.purchases || 0} purchases
                    </span>
                  </div>
                  <div className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono shrink-0">
                    {((p.conversionRate || 0) * 100).toFixed(1)}% CVR
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Low Views / High Purchase */}
        <SectionCard
          title="Low Views / High Purchase"
          subtitle="Observed performance pattern: High demand efficiency when discovered"
          badge="High Potential"
        >
          {lowViewsHighPurchases.length === 0 ? (
            <p className="text-xs text-[var(--text-muted,#777)] font-light py-6 text-center">
              No products matching this threshold in the current period.
            </p>
          ) : (
            <div className="space-y-3">
              {lowViewsHighPurchases.slice(0, 5).map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#181818)] rounded-[1px] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <span className="font-medium text-[var(--text-primary,#FAF9F5)] block truncate">
                      {p.name || p.title}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary,#888)]">
                      {(p.views || 0).toLocaleString()} views · {p.purchases || 0} purchases
                    </span>
                  </div>
                  <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono shrink-0">
                    {((p.conversionRate || 0) * 100).toFixed(1)}% CVR
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* 3. Sizes & Variant Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Top Rug Dimensions & Sizes"
          subtitle="Customer sizing preferences across the catalog"
        >
          {sizePerformance.length === 0 ? (
            <p className="text-xs text-[var(--text-muted,#777)] font-light py-6 text-center">
              No size breakdown recorded for this range.
            </p>
          ) : (
            <div className="space-y-2.5">
              {sizePerformance.slice(0, 6).map((s: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 border-b border-[var(--border-secondary,#222)]">
                  <span className="font-mono text-[11px] text-[var(--text-primary,#FAF9F5)]">{s.label || s.size}</span>
                  <span className="font-mono text-xs text-[var(--text-secondary,#aaa)]">{s.count || s.ordersCount || 0} orders</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Variant & Color Performance"
          subtitle="Top selected colorways and textures"
        >
          {variantPerformance.length === 0 ? (
            <p className="text-xs text-[var(--text-muted,#777)] font-light py-6 text-center">
              No variant breakdown recorded for this range.
            </p>
          ) : (
            <div className="space-y-2.5">
              {variantPerformance.slice(0, 6).map((v: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 border-b border-[var(--border-secondary,#222)]">
                  <span className="font-sans text-[11px] text-[var(--text-primary,#FAF9F5)]">{v.color || v.name}</span>
                  <span className="font-mono text-xs text-[var(--text-secondary,#aaa)]">{v.selections || v.count || 0} selections</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
