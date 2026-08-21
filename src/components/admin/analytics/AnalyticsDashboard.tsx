"use client";

import React, { useState } from "react";
import DateRangePicker, { DateRangeSelection } from "./DateRangePicker";
import OverviewTab from "./OverviewTab";
import SalesTab from "./SalesTab";
import ProductsTab from "./ProductsTab";
import FunnelTab from "./FunnelTab";
import VisualizerTab from "./VisualizerTab";
import CustomersTab from "./CustomersTab";
import AttributionTab from "./AttributionTab";
import BehaviorTab from "./BehaviorTab";
import ErrorsTab from "./ErrorsTab";
import {
  LayoutDashboard,
  DollarSign,
  Package,
  Filter,
  Compass,
  Users,
  Share2,
  MousePointer,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export type DashboardTabKey =
  | "overview"
  | "sales"
  | "products"
  | "funnel"
  | "visualizer"
  | "customers"
  | "attribution"
  | "behavior"
  | "errors";

const TABS: Array<{ key: DashboardTabKey; label: string; icon: React.ReactNode }> = [
  { key: "overview", label: "Overview", icon: <LayoutDashboard size={14} /> },
  { key: "sales", label: "Sales & Revenue", icon: <DollarSign size={14} /> },
  { key: "products", label: "Products", icon: <Package size={14} /> },
  { key: "funnel", label: "Funnel", icon: <Filter size={14} /> },
  { key: "visualizer", label: "Room Visualizer", icon: <Compass size={14} /> },
  { key: "customers", label: "Customers", icon: <Users size={14} /> },
  { key: "attribution", label: "Acquisition & Geo", icon: <Share2 size={14} /> },
  { key: "behavior", label: "Behavior", icon: <MousePointer size={14} /> },
  { key: "errors", label: "Errors & Stability", icon: <AlertTriangle size={14} /> },
];

interface AnalyticsDashboardProps {
  adminUser?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    user_email?: string;
    role?: string;
  } | null;
}

export default function AnalyticsDashboard({ adminUser }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>("overview");
  const [dateRange, setDateRange] = useState<DateRangeSelection>({
    period: "last30",
    compare: true,
    label: "Last 30 Days",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8" key={refreshKey}>
      {/* 1. Header Toolbar with Date Controls & Refresh */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[var(--border-secondary,#262626)] gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] font-semibold bg-[#A38A61]/15 text-[#D4AF37] border border-[#A38A61]/30 rounded-[1px]">
              Admin Intelligence
            </span>
            <span className="text-xs text-[var(--text-secondary,#888)] font-light">
              Live Production Telemetry
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-light text-[var(--text-primary,#FAF9F5)] tracking-tight mt-2">
            Executive Analytics Dashboard
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh current dashboard data"
            className="flex items-center gap-1.5 px-3 py-2 border border-[var(--border-secondary,#333)] bg-[var(--bg-secondary,#141414)] hover:border-[var(--accent-primary,#A38A61)] text-[var(--text-secondary,#aaa)] hover:text-white rounded-[2px] text-xs transition-colors"
          >
            <RefreshCw size={13} />
            <span className="text-[10px] uppercase tracking-[0.14em] font-medium hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-[var(--border-secondary,#262626)] overflow-x-auto hide-scrollbar pb-px">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-[0.14em] font-medium transition-all whitespace-nowrap border-b-2 -mb-px rounded-t-[1px] ${
                isActive
                  ? "border-[#A38A61] text-[#D4AF37] bg-[#A38A61]/5"
                  : "border-transparent text-[var(--text-secondary,#888)] hover:text-[var(--text-primary,#FAF9F5)] hover:bg-[var(--bg-secondary,#141414)]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Active Tab Content Pane */}
      <div className="pt-2">
        {activeTab === "overview" && (
          <OverviewTab dateRange={dateRange} onNavigateTab={(tab) => setActiveTab(tab as DashboardTabKey)} />
        )}
        {activeTab === "sales" && <SalesTab dateRange={dateRange} />}
        {activeTab === "products" && <ProductsTab dateRange={dateRange} />}
        {activeTab === "funnel" && <FunnelTab dateRange={dateRange} />}
        {activeTab === "visualizer" && <VisualizerTab dateRange={dateRange} />}
        {activeTab === "customers" && <CustomersTab dateRange={dateRange} />}
        {activeTab === "attribution" && <AttributionTab dateRange={dateRange} />}
        {activeTab === "behavior" && <BehaviorTab dateRange={dateRange} />}
        {activeTab === "errors" && <ErrorsTab dateRange={dateRange} />}
      </div>
    </div>
  );
}
