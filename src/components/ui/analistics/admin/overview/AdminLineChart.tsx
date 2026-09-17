"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, Calendar, DollarSign, ShoppingBag, Info } from "lucide-react";

export interface TDailyChartPoint {
  label: string; // e.g. "2026-03-15"
  value: number;
}

interface AdminLineChartProps {
  ordersData?: TDailyChartPoint[];
  revenueData?: TDailyChartPoint[];
  forcedMetric?: "orders" | "revenue";
  title?: string;
  subtitle?: string;
}

export const AdminLineChart: React.FC<AdminLineChartProps> = ({
  ordersData = [],
  revenueData = [],
  forcedMetric,
  title,
  subtitle,
}) => {
  const [internalMetricType, setInternalMetricType] = useState<"orders" | "revenue">(
    forcedMetric || "orders"
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const metricType = forcedMetric || internalMetricType;
  const rawData = metricType === "orders" ? ordersData : revenueData;

  // Ensure points are sorted chronologically by label
  const sortedPoints = useMemo(() => {
    return [...rawData].sort((a, b) => a.label.localeCompare(b.label));
  }, [rawData]);

  // Compute SVG dimensions and scale coordinates
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const { points, maxValue, minValue, pathD, areaD } = useMemo(() => {
    if (sortedPoints.length === 0) {
      return { points: [], maxValue: 0, minValue: 0, pathD: "", areaD: "" };
    }

    const values = sortedPoints.map((p) => p.value);
    const max = Math.max(...values, 1);
    const min = 0;

    const computedPoints = sortedPoints.map((item, index) => {
      const x =
        sortedPoints.length === 1
          ? padding.left + chartWidth / 2
          : padding.left + (index / (sortedPoints.length - 1)) * chartWidth;
      const normalizedY = (item.value - min) / (max - min || 1);
      const y = padding.top + chartHeight - normalizedY * chartHeight;
      return { x, y, label: item.label, value: item.value };
    });

    if (computedPoints.length === 1) {
      const single = computedPoints[0];
      const pD = `M ${single.x - 40} ${single.y} L ${single.x + 40} ${single.y}`;
      const aD = `M ${single.x - 40} ${single.y} L ${single.x + 40} ${single.y} L ${single.x + 40} ${padding.top + chartHeight} L ${single.x - 40} ${padding.top + chartHeight} Z`;
      return { points: computedPoints, maxValue: max, minValue: min, pathD: pD, areaD: aD };
    }

    // Build smooth cubic bezier curve
    let d = `M ${computedPoints[0].x} ${computedPoints[0].y}`;
    for (let i = 0; i < computedPoints.length - 1; i++) {
      const current = computedPoints[i];
      const next = computedPoints[i + 1];
      const controlX1 = current.x + (next.x - current.x) / 2;
      const controlY1 = current.y;
      const controlX2 = current.x + (next.x - current.x) / 2;
      const controlY2 = next.y;
      d += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }

    const last = computedPoints[computedPoints.length - 1];
    const first = computedPoints[0];
    const area = `${d} L ${last.x} ${padding.top + chartHeight} L ${first.x} ${padding.top + chartHeight} Z`;

    return { points: computedPoints, maxValue: max, minValue: min, pathD: d, areaD: area };
  }, [sortedPoints, chartWidth, chartHeight, padding.left, padding.top]);

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  const strokeColor = metricType === "orders" ? "#34d399" : "#fbbf24"; // emerald vs amber
  const fillColorId = metricType === "orders" ? "emeraldGlowGrad" : "amberGlowGrad";

  const totalValue = sortedPoints.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6">
      {/* Top glowing accent border line */}
      <div
        className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${
          metricType === "orders" ? "via-emerald-400/60" : "via-amber-400/60"
        } to-transparent pointer-events-none z-20 transition-all duration-300`}
      />

      {/* Ambient background glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      {/* Header with Title and Mode Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {title || (metricType === "revenue" ? "Revenue Over Time" : "Orders Over Time")}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {subtitle || (metricType === "revenue"
              ? "Daily transaction volume and revenue curve across the current active window."
              : "Daily fulfillment order velocity and volume curve across the current active window.")}
          </p>
        </div>

        {/* Toggle Switch or Fixed Badge */}
        {forcedMetric ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[#120824] border border-white/15 shadow-inner">
            {forcedMetric === "orders" ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Orders Stream</span>
              </>
            ) : (
              <>
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">Revenue Stream</span>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 self-start sm:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => {
                setInternalMetricType("orders");
                setHoveredIndex(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                metricType === "orders"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders Volume</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setInternalMetricType("revenue");
                setHoveredIndex(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                metricType === "revenue"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Daily Revenue</span>
            </button>
          </div>
        )}
      </div>

      {/* Chart Canvas or Empty State */}
      <div className="relative z-10 mt-4">
        {points.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
            <Info className="w-8 h-8 text-amber-400/60" />
            <div className="text-sm font-extrabold text-white">No Activity in Range</div>
            <div className="text-xs max-w-xs text-slate-400">
              No orders or revenue transactions were recorded in the active filter timeframe.
            </div>
          </div>
        ) : (
          <>
            {/* Quick Metrics Bar above chart */}
            <div className="flex items-center justify-between mb-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">Period Total:</span>
                <span className="font-mono font-extrabold text-white text-sm">
                  {metricType === "orders"
                    ? `${totalValue.toLocaleString()} orders`
                    : `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>Peak:</span>
                <span className="text-amber-400 font-bold">
                  {metricType === "orders"
                    ? `${maxValue.toLocaleString()}`
                    : `$${maxValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                </span>
              </div>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  {/* Emerald Area Gradient */}
                  <linearGradient id="emeraldGlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Amber Area Gradient */}
                  <linearGradient id="amberGlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis Labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = padding.top + chartHeight - ratio * chartHeight;
                  const labelValue = minValue + ratio * (maxValue - minValue);
                  const formatted =
                    metricType === "orders"
                      ? Math.round(labelValue).toString()
                      : `$${Math.round(labelValue)}`;
                  return (
                    <g key={ratio}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={padding.left + chartWidth}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padding.left - 10}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="#94a3b8"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        {formatted}
                      </text>
                    </g>
                  );
                })}

                {/* Area Gradient Fill */}
                {areaD && <path d={areaD} fill={`url(#${fillColorId})`} />}

                {/* Smooth Bézier Stroke Line */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Active Hover Vertical Cursor Guide */}
                {activePoint && (
                  <line
                    x1={activePoint.x}
                    y1={padding.top}
                    x2={activePoint.x}
                    y2={padding.top + chartHeight}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                )}

                {/* Interactive Data Point Circles */}
                {points.map((p, idx) => {
                  const isHovered = hoveredIndex === idx;
                  return (
                    <g
                      key={p.label}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                    >
                      {/* Invisible wider target area for easy hovering */}
                      <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                      {/* Outer pulsing ring when hovered */}
                      {isHovered && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="9"
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="2"
                          opacity="0.6"
                          className="animate-ping"
                        />
                      )}

                      {/* Data Point Node */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 6 : 4}
                        fill="#170d2f"
                        stroke={strokeColor}
                        strokeWidth={isHovered ? 3 : 2}
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}

                {/* X-Axis Date Labels (sample up to 6 evenly spaced labels to prevent crowding) */}
                {(() => {
                  const count = points.length;
                  const step = count <= 6 ? 1 : Math.ceil(count / 6);
                  return points
                    .filter((_, idx) => idx % step === 0 || idx === count - 1)
                    .map((p) => {
                      // Format "YYYY-MM-DD" into short "MMM DD"
                      const parts = p.label.split("-");
                      const shortDate =
                        parts.length === 3 ? `${parts[1]}/${parts[2]}` : p.label;
                      return (
                        <text
                          key={p.label}
                          x={p.x}
                          y={padding.top + chartHeight + 20}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#94a3b8"
                          fontWeight="700"
                        >
                          {shortDate}
                        </text>
                      );
                    });
                })()}
              </svg>

              {/* Floating Tooltip positioned near active point */}
              {activePoint && (
                <div
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 z-30 transition-all duration-100"
                  style={{
                    left: `${(activePoint.x / svgWidth) * 100}%`,
                    top: `${(activePoint.y / svgHeight) * 100}%`,
                  }}
                >
                  <div className="bg-[#120824] border border-white/20 rounded-xl p-2.5 shadow-2xl text-xs space-y-1 backdrop-blur-md">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{activePoint.label}</span>
                    </div>
                    <div className="font-mono font-black text-white text-sm">
                      {metricType === "orders"
                        ? `${activePoint.value.toLocaleString()} Orders`
                        : `$${activePoint.value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLineChart;
