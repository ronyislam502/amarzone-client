"use client";

import React, { useState, useMemo } from "react";
import { PieChart as PieIcon, CreditCard, ShoppingBag, Info } from "lucide-react";
import { TStatusCountPoint } from "@/src/types/dashboard";

interface AdminPieChartProps {
  orderStatusData?: TStatusCountPoint[];
  paymentStatusData?: TStatusCountPoint[];
}

const STATUS_COLOR_MAP: Record<string, { stroke: string; bg: string; text: string; label: string }> = {
  // Order Statuses
  PENDING: { stroke: "#fbbf24", bg: "bg-amber-400", text: "text-amber-400", label: "Pending" },
  UNSHIPPED: { stroke: "#22d3ee", bg: "bg-cyan-400", text: "text-cyan-400", label: "Processing" },
  SHIPPED: { stroke: "#60a5fa", bg: "bg-blue-400", text: "text-blue-400", label: "Shipped" },
  DELIVERED: { stroke: "#34d399", bg: "bg-emerald-400", text: "text-emerald-400", label: "Delivered" },
  CANCELLED: { stroke: "#f87171", bg: "bg-rose-400", text: "text-rose-400", label: "Cancelled" },
  REFUNDED: { stroke: "#c084fc", bg: "bg-purple-400", text: "text-purple-400", label: "Refunded" },

  // Payment Statuses
  PAID: { stroke: "#34d399", bg: "bg-emerald-400", text: "text-emerald-400", label: "Paid" },
  UNPAID: { stroke: "#f87171", bg: "bg-rose-400", text: "text-rose-400", label: "Unpaid / Failed" },
};

const DEFAULT_COLOR = {
  stroke: "#94a3b8",
  bg: "bg-slate-400",
  text: "text-slate-400",
  label: "Other",
};

export const AdminPieChart: React.FC<AdminPieChartProps> = ({
  orderStatusData = [],
  paymentStatusData = [],
}) => {
  const [chartMode, setChartMode] = useState<"orders" | "payments">("orders");
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  const activeRawData = chartMode === "orders" ? orderStatusData : paymentStatusData;

  // Filter out zero counts for clean chart slices, while retaining non-zero values
  const nonZeroSlices = useMemo(() => {
    return activeRawData.filter((item) => item.count > 0);
  }, [activeRawData]);

  const totalCount = useMemo(() => {
    return activeRawData.reduce((acc, curr) => acc + curr.count, 0);
  }, [activeRawData]);

  // Donut geometry constants
  const size = 260;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2 - 10; // ~106px
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate slice offset angles
  const sliceAngles = useMemo(() => {
    if (totalCount === 0) return [];
    let accumulatedOffset = 0;

    return nonZeroSlices.map((item) => {
      const fraction = item.count / totalCount;
      const strokeDasharray = `${circumference * fraction} ${circumference}`;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += circumference * fraction;

      const meta = STATUS_COLOR_MAP[item.status.toUpperCase()] || DEFAULT_COLOR;
      return {
        status: item.status,
        count: item.count,
        percentage: (fraction * 100).toFixed(1),
        strokeDasharray,
        strokeDashoffset,
        color: meta.stroke,
        label: meta.label,
      };
    });
  }, [nonZeroSlices, totalCount, circumference]);

  const hoveredSlice = sliceAngles.find((s) => s.status === hoveredStatus);

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none z-20" />

      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      {/* Card Header & Mode Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
              <PieIcon className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Status Distribution
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real breakdown proportions by stage and settlement status.
          </p>
        </div>

        {/* Toggle between Orders Status & Payments Status */}
        <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => {
              setChartMode("orders");
              setHoveredStatus(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              chartMode === "orders"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setChartMode("payments");
              setHoveredStatus(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              chartMode === "payments"
                ? "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments</span>
          </button>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="relative z-10 mt-4 flex-1 flex flex-col items-center justify-center">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
            <Info className="w-8 h-8 text-cyan-400/60" />
            <div className="text-sm font-extrabold text-white">No Distribution Data</div>
            <div className="text-xs max-w-xs text-slate-400">
              No transactions or status changes found in the selected range.
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6">
            {/* SVG Donut */}
            <div className="relative shrink-0 flex items-center justify-center">
              <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Track Circle */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth={strokeWidth}
                />

                {/* Slices */}
                {sliceAngles.map((slice) => {
                  const isHovered = hoveredStatus === slice.status;
                  return (
                    <circle
                      key={slice.status}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      strokeLinecap="butt"
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredStatus(slice.status)}
                      onMouseLeave={() => setHoveredStatus(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
                {hoveredSlice ? (
                  <>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      {hoveredSlice.label}
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      {hoveredSlice.count.toLocaleString()}
                    </span>
                    <span className="text-xs font-black" style={{ color: hoveredSlice.color }}>
                      {hoveredSlice.percentage}% share
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Total {chartMode === "orders" ? "Orders" : "Payments"}
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      {totalCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      100% recorded
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Legend List */}
            <div className="flex-1 w-full space-y-2 max-w-xs">
              {activeRawData.map((item) => {
                const meta = STATUS_COLOR_MAP[item.status.toUpperCase()] || DEFAULT_COLOR;
                const percentage = totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : "0.0";
                const isHovered = hoveredStatus === item.status;

                return (
                  <div
                    key={item.status}
                    onMouseEnter={() => setHoveredStatus(item.status)}
                    onMouseLeave={() => setHoveredStatus(null)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                      isHovered
                        ? "bg-white/10 border-white/25 shadow-md"
                        : "bg-[#120824]/60 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                        style={{ backgroundColor: meta.stroke }}
                      />
                      <span className="text-xs font-extrabold text-slate-200">
                        {meta.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="font-black text-white">{item.count.toLocaleString()}</span>
                      <span className="text-[11px] font-bold text-slate-400 w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPieChart;
