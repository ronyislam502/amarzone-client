"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  PieChart as PieIcon,
  Info,
} from "lucide-react";

export interface TChartPoint {
  label: string; // e.g. "Sep 12"
  value: number;
}

export interface TStatusPoint {
  status: string;
  count: number;
}

interface VendorSalesChartsProps {
  revenueOverTime: TChartPoint[];
  ordersOverTime: TChartPoint[];
  ordersByStatus: TStatusPoint[];
}

const STATUS_COLORS: Record<string, { stroke: string; bg: string; text: string; label: string }> = {
  PENDING: { stroke: "#fbbf24", bg: "bg-amber-400", text: "text-amber-400", label: "Pending Payment" },
  UNSHIPPED: { stroke: "#22d3ee", bg: "bg-cyan-400", text: "text-cyan-400", label: "Unshipped" },
  SHIPPED: { stroke: "#60a5fa", bg: "bg-blue-400", text: "text-blue-400", label: "Shipped" },
  DELIVERED: { stroke: "#34d399", bg: "bg-emerald-400", text: "text-emerald-400", label: "Delivered" },
  CANCELLED: { stroke: "#f87171", bg: "bg-rose-400", text: "text-rose-400", label: "Cancelled" },
};

const DEFAULT_STATUS_COLOR = {
  stroke: "#a78bfa",
  bg: "bg-purple-400",
  text: "text-purple-400",
  label: "Other",
};

export const VendorSalesCharts: React.FC<VendorSalesChartsProps> = ({
  revenueOverTime = [],
  ordersOverTime = [],
  ordersByStatus = [],
}) => {
  const [metricMode, setMetricMode] = useState<"revenue" | "orders">("revenue");
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const activeLineData = metricMode === "revenue" ? revenueOverTime : ordersOverTime;

  // SVG Line Chart Dimensions
  const svgWidth = 650;
  const svgHeight = 260;
  const padding = { top: 25, right: 25, bottom: 40, left: 55 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const { points, maxValue, pathD, areaD } = useMemo(() => {
    if (activeLineData.length === 0) {
      return { points: [], maxValue: 0, pathD: "", areaD: "" };
    }

    const values = activeLineData.map((d) => d.value);
    const max = Math.max(...values, 1);

    const computed = activeLineData.map((item, index) => {
      const x =
        activeLineData.length === 1
          ? padding.left + chartWidth / 2
          : padding.left + (index / (activeLineData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - (item.value / max) * chartHeight;
      return { x, y, ...item };
    });

    if (computed.length === 1) {
      const p = computed[0];
      return {
        points: computed,
        maxValue: max,
        pathD: `M ${padding.left} ${p.y} L ${padding.left + chartWidth} ${p.y}`,
        areaD: `M ${padding.left} ${p.y} L ${padding.left + chartWidth} ${p.y} L ${padding.left + chartWidth} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`,
      };
    }

    // Cubic Bezier curve path
    let d = `M ${computed[0].x} ${computed[0].y}`;
    for (let i = 0; i < computed.length - 1; i++) {
      const current = computed[i];
      const next = computed[i + 1];
      const controlX = (current.x + next.x) / 2;
      d += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    const last = computed[computed.length - 1];
    const first = computed[0];
    const area = `${d} L ${last.x} ${padding.top + chartHeight} L ${first.x} ${padding.top + chartHeight} Z`;

    return { points: computed, maxValue: max, pathD: d, areaD: area };
  }, [activeLineData, chartWidth, chartHeight, padding.left, padding.top]);

  // Donut Chart calculations
  const totalStatusCount = useMemo(() => {
    return ordersByStatus.reduce((acc, curr) => acc + curr.count, 0);
  }, [ordersByStatus]);

  const nonZeroSlices = useMemo(() => {
    return ordersByStatus.filter((s) => s.count > 0);
  }, [ordersByStatus]);

  const donutSize = 220;
  const donutStroke = 24;
  const donutRadius = (donutSize - donutStroke) / 2 - 8;
  const donutCenter = donutSize / 2;
  const circumference = 2 * Math.PI * donutRadius;

  const sliceAngles = useMemo(() => {
    if (totalStatusCount === 0) return [];
    let cumulative = 0;
    return nonZeroSlices.map((item) => {
      const pct = item.count / totalStatusCount;
      const strokeDasharray = `${pct * circumference} ${circumference * (1 - pct)}`;
      const strokeDashoffset = -cumulative * circumference;
      cumulative += pct;
      return { ...item, percentage: Math.round(pct * 100), strokeDasharray, strokeDashoffset };
    });
  }, [nonZeroSlices, totalStatusCount, circumference]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Line Chart: Revenue & Orders Over Time (7 cols) */}
      <div className="lg:col-span-7 card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none" />

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="space-y-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Performance Trend
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>{metricMode === "revenue" ? "Sales Revenue Trajectory" : "Order Volume Velocity"}</span>
              </h3>
            </div>

            {/* Metric Switcher Button */}
            <div className="join bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setMetricMode("revenue");
                  setHoveredLineIndex(null);
                }}
                className={`join-item px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  metricMode === "revenue"
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Revenue ($)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMetricMode("orders");
                  setHoveredLineIndex(null);
                }}
                className={`join-item px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  metricMode === "orders"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders (Qty)</span>
              </button>
            </div>
          </div>

          {/* SVG Line Chart Viewport */}
          <div className="pt-4 relative">
            {points.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Info className="w-6 h-6 text-slate-500" />
                <span className="text-xs">No activity recorded for this period</span>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
                  <defs>
                    <linearGradient id="vendorRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="vendorOrdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                    const y = padding.top + chartHeight * (1 - pct);
                    const val = Math.round(maxValue * pct);
                    return (
                      <g key={i}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={padding.left + chartWidth}
                          y2={y}
                          stroke="rgba(255,255,255,0.07)"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padding.left - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="text-[10px] fill-slate-400 font-semibold"
                        >
                          {metricMode === "revenue" ? `$${val}` : val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Gradient Area */}
                  {areaD && (
                    <path
                      d={areaD}
                      fill={metricMode === "revenue" ? "url(#vendorRevGrad)" : "url(#vendorOrdGrad)"}
                    />
                  )}

                  {/* Foreground Curve Line */}
                  {pathD && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={metricMode === "revenue" ? "#34d399" : "#fbbf24"}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Data Points */}
                  {points.map((p, idx) => (
                    <g key={idx} className="cursor-pointer">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={hoveredLineIndex === idx ? 6 : 3.5}
                        fill={hoveredLineIndex === idx ? "#ffffff" : metricMode === "revenue" ? "#34d399" : "#fbbf24"}
                        stroke={metricMode === "revenue" ? "#064e3b" : "#78350f"}
                        strokeWidth="2"
                        onMouseEnter={() => setHoveredLineIndex(idx)}
                        onMouseLeave={() => setHoveredLineIndex(null)}
                      />
                      {/* X-axis date labels */}
                      {(points.length <= 10 || idx % Math.ceil(points.length / 7) === 0) && (
                        <text
                          x={p.x}
                          y={padding.top + chartHeight + 18}
                          textAnchor="middle"
                          className="text-[10px] fill-slate-400 font-semibold"
                        >
                          {p.label}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>

                {/* Floating Tooltip if Point Hovered */}
                {hoveredLineIndex !== null && points[hoveredLineIndex] && (
                  <div className="absolute top-8 right-6 bg-slate-900 border border-white/20 rounded-xl px-3 py-1.5 shadow-xl text-xs z-30 pointer-events-none">
                    <span className="text-slate-400 text-[10px]">{points[hoveredLineIndex].label}:</span>{" "}
                    <strong className={metricMode === "revenue" ? "text-emerald-400" : "text-amber-400"}>
                      {metricMode === "revenue"
                        ? `$${points[hoveredLineIndex].value.toFixed(2)}`
                        : `${points[hoveredLineIndex].value} orders`}
                    </strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Continuous sales trend calculated from confirmed orders</span>
          <span className="text-slate-300 font-bold">{points.length} data points</span>
        </div>
      </div>

      {/* 2. Donut Chart: Orders by Status (5 cols) */}
      <div className="lg:col-span-5 card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

        <div className="space-y-4">
          <div className="space-y-0.5 pb-3 border-b border-white/10">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Fulfillment Funnel
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-cyan-400" />
              <span>Orders by Lifecycle Status</span>
            </h3>
          </div>

          {/* Donut Chart Viewport */}
          <div className="flex flex-col items-center gap-6 py-2">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center shrink-0">
              <svg viewBox={`0 0 ${donutSize} ${donutSize}`} className="w-full h-full transform -rotate-90 overflow-visible">
                {/* Background Ring */}
                <circle
                  cx={donutCenter}
                  cy={donutCenter}
                  r={donutRadius}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={donutStroke}
                />
                {/* Slices */}
                {sliceAngles.map((slice, idx) => {
                  const color = STATUS_COLORS[slice.status] || DEFAULT_STATUS_COLOR;
                  const isHovered = hoveredSlice === slice.status;
                  return (
                    <circle
                      key={idx}
                      cx={donutCenter}
                      cy={donutCenter}
                      r={donutRadius}
                      fill="none"
                      stroke={color.stroke}
                      strokeWidth={isHovered ? donutStroke + 4 : donutStroke}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice(slice.status)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Total Count */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                <span className="text-3xl font-black text-white tracking-tight">{totalStatusCount}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Slices Legend List */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 w-full">
              {sliceAngles.map((slice, idx) => {
                const color = STATUS_COLORS[slice.status] || DEFAULT_STATUS_COLOR;
                const isHovered = hoveredSlice === slice.status;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredSlice(slice.status)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`flex items-center gap-2.5 text-sm px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      isHovered ? "bg-white/10" : ""
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full shrink-0 ${color.bg}`} />
                    <span className="font-semibold text-slate-300 whitespace-nowrap">{color.label}</span>
                    <span className="font-bold text-white ml-auto">{slice.count}</span>
                    <span className="text-[11px] text-slate-400">({slice.percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 text-center sm:text-left">
          Hover over slices to inspect active stage volumes.
        </div>
      </div>
    </div>
  );
};

export default VendorSalesCharts;
