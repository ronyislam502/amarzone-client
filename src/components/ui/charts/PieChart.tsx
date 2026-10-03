"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import { PieChart as PieIcon, Info } from "lucide-react";

const emptySubscribe = () => () => { };
const useIsMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend as RechartsLegend,
} from "recharts";

// Export built-in Recharts components for direct use
export {
  RechartsPieChart,
  Pie,
  Cell,
  RechartsTooltip,
  ResponsiveContainer,
  RechartsLegend,
};

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
  colorMap?: Record<
    string,
    string | { stroke: string; bg?: string; text?: string; label?: string }
  >;
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

const DEFAULT_STATUS_PALETTE: Record<
  string,
  { stroke: string; bg: string; text: string; label: string }
> = {
  PENDING: {
    stroke: "#fbbf24",
    bg: "bg-amber-400",
    text: "text-amber-400",
    label: "Pending",
  },
  UNSHIPPED: {
    stroke: "#22d3ee",
    bg: "bg-cyan-400",
    text: "text-cyan-400",
    label: "Processing",
  },
  SHIPPED: {
    stroke: "#60a5fa",
    bg: "bg-blue-400",
    text: "text-blue-400",
    label: "Shipped",
  },
  DELIVERED: {
    stroke: "#34d399",
    bg: "bg-emerald-400",
    text: "text-emerald-400",
    label: "Delivered",
  },
  CANCELLED: {
    stroke: "#f87171",
    bg: "bg-rose-400",
    text: "text-rose-400",
    label: "Cancelled",
  },
  REFUNDED: {
    stroke: "#c084fc",
    bg: "bg-purple-400",
    text: "text-purple-400",
    label: "Refunded",
  },
  PAID: {
    stroke: "#34d399",
    bg: "bg-emerald-400",
    text: "text-emerald-400",
    label: "Paid",
  },
  UNPAID: {
    stroke: "#f87171",
    bg: "bg-rose-400",
    text: "text-rose-400",
    label: "Unpaid / Failed",
  },
};

const FALLBACK_COLORS = [
  "#34d399",
  "#22d3ee",
  "#fbbf24",
  "#60a5fa",
  "#c084fc",
  "#f87171",
  "#f43f5e",
  "#a855f7",
];

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
  const isMounted = useIsMounted();

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

  const nonZeroSlices = useMemo(() => {
    return rawSlices.filter((s) => s.value > 0);
  }, [rawSlices]);

  const totalCount = useMemo(() => {
    return rawSlices.reduce((acc, curr) => acc + curr.value, 0);
  }, [rawSlices]);

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

      if (item.color) {
        return {
          stroke: item.color,
          bg: item.bg || "",
          text: item.text || "",
          label: item.label,
        };
      }

      const fallback =
        defaultSliceColor ||
        FALLBACK_COLORS[index % FALLBACK_COLORS.length];

      return {
        stroke: fallback,
        bg: "",
        text: "",
        label: item.label,
      };
    },
    [colorMap, defaultSliceColor]
  );

  // Slices formatted with resolved colors and percentage
  const enrichedSlices = useMemo(() => {
    return nonZeroSlices.map((slice, idx) => {
      const sliceKey = slice.id || slice.label || String(idx);
      const meta = resolveSliceMeta(slice, idx);
      const percentage =
        totalCount > 0 ? ((slice.value / totalCount) * 100).toFixed(1) : "0.0";
      return {
        ...slice,
        sliceKey,
        color: meta.stroke,
        displayLabel: meta.label,
        percentage,
      };
    });
  }, [nonZeroSlices, totalCount, resolveSliceMeta]);

  const activeHoverSlice = useMemo(() => {
    if (!hoveredSliceId) return null;
    return enrichedSlices.find((s) => s.sliceKey === hoveredSliceId) || null;
  }, [hoveredSliceId, enrichedSlices]);

  // Radius geometry for Recharts Donut
  const outerRadius = Math.max(10, size / 2 - (compact ? 4 : 8));
  const innerRadius = Math.max(5, outerRadius - strokeWidth);

  const hasData = nonZeroSlices.length > 0;

  const content = (
    <>
      {/* Top glowing accent border line */}
      {containerCard && (
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none z-20" />
      )}

      {/* Ambient background glow */}
      {containerCard && (
        <>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-cyan-600/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />
        </>
      )}

      {/* Header with Switcher */}
      {(title || subtitle || hasTabs || headerRight) && (
        <div
          className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 ${containerCard ? "border-b border-white/10" : ""
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
                <h2
                  className={`${compact
                      ? "text-xs font-black text-white"
                      : "text-base sm:text-lg font-black text-white tracking-tight"
                    }`}
                >
                  {title || (activeTabConfig ? activeTabConfig.label : "Breakdown Distribution")}
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 max-w-xl">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {headerRight}

            {/* View Mode Switcher */}
            {hasTabs && (
              <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 self-start sm:self-auto shadow-inner flex-wrap">
                {tabs.map((tab) => {
                  const isSelected = tab.key === currentTabKey;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => handleTabSelect(tab.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
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

      {/* Content Area */}
      <div className="relative z-10 mt-4 flex-1 flex flex-col justify-center w-full min-w-0">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-14 text-center text-slate-400 space-y-2">
            <Info className="w-7 h-7 text-cyan-400/60" />
            <div className="text-sm font-extrabold text-white">No Distribution Data</div>
            <div className="text-xs max-w-xs text-slate-400">
              {activeTabConfig?.emptyMessage || emptyMessage}
            </div>
          </div>
        ) : !isMounted ? (
          <div
            className="w-full flex items-center justify-center bg-white/[0.02] rounded-xl animate-pulse"
            style={{ height: size }}
          >
            <div className="text-xs text-slate-500">Loading distribution...</div>
          </div>
        ) : (
          <div
            className={`w-full flex ${legendLayout === "grid"
                ? "flex-col items-center gap-6"
                : compact
                  ? "items-center justify-center gap-4"
                  : "flex-col md:flex-row items-center justify-center gap-6"
              }`}
          >
            {/* Recharts Pie Donut Container */}
            <div
              className="relative shrink-0 flex items-center justify-center select-none"
              style={{ width: size, height: size }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload as typeof enrichedSlices[0];
                      return (
                        <div className="bg-[#120824]/95 backdrop-blur-md border border-white/20 p-2.5 rounded-xl shadow-2xl space-y-1">
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.label}</span>
                          </div>
                          <div className="text-xs font-mono font-black text-amber-400">
                            {valueFormatter(item.value)}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.percentage}% share
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Pie
                    data={enrichedSlices}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="label"
                    stroke="#170d2f"
                    strokeWidth={2}
                    animationDuration={800}
                    onMouseEnter={(_, index) =>
                      setHoveredSliceId(enrichedSlices[index]?.sliceKey || null)
                    }
                    onMouseLeave={() => setHoveredSliceId(null)}
                  >
                    {enrichedSlices.map((entry) => {
                      const isHovered = hoveredSliceId === entry.sliceKey;
                      return (
                        <Cell
                          key={entry.sliceKey}
                          fill={entry.color}
                          opacity={
                            hoveredSliceId && !isHovered ? 0.45 : 1
                          }
                          className="cursor-pointer transition-opacity duration-200"
                        />
                      );
                    })}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              {showCenterLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-3 select-none">
                  {activeHoverSlice ? (
                    <>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate max-w-[120px]">
                        {activeHoverSlice.label}
                      </span>
                      <span
                        className={`${compact ? "text-lg" : "text-2xl"
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
                        className={`${compact ? "text-sm" : "text-2xl"
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

            {/* Interactive Legends */}
            {showLegend && (
              <>
                {legendLayout === "compact" ? (
                  /* Mini Legend for compact cards */
                  <div className="space-y-1 text-[11px] font-mono flex-1">
                    {enrichedSlices.slice(0, 4).map((s) => (
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
                    {enrichedSlices.map((slice) => {
                      const isHovered = hoveredSliceId === slice.sliceKey;
                      return (
                        <div
                          key={slice.sliceKey}
                          onMouseEnter={() => setHoveredSliceId(slice.sliceKey)}
                          onMouseLeave={() => setHoveredSliceId(null)}
                          className={`flex items-center gap-2.5 text-xs px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${isHovered ? "bg-white/10" : "hover:bg-white/5"
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
                    {enrichedSlices.map((item) => {
                      const isHovered = hoveredSliceId === item.sliceKey;

                      return (
                        <div
                          key={item.sliceKey}
                          onMouseEnter={() => setHoveredSliceId(item.sliceKey)}
                          onMouseLeave={() => setHoveredSliceId(null)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${isHovered
                              ? "bg-white/10 border-white/25 scale-[1.02]"
                              : "bg-[#120824]/60 border-white/5 hover:border-white/15"
                            }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="font-bold text-slate-200 capitalize truncate">
                                {item.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-extrabold text-white">
                                {valueFormatter(item.value)}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ({item.percentage}%)
                              </span>
                            </div>
                          </div>

                          {/* Progress bar indication */}
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: item.color,
                              }}
                            />
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
