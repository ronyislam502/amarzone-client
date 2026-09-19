"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  RefreshCw,
  Clock,
  BarChart3,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { TDashboardDateRange } from "@/src/types/dashboard";

interface AdminSummaryHeaderProps {
  selectedRange: TDashboardDateRange;
  onRangeChange: (range: TDashboardDateRange) => void;
  onRefresh: () => void;
  isFetching?: boolean;
  socketConnected?: boolean;
}

const RANGE_OPTIONS: { label: string; value: TDashboardDateRange }[] = [
  { label: "7 Days", value: "7_days" },
  { label: "30 Days", value: "30_days" },
  { label: "90 Days", value: "90_days" },
  { label: "12 Months", value: "12_months" },
];

export const AdminSummaryHeader: React.FC<AdminSummaryHeaderProps> = ({
  selectedRange,
  onRangeChange,
  onRefresh,
  isFetching = false,
  socketConnected = false,
}) => {
  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

      {/* Ambient background glow orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* High-tech dot matrix overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="card-body relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-7">
        <div className="space-y-2">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-warning gap-1 px-3 py-2 text-xs font-black shadow text-slate-900">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Dashboard
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur border border-white/15 text-slate-200">
              <span
                className={`w-2 h-2 rounded-full ${
                  socketConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span>System Live: {socketConnected ? "Connected" : "Syncing"}</span>
            </div>
            <span className="badge badge-success badge-outline gap-1 font-bold text-xs bg-success/10 border-success/30 text-emerald-400">
              <Layers className="w-3 h-3" />
              System Overview
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Admin <span className="text-amber-400">System Overview</span>
          </h1>
          <p className="text-slate-300/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Consolidated real-time intelligence: platform revenue, commission breakdown, active users, catalog statistics, recent orders, and live alerts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Time Range Selector */}
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
                  onClick={() => onRangeChange(opt.value)}
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

          {/* AI Executive Briefing Trigger */}
          <a
            href="#ai-insights"
            className="btn btn-sm gap-1.5 font-black bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white border-0 rounded-xl shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Briefing</span>
          </a>

          {/* Link to Full Analytics */}
          <Link
            href="/admin/analytics"
            className="btn btn-sm gap-1.5 font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 rounded-xl shadow-lg shadow-amber-500/20"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Deep Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSummaryHeader;
