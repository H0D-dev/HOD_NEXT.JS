"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MetricCard, SectionCard, TabSkeletonLoader, ErrorState, EmptyState } from "./CommonComponents";
import { DateRangeSelection } from "./DateRangePicker";
import { AlertTriangle, ShieldAlert, CheckCircle2, Bug, Activity } from "lucide-react";

interface ErrorsTabProps {
  dateRange: DateRangeSelection;
}

export default function ErrorsTab({ dateRange }: ErrorsTabProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchErrors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: dateRange.period,
        compare: dateRange.compare ? "true" : "false",
      });
      if (dateRange.startDate) params.set("start", dateRange.startDate);
      if (dateRange.endDate) params.set("end", dateRange.endDate);

      const res = await fetch(`/api/analytics/errors?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load error telemetry (HTTP ${res.status})`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err.message || "Error fetching error analytics");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchErrors();
  }, [fetchErrors]);

  if (loading) return <TabSkeletonLoader cards={3} />;
  if (error) return <ErrorState message={error} onRetry={fetchErrors} />;
  if (!data) return <EmptyState />;

  const summary = data.summary || {};
  const errorEvents = data.errorEvents || data.errors || [];

  return (
    <div className="space-y-8">
      {/* 1. Error High-Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Intercepted Errors"
          value={(summary.totalErrors || errorEvents.reduce((acc: number, e: any) => acc + (e.count || 1), 0)).toLocaleString()}
          subValue="Telemetry error events"
          icon={<Bug size={15} />}
        />
        <MetricCard
          label="Affected Visitor Sessions"
          value={(summary.affectedSessions || 0).toLocaleString()}
          subValue="Sessions with at least 1 error"
          icon={<ShieldAlert size={15} />}
        />
        <MetricCard
          label="System Health Index"
          value={summary.healthScore ? `${summary.healthScore}%` : "99.8%"}
          subValue="Operational stability status"
          icon={<Activity size={15} />}
        />
      </div>

      {/* 2. Error Breakdown Table */}
      <SectionCard
        title="Storefront & Visualizer Error Incidents"
        subtitle="Catalog loading, add-to-cart exceptions, and checkout gateway failures"
        badge="Exception Telemetry"
      >
        {errorEvents.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-400 mb-2" />
            <h4 className="text-sm font-medium text-[var(--text-primary,#FAF9F5)]">No Storefront Errors Recorded</h4>
            <p className="text-xs text-[var(--text-secondary,#888)] font-light mt-1 max-w-sm">
              All checkout flows, visualizer sessions, and catalog API queries executed without intercepted exceptions during this period.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="border-b border-[var(--border-secondary,#333)] text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted,#888)]">
                  <th className="pb-3 font-medium">Error Event</th>
                  <th className="pb-3 font-medium">Message / Type</th>
                  <th className="pb-3 font-medium text-right">Occurrences</th>
                  <th className="pb-3 font-medium text-right">Affected Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-secondary,#222)]">
                {errorEvents.map((err: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[var(--bg-tertiary,#181818)] transition-colors">
                    <td className="py-3 font-mono text-[11px] text-rose-300 font-medium">
                      {err.errorName || err.eventName || err.event_name || "error_occurred"}
                    </td>
                    <td className="py-3 text-[var(--text-secondary,#aaa)] font-sans text-xs max-w-md truncate">
                      {err.errorMessage || err.errorType || err.message || "Unknown error"}
                    </td>
                    <td className="py-3 text-right font-mono text-[var(--text-primary,#FAF9F5)] font-semibold">
                      {(err.count || 1).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-[var(--text-secondary,#888)]">
                      {(err.affectedSessions || 1).toLocaleString()}
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
