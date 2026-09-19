"use client";

import React from "react";
import {
  TrendingUp,
  Calendar,
  Sparkles,
  RefreshCw,
  Clock,
  Filter,
} from "lucide-react";

export type TAnalyticsDateRange = "today" | "7_days" | "30_days" | "custom";

interface AnalyticsHeaderProps {
  dateRange: TAnalyticsDateRange;
  onDateRangeChange: (range: TAnalyticsDateRange) => void;
  customStartDate: string;
  customEndDate: string;
  onCustomStartDateChange: (date: string) => void;
  onCustomEndDateChange: (date: string) => void;
  isFetching?: boolean;
  onRefresh?: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  isFetching = false,
  onRefresh,
}) => {
  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />

      {/* Ambient glow orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-emerald-500/15 via-teal-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-success badge-outline gap-1.5 px-3 py-2 text-xs font-black bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Sales Analytics
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Marketplace Sync
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Sales & Business <span className="text-emerald-400">Analytics</span>
          </h1>
          <p className="text-slate-300/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Analyze historical revenue trajectories, order velocity, category and department drivers, and top-selling product performance over customizable time horizons.
          </p>
        </div>

        {/* Date Filter & Refresh Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Quick Date Range Buttons */}
          <div className="join bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => onDateRangeChange("today")}
              className={`join-item px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                dateRange === "today"
                  ? "bg-emerald-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => onDateRangeChange("7_days")}
              className={`join-item px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                dateRange === "7_days"
                  ? "bg-emerald-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => onDateRangeChange("30_days")}
              className={`join-item px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                dateRange === "30_days"
                  ? "bg-emerald-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => onDateRangeChange("custom")}
              className={`join-item px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                dateRange === "custom"
                  ? "bg-emerald-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Custom
            </button>
          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isFetching}
              className="btn btn-outline btn-sm border-white/20 text-slate-200 hover:bg-emerald-400 hover:text-slate-950 hover:border-emerald-400 transition-all rounded-xl gap-1.5 self-center sm:self-auto"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Date Range Picker inputs if custom selected */}
      {dateRange === "custom" && (
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Custom Range:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              className="input input-xs bg-black/40 border-white/20 text-white rounded-lg px-2 py-1"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
              className="input input-xs bg-black/40 border-white/20 text-white rounded-lg px-2 py-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsHeader;
