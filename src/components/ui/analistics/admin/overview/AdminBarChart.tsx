"use client";

import React, { useState, useMemo } from "react";
import { BarChart3, FolderTree, Building2, UserPlus, Info } from "lucide-react";
import {
  TCategorySalesPoint,
  TDepartmentSalesPoint,
  TDashboardChartPoint,
} from "@/src/types/dashboard";

interface AdminBarChartProps {
  departmentSalesData?: TDepartmentSalesPoint[];
  categorySalesData?: TCategorySalesPoint[];
  userGrowthData?: TDashboardChartPoint[];
  defaultView?: "departments" | "categories" | "growth";
  title?: string;
}

export const AdminBarChart: React.FC<AdminBarChartProps> = ({
  departmentSalesData = [],
  categorySalesData = [],
  userGrowthData = [],
  defaultView = "departments",
  title,
}) => {
  const [viewMode, setViewMode] = useState<"departments" | "categories" | "growth">(defaultView);

  // Max value for relative percentage calculations
  const maxDepartmentSales = useMemo(() => {
    if (departmentSalesData.length === 0) return 1;
    return Math.max(...departmentSalesData.map((d) => d.sales), 1);
  }, [departmentSalesData]);

  const maxCategorySales = useMemo(() => {
    if (categorySalesData.length === 0) return 1;
    return Math.max(...categorySalesData.map((c) => c.sales), 1);
  }, [categorySalesData]);

  const maxGrowthValue = useMemo(() => {
    if (userGrowthData.length === 0) return 1;
    return Math.max(...userGrowthData.map((u) => u.value), 1);
  }, [userGrowthData]);

  const hasData =
    viewMode === "departments"
      ? departmentSalesData.length > 0
      : viewMode === "categories"
      ? categorySalesData.length > 0
      : userGrowthData.length > 0;

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />

      {/* Ambient background glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br from-purple-600/15 via-pink-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      {/* Header with Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-purple-400">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {title || "Sales & Performance Rankings"}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparative bar distribution across catalog departments, product categories, and registrations.
          </p>
        </div>

        {/* View Mode Switch */}
        <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 self-start sm:self-auto shadow-inner flex-wrap">
          <button
            type="button"
            onClick={() => setViewMode("departments")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "departments"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Departments</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("categories")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "categories"
                ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("growth")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "growth"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>User Growth</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 mt-4 flex-1">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
            <Info className="w-8 h-8 text-purple-400/60" />
            <div className="text-sm font-extrabold text-white">No Ranking Records</div>
            <div className="text-xs max-w-xs text-slate-400">
              {viewMode === "departments"
                ? "No catalog department product sales recorded for this timeframe."
                : viewMode === "categories"
                ? "No catalog category product sales have been logged yet."
                : "No monthly user growth metrics are available for the period."}
            </div>
          </div>
        ) : viewMode === "departments" ? (
          /* Department Sales Horizontal Bar Meters */
          <div className="space-y-3.5">
            {departmentSalesData.map((item, index) => {
              const percentage = Math.max((item.sales / maxDepartmentSales) * 100, 4);

              return (
                <div
                  key={item.department || index}
                  className="p-3 rounded-2xl bg-[#120824]/60 border border-white/5 hover:border-white/15 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>
                      <span className="font-extrabold text-slate-100 truncate max-w-[180px] sm:max-w-[260px]">
                        {item.department || "General Department"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-black text-cyan-300">
                        {item.sales.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">units sold</span>
                    </div>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-400 to-emerald-400 shadow-sm transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewMode === "categories" ? (
          /* Category Sales Horizontal Bar Meters */
          <div className="space-y-3.5">
            {categorySalesData.map((item, index) => {
              const percentage = Math.max((item.sales / maxCategorySales) * 100, 4);

              return (
                <div
                  key={item.category || index}
                  className="p-3 rounded-2xl bg-[#120824]/60 border border-white/5 hover:border-white/15 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>
                      <span className="font-extrabold text-slate-100 truncate max-w-[180px] sm:max-w-[260px]">
                        {item.category || "Uncategorized"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-black text-amber-400">
                        {item.sales.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">units</span>
                    </div>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-400 to-amber-400 shadow-sm transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Monthly User Growth Vertical Bars */
          <div className="space-y-4">
            <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2">
              {userGrowthData.map((pt, idx) => {
                const heightPct = Math.max((pt.value / maxGrowthValue) * 100, 6);
                return (
                  <div
                    key={pt.label || idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-black text-amber-400 bg-[#120824] px-2 py-0.5 rounded border border-white/15 whitespace-nowrap shadow-lg">
                      {pt.value.toLocaleString()}
                    </div>

                    {/* Bar Column */}
                    <div className="w-full max-w-[42px] h-full flex items-end justify-center">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-amber-500/30 via-amber-400/80 to-amber-300 group-hover:from-amber-400 group-hover:to-orange-400 transition-all duration-300 shadow-lg relative"
                        style={{ height: `${heightPct}%` }}
                      >
                        {/* Top glowing cap */}
                        <div className="absolute top-0 inset-x-0 h-1 rounded-t-xl bg-white/70" />
                      </div>
                    </div>

                    {/* Label */}
                    <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-white truncate max-w-[48px]">
                      {pt.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-center text-[11px] font-bold text-slate-400">
              Monthly Active New User Onboardings
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBarChart;

