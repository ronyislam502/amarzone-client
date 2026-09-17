"use client";

import React from "react";
import {
  Sparkles,
  RefreshCw,
  Calendar,
  Layers,
  Radio,
  Clock,
} from "lucide-react";
import { TDashboardDateRange } from "@/src/types/dashboard";

interface AdminDashboardHeaderProps {
  selectedRange: TDashboardDateRange;
  onRangeChange: (range: TDashboardDateRange, startDate?: string, endDate?: string) => void;
  onRefresh: () => void;
  isFetching?: boolean;
  socketConnected?: boolean;
  customStartDate?: string;
  customEndDate?: string;
}

const RANGE_OPTIONS: { label: string; value: TDashboardDateRange }[] = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7_days" },
  { label: "30 Days", value: "30_days" },
  { label: "Custom", value: "custom" },
];

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  selectedRange,
  onRangeChange,
  onRefresh,
  isFetching = false,
  socketConnected = false,
  customStartDate = "",
  customEndDate = "",
}) => {
  const [startDate, setStartDate] = React.useState(customStartDate);
  const [endDate, setEndDate] = React.useState(customEndDate);
  const [showCustomPicker, setShowCustomPicker] = React.useState(selectedRange === "custom");

  React.useEffect(() => {
    setShowCustomPicker(selectedRange === "custom");
  }, [selectedRange]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onRangeChange("custom", startDate, endDate);
    }
  };

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

      {/* Ambient background glow orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* High-tech dot matrix overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="card-body relative z-10 flex flex-col gap-5 p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-warning gap-1 px-3 py-2 text-xs font-black shadow text-slate-900">
                <Sparkles className="w-3.5 h-3.5" />
                Executive Analytics
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur border border-white/15 text-slate-200">
                <span
                  className={`w-2 h-2 rounded-full ${
                    socketConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                <span>Live Telemetry: {socketConnected ? "Online" : "Synchronizing"}</span>
              </div>
              <span className="badge badge-success badge-outline gap-1 font-bold text-xs bg-success/10 border-success/30 text-emerald-400">
                <Layers className="w-3 h-3" />
                Real API Verified
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Marketplace <span className="text-amber-400">Control Hub</span>
            </h1>
            <p className="text-slate-300/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Deep operational analytics dashboard visualizing revenue streams, order distribution cycles, merchant statistics, department/category volumes, and platform inventory health.
            </p>
          </div>

          {/* Action Controls: Time Range Selector & Refresh */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 shadow-inner">
              <div className="px-2 text-slate-400 flex items-center gap-1 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Range:</span>
              </div>
              {RANGE_OPTIONS.map((opt) => {
                const isActive = selectedRange === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      if (opt.value === "custom") {
                        setShowCustomPicker(true);
                      } else {
                        setShowCustomPicker(false);
                        onRangeChange(opt.value);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Refresh Action */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={isFetching}
              title="Refresh dashboard metrics"
              className="btn btn-sm gap-2 font-bold border-white/15 text-slate-200 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 transition-all rounded-xl shadow-sm bg-white/5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Expandable Custom Date Range Selector */}
        {showCustomPicker && (
          <form
            onSubmit={handleApplyCustom}
            className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Custom Date Window:
            </span>
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-[11px] font-medium">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="input input-xs bg-[#120824] border-white/20 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-[11px] font-medium">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="input input-xs bg-[#120824] border-white/20 text-white rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={!startDate || !endDate}
              className="btn btn-xs bg-amber-400 text-slate-950 hover:bg-amber-300 font-black rounded-lg px-3 cursor-pointer shadow-sm disabled:opacity-50"
            >
              Apply Filter
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardHeader;

