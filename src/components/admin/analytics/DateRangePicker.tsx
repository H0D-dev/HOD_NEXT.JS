"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check, ArrowRightLeft } from "lucide-react";

export type DatePeriodKey = "today" | "yesterday" | "last7" | "last30" | "this_month" | "prev_month" | "custom";

export interface DateRangeSelection {
  period: DatePeriodKey;
  startDate?: string;
  endDate?: string;
  compare: boolean;
  label: string;
}

const PRESET_OPTIONS: Array<{ key: DatePeriodKey; label: string; desc: string }> = [
  { key: "today", label: "Today", desc: "Since midnight" },
  { key: "yesterday", label: "Yesterday", desc: "Full previous day" },
  { key: "last7", label: "Last 7 Days", desc: "Past 7 calendar days" },
  { key: "last30", label: "Last 30 Days", desc: "Past 30 calendar days" },
  { key: "this_month", label: "This Month", desc: "From 1st to today" },
  { key: "prev_month", label: "Previous Month", desc: "Full prior calendar month" },
  { key: "custom", label: "Custom Range", desc: "Pick specific date range" },
];

interface DateRangePickerProps {
  value: DateRangeSelection;
  onChange: (range: DateRangeSelection) => void;
  disabled?: boolean;
}

export default function DateRangePicker({
  value,
  onChange,
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.startDate || "");
  const [customEnd, setCustomEnd] = useState(value.endDate || "");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelectPreset = (key: DatePeriodKey) => {
    if (key === "custom") {
      // Don't close immediately for custom range
      return;
    }
    const opt = PRESET_OPTIONS.find((p) => p.key === key);
    onChange({
      period: key,
      compare: value.compare,
      label: opt?.label || "Selected Range",
    });
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    onChange({
      period: "custom",
      startDate: customStart,
      endDate: customEnd,
      compare: value.compare,
      label: `${customStart} → ${customEnd}`,
    });
    setIsOpen(false);
  };

  const handleToggleCompare = () => {
    onChange({
      ...value,
      compare: !value.compare,
    });
  };

  return (
    <div className="relative inline-flex items-center gap-2" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 border border-[var(--border-secondary,#333)] bg-[var(--bg-secondary,#141414)] hover:border-[var(--accent-primary,#A38A61)] text-[var(--text-primary,#FAF9F5)] rounded-[2px] transition-colors text-xs font-sans"
        aria-expanded={isOpen}
      >
        <Calendar size={14} className="text-[#A38A61]" />
        <span className="uppercase tracking-[0.14em] font-medium text-[11px]">
          {value.label}
        </span>
        <ChevronDown size={13} className={`text-[var(--text-secondary,#888)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Compare Period Toggle Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggleCompare}
        title="Toggle comparison against prior equivalent period"
        className={`flex items-center gap-1.5 px-3 py-2 border rounded-[2px] text-xs transition-colors font-sans ${
          value.compare
            ? "border-[#A38A61] bg-[#A38A61]/15 text-[#D4AF37]"
            : "border-[var(--border-secondary,#333)] bg-[var(--bg-secondary,#141414)] text-[var(--text-muted,#777)] hover:text-white"
        }`}
      >
        <ArrowRightLeft size={12} />
        <span className="text-[10px] uppercase tracking-[0.14em] font-medium">Compare</span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-[var(--bg-primary,#111111)] border border-[var(--border-secondary,#333)] shadow-2xl z-50 rounded-[2px] p-3 text-xs">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted,#777)] px-2 py-1 font-medium border-b border-[var(--border-secondary,#262626)] mb-2">
            Select Time Range
          </div>

          <div className="space-y-1">
            {PRESET_OPTIONS.map((opt) => {
              const isSelected = value.period === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectPreset(opt.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[1px] text-left transition-colors ${
                    isSelected
                      ? "bg-[#A38A61]/15 text-[#D4AF37] border border-[#A38A61]/40"
                      : "text-[var(--text-primary,#FAF9F5)] hover:bg-[var(--bg-secondary,#1a1a1a)]"
                  }`}
                >
                  <div>
                    <span className="font-medium uppercase tracking-[0.12em] text-[11px] block">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary,#888)] font-light">
                      {opt.desc}
                    </span>
                  </div>
                  {isSelected && <Check size={13} className="text-[#D4AF37]" />}
                </button>
              );
            })}
          </div>

          {/* Custom Range Drawer inside Popover */}
          {value.period === "custom" && (
            <div className="mt-3 pt-3 border-t border-[var(--border-secondary,#262626)] space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted,#888)] block font-medium">
                Custom Dates
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] uppercase text-[var(--text-muted,#777)] block mb-1">Start</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full bg-[var(--bg-secondary,#1a1a1a)] border border-[var(--border-secondary,#333)] px-2 py-1 text-xs text-white focus:outline-none focus:border-[#A38A61]"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-[var(--text-muted,#777)] block mb-1">End</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full bg-[var(--bg-secondary,#1a1a1a)] border border-[var(--border-secondary,#333)] px-2 py-1 text-xs text-white focus:outline-none focus:border-[#A38A61]"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!customStart || !customEnd}
                className="w-full mt-2 py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold bg-[#A38A61] hover:bg-[#8F7752] text-white disabled:opacity-40 transition-colors"
              >
                Apply Custom Range
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
