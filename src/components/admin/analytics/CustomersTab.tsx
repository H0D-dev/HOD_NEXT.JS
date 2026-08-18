"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MetricCard, SectionCard, TabSkeletonLoader, ErrorState, EmptyState } from "./CommonComponents";
import { DateRangeSelection } from "./DateRangePicker";
import { Users, UserPlus, UserCheck, Repeat, DollarSign, ShoppingBag } from "lucide-react";

interface CustomersTabProps {
  dateRange: DateRangeSelection;
}

export default function CustomersTab({ dateRange }: CustomersTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: dateRange.period,
        compare: dateRange.compare ? "true" : "false",
      });
      if (dateRange.startDate) params.set("start", dateRange.startDate);
      if (dateRange.endDate) params.set("end", dateRange.endDate);

      const res = await fetch(`/api/analytics/customers?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load customer analytics (HTTP ${res.status})`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err.message || "Error fetching customer metrics");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  if (loading) return <TabSkeletonLoader cards={4} />;
  if (error) return <ErrorState message={error} onRetry={fetchCustomers} />;
  if (!data) return <EmptyState />;

  const summary = data.summary || data;
  const topCustomers = data.topCustomers || [];

  return (
    <div className="space-y-8">
      {/* 1. Customer KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Active Customers"
          value={(summary.totalCustomers || 0).toLocaleString()}
          icon={<Users size={15} />}
        />
        <MetricCard
          label="New Customers"
          value={(summary.newCustomers || 0).toLocaleString()}
          subValue="First-time purchasers"
          icon={<UserPlus size={15} />}
        />
        <MetricCard
          label="Returning Customers"
          value={(summary.returningCustomers || 0).toLocaleString()}
          subValue="Multi-order profiles"
          icon={<UserCheck size={15} />}
        />
        <MetricCard
          label="Repeat Purchase Rate"
          value={`${((summary.repeatPurchaseRate || 0) * (summary.repeatPurchaseRate < 1 ? 100 : 1)).toFixed(1)}%`}
          icon={<Repeat size={15} />}
        />
      </div>

      {/* 2. Top Purchasing Customers List */}
      <SectionCard
        title="Customer Lifetime Value & Spend"
        subtitle="Top accounts ranked by settled WooCommerce revenue"
        badge="WooCommerce Customers"
      >
        {topCustomers.length === 0 ? (
          <p className="text-xs text-[var(--text-muted,#777)] font-light py-6 text-center">
            No customer order records available for this date range.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="border-b border-[var(--border-secondary,#333)] text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted,#888)]">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Email / Contact</th>
                  <th className="pb-3 font-medium text-right">Orders</th>
                  <th className="pb-3 font-medium text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-secondary,#222)]">
                {topCustomers.map((cust: any, idx: number) => (
                  <tr key={cust.id || idx} className="hover:bg-[var(--bg-tertiary,#181818)] transition-colors">
                    <td className="py-3 font-medium text-[var(--text-primary,#FAF9F5)]">
                      {cust.name || `${cust.first_name || ""} ${cust.last_name || ""}`.trim() || `Customer #${cust.id || idx + 1}`}
                    </td>
                    <td className="py-3 text-[var(--text-secondary,#888)] font-mono text-[11px]">
                      {cust.email || "—"}
                    </td>
                    <td className="py-3 text-right font-mono text-[var(--text-primary,#FAF9F5)]">
                      {(cust.orders_count || cust.ordersCount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-[#D4AF37] font-medium">
                      AED {Number(cust.total_spent || cust.totalSpent || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
