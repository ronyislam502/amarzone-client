"use client";

import React, { useState, useMemo } from "react";
import { PieChart as PieIcon, Info } from "lucide-react";

export interface TPieChartSlice {
  id?: string;
  label: string;
  value: number;
  color?: string;
  stroke?: string;
  bg?: string;
  text?: string;
}

export interface TPieChartTab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  data: TPieChartSlice[];
  centerTitle?: string;
  emptyMessage?: string;
}

export interface PieChartProps {
  /** Single dataset */
  data?: TPieChartSlice[];
  /** Multiple datasets with tab switcher */
  tabs?: TPieChartTab[];
  /** Currently active tab */
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (key: string) => void;

  /** Visual customizations */
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  colorMap?: Record<string, string | { stroke: string; bg?: string; text?: string; label?: string }>;
  defaultSliceColor?: string;

  /** Donut geometry */
  size?: number; // e.g. 260, 220, 140
  strokeWidth?: number; // e.g. 28, 24, 18

  /** Legend */
  showLegend?: boolean;
  legendLayout?: "list" | "grid" | "compact";

  /** Center display */
  showCenterLabel?: boolean;
  centerTitle?: string;
  centerSubtitle?: string;

  /** Formatting & Mode */
  valueFormatter?: (val: number) => string;
  compact?: boolean;
  containerCard?: boolean;
  emptyMessage?: string;
  className?: string;
}

const DEFAULT_STATUS_PALETTE: Record<string, { stroke: string; bg: string; text: string; label: string }> = {
  PENDING: { stroke: "#fbbf24", bg: "bg-amber-400", text: "text-amber-400", label: "Pending" },
  UNSHIPPED: { stroke: "#22d3ee", bg: "bg-cyan-400", text: "text-cyan-400", label: "Processing" },
  SHIPPED: { stroke: "#60a5fa", bg: "bg-blue-400", text: "text-blue-400", label: "Shipped" },
  DELIVERED: { stroke: "#34d399", bg: "bg-emerald-400", text: "text-emerald-400", label: "Delivered" },
  CANCELLED: { stroke: "#f87171", bg: "bg-rose-400", text: "text-rose-400", label: "Cancelled" },
  REFUNDED: { stroke: "#c084fc", bg: "bg-purple-400", text: "text-purple-400", label: "Refunded" },
  PAID: { stroke: "#34d399", bg: "bg-emerald-400", text: "text-emerald-400", label: "Paid" },
  UNPAID: { stroke: "#f87171", bg: "bg-rose-400", text: "text-rose-400", label: "Unpaid / Failed" },
};

const FALLBACK_COLORS = ["#34d399", "#22d3ee", "#fbbf24", "#60a5fa", "#c084fc", "#f87171", "#f43f5e", "#a855f7"];

export const PieChart: React.FC<PieChartProps> = ({
  data = [],
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,

  title,
  subtitle,
  icon,
  headerRight,
  colorMap = DEFAULT_STATUS_PALETTE,
  defaultSliceColor,

  compact = false,
  size = compact ? 140 : 260,
  strokeWidth = compact ? 18 : 28,

  showLegend = true,
  legendLayout = compact ? "compact" : "list",
  showCenterLabel = true,
  centerTitle,
  centerSubtitle,

  valueFormatter = (val: number) => val.toLocaleString(),
  containerCard = true,
  emptyMessage = "No distribution or status records found in the active timeframe.",
  className = "",
}) => {
  const hasTabs = Array.isArray(tabs) && tabs.length > 0;
  const initialTabKey = defaultTab || (hasTabs ? tabs[0].key : "");
  const [internalTab, setInternalTab] = useState<string>(initialTabKey);
  const [hoveredSliceId, setHoveredSliceId] = useState<string | null>(null);

  const currentTabKey = controlledTab || internalTab;
  const activeTabConfig = hasTabs
    ? tabs.find((t) => t.key === currentTabKey) || tabs[0]
    : null;

  const handleTabSelect = (key: string) => {
    setInternalTab(key);
    setHoveredSliceId(null);
    onTabChange?.(key);
  };

  const rawSlices = useMemo(() => {
    if (activeTabConfig) return activeTabConfig.data || [];
    return data || [];
  }, [activeTabConfig, data]);

  // Filter out non-positive values for clean arc segments
  const nonZeroSlices = useMemo(() => {
    return rawSlices.filter((s) => s.value > 0);
  }, [rawSlices]);

  const totalCount = useMemo(() => {
    return rawSlices.reduce((acc, curr) => acc + curr.value, 0);
  }, [rawSlices]);

  // Donut geometry constants
  const radius = (size - strokeWidth) / 2 - (compact ? 4 : 8);
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Resolve color for each slice
  const resolveSliceMeta = React.useCallback(
    (item: TPieChartSlice, index: number) => {
      const key = (item.id || item.label || "").toUpperCase();
      const mapped = colorMap[key];

      if (mapped) {
        if (typeof mapped === "string") {
          return {
            stroke: mapped,
            bg: "",
            text: "",
            label: item.label,
          };
        }
        return {
          stroke: mapped.stroke,
          bg: mapped.bg || "",
          text: mapped.text || "",
          label: mapped.label || item.label,
        };
      }

      if (item.color || item.stroke) {
        return {
          stroke: item.color || item.stroke || "#94a3b8",
          bg: item.bg || "",
          text: item.text || "",
          label: item.label,
        };
      }

      const fallback = defaultSliceColor || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
      return {
        stroke: fallback,
        bg: "",
        text: "",
        label: item.label,
      };
    },
    [colorMap, defaultSliceColor]
  );

  // Calculate slice offset angles
  const sliceAngles = useMemo(() => {
    if (totalCount === 0) return [];
    let accumulatedOffset = 0;

    return nonZeroSlices.map((item, index) => {
      const fraction = item.value / totalCount;
      const strokeDasharray = `${circumference * fraction} ${circumference}`;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += circumference * fraction;

      const meta = resolveSliceMeta(item, index);
      const sliceKey = item.id || item.label || String(index);

      return {
        ...item,
        sliceKey,
        percentage: (fraction * 100).toFixed(1),
        strokeDasharray,
        strokeDashoffset,
        color: meta.stroke,
        bg: meta.bg,
        label: meta.label,
      };
    });
  }, [nonZeroSlices, totalCount, circumference, resolveSliceMeta]);

  const activeHoverSlice = sliceAngles.find((s) => s.sliceKey === hoveredSliceId);

  const content = (
    <>
      {/* Top glowing accent border line */}
      {containerCard && (
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none z-20" />
      )}

      {/* Ambient background glow */}
      {containerCard && (
        <>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />
        </>
      )}

      {/* Card Header & Mode Switcher */}
      {(title || subtitle || hasTabs || headerRight) && (
        <div
          className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 ${
            containerCard ? "border-b border-white/10" : ""
          }`}
        >
          <div>
            {(title || icon) && (
              <div className="flex items-center gap-2">
                {icon ? (
                  <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
                    {icon}
                  </span>
                ) : (
                  <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
                    <PieIcon className="w-4 h-4" />
                  </span>
                )}
                <h2 className={`${compact ? "text-xs font-black text-white" : "text-base sm:text-lg font-black text-white tracking-tight"}`}>
                  {title || (activeTabConfig ? activeTabConfig.label : "Status Distribution")}
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {headerRight}

            {/* Tab switchers */}
            {hasTabs && (
              <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 self-start sm:self-auto shadow-inner">
                {tabs.map((tab) => {
                  const isSelected = tab.key === currentTabKey;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => handleTabSelect(tab.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visualization Canvas */}
      <div className="relative z-10 mt-4 flex-1 flex flex-col items-center justify-center">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
            <Info className="w-7 h-7 text-cyan-400/60" />
            <div className="text-sm font-extrabold text-white">No Distribution Data</div>
            <div className="text-xs max-w-xs text-slate-400">
              {activeTabConfig?.emptyMessage || emptyMessage}
            </div>
          </div>
        ) : (
          <div
            className={`w-full flex ${
              legendLayout === "grid"
                ? "flex-col items-center gap-6"
                : compact
                ? "items-center justify-center gap-4"
                : "flex-col md:flex-row items-center justify-center gap-6"
            }`}
          >
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
                  const isHovered = hoveredSliceId === slice.sliceKey;
                  return (
                    <circle
                      key={slice.sliceKey}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? strokeWidth + 5 : strokeWidth}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      strokeLinecap="butt"
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredSliceId(slice.sliceKey)}
                      onMouseLeave={() => setHoveredSliceId(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              {showCenterLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-3 select-none">
                  {activeHoverSlice ? (
                    <>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate max-w-[120px]">
                        {activeHoverSlice.label}
                      </span>
                      <span
                        className={`${
                          compact ? "text-lg" : "text-2xl"
                        } font-black text-white font-mono`}
                      >
                        {valueFormatter(activeHoverSlice.value)}
                      </span>
                      <span
                        className="text-[11px] font-black"
                        style={{ color: activeHoverSlice.color }}
                      >
                        {activeHoverSlice.percentage}% share
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {centerTitle || (activeTabConfig ? activeTabConfig.label : "Total")}
                      </span>
                      <span
                        className={`${
                          compact ? "text-sm" : "text-2xl"
                        } font-black text-white font-mono`}
                      >
                        {valueFormatter(totalCount)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {centerSubtitle || "100% recorded"}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Legends */}
            {showLegend && (
              <>
                {legendLayout === "compact" ? (
                  /* Mini Legend for compact spark cards */
                  <div className="space-y-1 text-[11px] font-mono flex-1">
                    {sliceAngles.slice(0, 4).map((s) => (
                      <div
                        key={s.sliceKey}
                        className="flex items-center justify-between gap-1.5 cursor-pointer"
                        onMouseEnter={() => setHoveredSliceId(s.sliceKey)}
                        onMouseLeave={() => setHoveredSliceId(null)}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: s.color }}
                          />
                          <span className="text-slate-300 capitalize text-[10px] truncate">
                            {s.label}
                          </span>
                        </div>
                        <span className="font-bold text-white text-[10px]">
                          {s.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : legendLayout === "grid" ? (
                  /* 2-Column Grid Legend */
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 w-full">
                    {sliceAngles.map((slice) => {
                      const isHovered = hoveredSliceId === slice.sliceKey;
                      return (
                        <div
                          key={slice.sliceKey}
                          onMouseEnter={() => setHoveredSliceId(slice.sliceKey)}
                          onMouseLeave={() => setHoveredSliceId(null)}
                          className={`flex items-center gap-2.5 text-xs px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                            isHovered ? "bg-white/10" : "hover:bg-white/5"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: slice.color }}
                          />
                          <span className="font-semibold text-slate-300 whitespace-nowrap">
                            {slice.label}
                          </span>
                          <span className="font-bold text-white ml-auto font-mono">
                            {valueFormatter(slice.value)}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ({slice.percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Detailed List Legend */
                  <div className="flex-1 w-full space-y-2 max-w-xs">
                    {rawSlices.map((item, idx) => {
                      const sliceKey = item.id || item.label || String(idx);
                      const meta = resolveSliceMeta(item, idx);
                      const percentage =
                        totalCount > 0
                          ? ((item.value / totalCount) * 100).toFixed(1)
                          : "0.0";
                      const isHovered = hoveredSliceId === sliceKey;

                      return (
                        <div
                          key={sliceKey}
                          onMouseEnter={() => setHoveredSliceId(sliceKey)}
                          onMouseLeave={() => setHoveredSliceId(null)}
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
                            <span className="font-black text-white">
                              {valueFormatter(item.value)}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 w-12 text-right">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (!containerCard) {
    return <div className={`w-full relative ${className}`}>{content}</div>;
  }

  return (
    <div
      className={`card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between ${className}`}
    >
      {content}
    </div>
  );
};

export const DonutChart = PieChart;
export default PieChart;
