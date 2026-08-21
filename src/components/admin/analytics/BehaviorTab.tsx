"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MetricCard, SectionCard, TabSkeletonLoader, ErrorState, EmptyState } from "./CommonComponents";
import SvgBarChart, { BarChartItem } from "./charts/SvgBarChart";
import { DateRangeSelection } from "./DateRangePicker";
import { Search, SlidersHorizontal, AlertCircle, ShoppingCart } from "lucide-react";

interface BehaviorTabProps {
  dateRange: DateRangeSelection;
}

export default function BehaviorTab({ dateRange }: BehaviorTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBehavior = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: dateRange.period,
        compare: dateRange.compare ? "true" : "false",
      });
      if (dateRange.startDate) params.set("start", dateRange.startDate);
      if (dateRange.endDate) params.set("end", dateRange.endDate);

      const res = await fetch(`/api/analytics/behavior?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load behavior analytics (HTTP ${res.status})`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err.message || "Error fetching behavior metrics");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchBehavior();
  }, [fetchBehavior]);

  if (loading) return <TabSkeletonLoader cards={3} />;
  if (error) return <ErrorState message={error} onRetry={fetchBehavior} />;
  if (!data) return <EmptyState />;

  const topSearches: BarChartItem[] = (data.topSearches || []).map((s: any) => ({
    label: `"${s.query || s.term}"`,
    value: Number(s.count || s.searches || 0),
    secondaryValue: `${s.resultCount || 0} avg results`,
  }));

  const zeroResultSearches: BarChartItem[] = (data.zeroResultSearches || []).map((s: any) => ({
    label: `"${s.query || s.term}"`,
    value: Number(s.count || s.searches || 0),
    color: "#E11D48",
  }));

  const filterUsage: BarChartItem[] = (data.filterUsage || []).map((f: any) => ({
    label: `${f.filterType || f.category}: ${f.filterValue || f.value}`,
    value: Number(f.count || f.appliedCount || 0),
  }));

  return (
    <div className="space-y-8">
      {/* 1. Search Behavior Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Top Search Queries"
          subtitle="Most frequent search terms in the storefront intelligent search modal"
          badge="Search Intent"
        >
          <SvgBarChart items={topSearches} valueSuffix=" searches" maxItems={6} />
        </SectionCard>

        <SectionCard
          title="Zero-Result Searches"
          subtitle="Search terms yielding 0 catalog matches (Inventory gaps or typo opportunities)"
          badge="Product Demand Gaps"
        >
          <SvgBarChart items={zeroResultSearches} valueSuffix=" queries" barColor="#F43F5E" maxItems={6} emptyMessage="No zero-result searches in this range." />
        </SectionCard>
      </div>

      {/* 2. Catalog Filters Usage */}
      <SectionCard
        title="Catalog Filter Interactions"
        subtitle="Customer filter toggle preferences (color, size, material, weave)"
      >
        <SvgBarChart items={filterUsage} valueSuffix=" filter toggles" barColor="#A38A61" maxItems={8} />
      </SectionCard>
    </div>
  );
}
