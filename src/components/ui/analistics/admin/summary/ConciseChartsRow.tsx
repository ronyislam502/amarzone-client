"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  DollarSign,
  ShoppingBag,
  FolderTree,
} from "lucide-react";
import {
  TDailyChartPoint,
} from "../overview/AdminLineChart";
import {
  TStatusCountPoint,
  TCategorySalesPoint,
} from "@/src/types/dashboard";

interface ConciseChartsRowProps {
  ordersData?: TDailyChartPoint[];
  revenueData?: TDailyChartPoint[];
  orderStatusData?: TStatusCountPoint[];
  categorySalesData?: TCategorySalesPoint[];
}

const STATUS_COLOR_MAP: Record<string, string> = {
  DELIVERED: "#34d399",
  PENDING: "#fbbf24",
  UNSHIPPED: "#22d3ee",
  SHIPPED: "#60a5fa",
  CANCELLED: "#f87171",
  REFUNDED: "#c084fc",
  PAID: "#34d399",
  UNPAID: "#f87171",
};

export const ConciseChartsRow: React.FC<ConciseChartsRowProps> = ({
  ordersData = [],
  revenueData = [],
  orderStatusData = [],
  categorySalesData = [],
}) => {
  const [lineMode, setLineMode] = useState<"orders" | "revenue">("orders");
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

  // 1. Line Chart Data
  const rawLinePoints = lineMode === "orders" ? ordersData : revenueData;
  const sortedLinePoints = useMemo(() => {
    return [...rawLinePoints].sort((a, b) => a.label.localeCompare(b.label));
  }, [rawLinePoints]);

  const svgWidth = 400;
  const svgHeight = 160;
  const padding = { top: 15, right: 15, bottom: 25, left: 35 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const { points, maxValue, pathD, areaD } = useMemo(() => {
    if (sortedLinePoints.length === 0) {
      return { points: [], maxValue: 0, pathD: "", areaD: "" };
    }
    const vals = sortedLinePoints.map((p) => p.value);
    const max = Math.max(...vals, 1);

    const pts = sortedLinePoints.map((item, idx) => {
      const x =
        sortedLinePoints.length === 1
          ? padding.left + chartW / 2
          : padding.left + (idx / (sortedLinePoints.length - 1)) * chartW;
      const y = padding.top + chartH - (item.value / max) * chartH;
      return { x, y, label: item.label, value: item.value };
    });

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cur = pts[i];
      const nxt = pts[i + 1];
      const cx = cur.x + (nxt.x - cur.x) / 2;
      d += ` C ${cx} ${cur.y}, ${cx} ${nxt.y}, ${nxt.x} ${nxt.y}`;
    }
    const last = pts[pts.length - 1];
    const first = pts[0];
    const area = `${d} L ${last.x} ${padding.top + chartH} L ${first.x} ${padding.top + chartH} Z`;

    return { points: pts, maxValue: max, pathD: d, areaD: area };
  }, [sortedLinePoints, chartW, chartH, padding.left, padding.top]);

  const activeLinePt =
    hoveredLineIndex !== null && points[hoveredLineIndex] ? points[hoveredLineIndex] : null;

  // 2. Pie / Donut Chart Data
  const filteredStatus = useMemo(() => {
    return orderStatusData.filter((s) => s.count > 0);
  }, [orderStatusData]);

  const totalStatusCount = useMemo(() => {
    return orderStatusData.reduce((acc, curr) => acc + curr.count, 0);
  }, [orderStatusData]);

  const donutSize = 140;
  const donutStroke = 18;
  const donutR = (donutSize - donutStroke) / 2 - 4;
  const donutCenter = donutSize / 2;
  const donutCircumference = 2 * Math.PI * donutR;

  const donutSlices = useMemo(() => {
    if (totalStatusCount === 0) return [];
    let offset = 0;
    return filteredStatus.map((item) => {
      const fraction = item.count / totalStatusCount;
      const strokeDasharray = `${donutCircumference * fraction} ${donutCircumference}`;
      const strokeDashoffset = -offset;
      offset += donutCircumference * fraction;
      return {
        status: item.status,
        count: item.count,
        percentage: (fraction * 100).toFixed(0),
        strokeDasharray,
        strokeDashoffset,
        color: STATUS_COLOR_MAP[item.status.toUpperCase()] || "#94a3b8",
      };
    });
  }, [filteredStatus, totalStatusCount, donutCircumference]);

  // 3. Bar Chart Data (Top 4 categories)
  const top4Categories = useMemo(() => {
    return categorySalesData.slice(0, 4);
  }, [categorySalesData]);

  const maxCategorySales = useMemo(() => {
    if (top4Categories.length === 0) return 1;
    return Math.max(...top4Categories.map((c) => c.sales), 1);
  }, [top4Categories]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Concise Line Chart (Daily Trend Sparkline) */}
      <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 flex flex-col justify-between">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-emerald-400/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="text-xs font-black text-white">Daily Velocity</span>
            </div>

            {/* Switch */}
            <div className="flex items-center bg-[#120824] border border-white/15 rounded-xl p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setLineMode("orders")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  lineMode === "orders" ? "bg-emerald-400 text-slate-950 font-black" : "text-slate-400"
                }`}
              >
                Orders
              </button>
              <button
                type="button"
                onClick={() => setLineMode("revenue")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  lineMode === "revenue" ? "bg-amber-400 text-slate-950 font-black" : "text-slate-400"
                }`}
              >
                Revenue
              </button>
            </div>
          </div>

          {/* Sparkline Canvas */}
          <div className="relative w-full overflow-hidden">
            {points.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No activity recorded in range.
              </div>
            ) : (
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
                <defs>
                  <linearGradient id="conciseLineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={lineMode === "orders" ? "#34d399" : "#fbbf24"}
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor={lineMode === "orders" ? "#34d399" : "#fbbf24"}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[0, 0.5, 1].map((r) => {
                  const y = padding.top + chartH - r * chartH;
                  return (
                    <line
                      key={r}
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + chartW}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="3 3"
                    />
                  );
                })}

                {/* Area & Stroke */}
                {areaD && <path d={areaD} fill="url(#conciseLineGrad)" />}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={lineMode === "orders" ? "#34d399" : "#fbbf24"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}

                {/* Hover dots */}
                {points.map((p, idx) => (
                  <circle
                    key={p.label}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredLineIndex === idx ? 5 : 3}
                    fill="#170d2f"
                    stroke={lineMode === "orders" ? "#34d399" : "#fbbf24"}
                    strokeWidth={hoveredLineIndex === idx ? 2.5 : 1.5}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredLineIndex(idx)}
                    onMouseLeave={() => setHoveredLineIndex(null)}
                  />
                ))}
              </svg>
            )}

            {/* Hover Tooltip */}
            {activeLinePt && (
              <div
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mb-1 z-30"
                style={{
                  left: `${(activeLinePt.x / svgWidth) * 100}%`,
                  top: `${(activeLinePt.y / svgHeight) * 100}%`,
                }}
              >
                <div className="bg-[#120824] border border-white/20 px-2 py-1 rounded-lg text-[10px] font-mono text-white shadow-xl">
                  <span>{activeLinePt.label}: </span>
                  <span className="font-bold text-amber-400">
                    {lineMode === "orders"
                      ? `${activeLinePt.value} ord`
                      : `$${activeLinePt.value.toLocaleString()}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Concise Pie / Donut Chart (Status Proportions) */}
      <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 flex flex-col justify-between">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-cyan-400/10 text-cyan-400">
                <PieIcon className="w-4 h-4" />
              </span>
              <span className="text-xs font-black text-white">Status Breakdown</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {totalStatusCount.toLocaleString()} total
            </span>
          </div>

          {totalStatusCount === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No orders found in range.
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              {/* Donut SVG */}
              <div className="relative shrink-0 flex items-center justify-center">
                <svg width={donutSize} height={donutSize} className="transform -rotate-90">
                  <circle
                    cx={donutCenter}
                    cy={donutCenter}
                    r={donutR}
                    fill="transparent"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={donutStroke}
                  />
                  {donutSlices.map((slice) => (
                    <circle
                      key={slice.status}
                      cx={donutCenter}
                      cy={donutCenter}
                      r={donutR}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={donutStroke}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      strokeLinecap="butt"
                    />
                  ))}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-xs font-black text-white font-mono">
                    {totalStatusCount.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">Orders</span>
                </div>
              </div>

              {/* Mini Legend */}
              <div className="space-y-1 text-[11px] font-mono flex-1">
                {donutSlices.slice(0, 4).map((s) => (
                  <div key={s.status} className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-300 capitalize text-[10px] truncate">{s.status.toLowerCase()}</span>
                    </div>
                    <span className="font-bold text-white text-[10px]">{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Concise Bar Chart (Top Categories) */}
      <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 flex flex-col justify-between">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-purple-400/10 text-purple-400">
                <BarChart3 className="w-4 h-4" />
              </span>
              <span className="text-xs font-black text-white">Top Categories</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Units Sold</span>
          </div>

          {top4Categories.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No category volume recorded.
            </div>
          ) : (
            <div className="space-y-2.5">
              {top4Categories.map((cat, idx) => {
                const pct = Math.max((cat.sales / maxCategorySales) * 100, 5);
                return (
                  <div key={cat.category || idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-slate-200 truncate max-w-[140px]">
                        {cat.category || "Unassigned"}
                      </span>
                      <span className="font-mono font-bold text-amber-400 text-[10px]">
                        {cat.sales.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-amber-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConciseChartsRow;
