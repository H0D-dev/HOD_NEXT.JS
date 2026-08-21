"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MetricCard, SectionCard, TabSkeletonLoader, ErrorState, EmptyState } from "./CommonComponents";
import SvgLineChart, { LineChartPoint } from "./charts/SvgLineChart";
import SvgDonutChart, { DonutSegment } from "./charts/SvgDonutChart";
import { DateRangeSelection } from "./DateRangePicker";
import { CreditCard, DollarSign, RotateCcw, Tag, ShoppingBag, TrendingUp } from "lucide-react";

interface SalesTabProps {
  dateRange: DateRangeSelection;
}

export default function SalesTab({ dateRange }: SalesTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: dateRange.period,
        compare: dateRange.compare ? "true" : "false",
      });
      if (dateRange.startDate) params.set("start", dateRange.startDate);
      if (dateRange.endDate) params.set("end", dateRange.endDate);

      const res = await fetch(`/api/analytics/revenue?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load sales data (HTTP ${res.status})`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err.message || "Error fetching sales metrics");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  if (loading) return <TabSkeletonLoader cards={4} />;
  if (error) return <ErrorState message={error} onRetry={fetchSales} />;
  if (!data) return <EmptyState />;

  const kpis = data.kpis || data.summary || {};
  const trend: LineChartPoint[] = (data.trend || data.revenueTrend || []).map((t: any) => ({
    date: t.date || t.label,
    label: t.label || t.date,
    value: Number(t.revenue || t.netSales || t.value || 0),
    compareValue: typeof t.compareRevenue === "number" ? t.compareRevenue : undefined,
  }));

  const paymentColors = ["#A38A61", "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#6B7280"];
  const paymentMethods: DonutSegment[] = (data.paymentMethods || []).map((pm: any, idx: number) => ({
    label: pm.name || pm.method || pm.title || "Standard Checkout",
    value: Number(pm.total || pm.revenue || pm.ordersCount || 0),
    color: paymentColors[idx % paymentColors.length],
  }));

  const ordersList = data.recentOrders || [];

  return (
    <div className="space-y-8">
      {/* 1. Sales Financial KPI Cards (2 rows of 3 spacious cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        <MetricCard
          label="Gross Sales"
          value={`AED ${(kpis.grossSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={kpis.grossSalesChange}
          icon={<DollarSign size={15} />}
        />
        <MetricCard
          label="Net Sales"
          value={`AED ${(kpis.netSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={kpis.netSalesChange}
          icon={<DollarSign size={15} />}
        />
        <MetricCard
          label="Refunds"
          value={`AED ${(kpis.refunds || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`${kpis.refundsCount || 0} items refunded`}
          icon={<RotateCcw size={15} />}
        />
        <MetricCard
          label="Coupons / Discounts"
          value={`AED ${(kpis.discounts || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<Tag size={15} />}
        />
        <MetricCard
          label="Total Orders"
          value={(kpis.ordersCount || 0).toLocaleString()}
          change={kpis.ordersCountChange}
          icon={<ShoppingBag size={15} />}
        />
        <MetricCard
          label="Average Order Value"
          value={`AED ${(kpis.aov || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={kpis.aovChange}
          icon={<TrendingUp size={15} />}
        />
      </div>

      {/* 2. Detailed Revenue Timeline */}
      <SectionCard
        title="Revenue & Net Sales Timeline"
        subtitle="Time-series progression of verified WooCommerce orders"
      >
        <SvgLineChart
          data={trend}
          valuePrefix="AED "
          primaryLabel="Net Sales"
          compareLabel="Prior Period"
        />
      </SectionCard>

      {/* 3. Payment Methods Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <SectionCard
            title="Payment Method Breakdown"
            subtitle="Volume and revenue distribution by payment gateway"
          >
            <SvgDonutChart
              segments={paymentMethods}
              totalLabel="Sales"
            />
          </SectionCard>
        </div>

        <div className="lg:col-span-6">
          <SectionCard
            title="Commerce Integrity & Source"
            subtitle="Authoritative WooCommerce settlement verification"
            badge="WooCommerce API"
          >
            <div className="space-y-4 text-xs font-light text-[var(--text-secondary,#aaa)] leading-relaxed">
              <p>
                All financial figures (Gross Sales, Net Sales, Refunds, Discounts) are queried directly from the WooCommerce Core Reporting layer via server-side Basic Auth.
              </p>
              <div className="p-4 border border-[var(--border-secondary,#262626)] bg-[var(--bg-tertiary,#1a1a1a)] rounded-[1px] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted,#777)]">Currency Reference:</span>
                  <span className="font-mono text-[var(--text-primary,#FAF9F5)]">AED (Base Store Currency)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted,#777)]">Reporting Source:</span>
                  <span className="font-mono text-[var(--text-primary,#FAF9F5)]">/wp-json/wc/v3/reports/sales</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted,#777)]">Data Deduplication:</span>
                  <span className="font-mono text-emerald-400">Strict Order ID Verification</span>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
