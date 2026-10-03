"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import { TrendingUp, Info } from "lucide-react";

const emptySubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
import {
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Export built-in Recharts components for direct developer usage
export {
  AreaChart,
  Area,
  RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
};

export interface TLineChartPoint {
  label: string; // e.g. "2026-03-15" or "Mon" or "Sep 12"
  value: number;
}

export interface TLineChartTab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  data: TLineChartPoint[];
  strokeColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  valueFormatter?: (val: number) => string;
  yAxisFormatter?: (val: number) => string;
  badgeText?: string;
}

export interface LineChartProps {
  /** Single dataset */
  data?: TLineChartPoint[];
  /** Multiple tabs for switching datasets */
  tabs?: TLineChartTab[];
  /** Currently active tab key (controlled or default) */
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (key: string) => void;
  /** Force a single tab / metric mode */
  forcedTab?: string;

  /** Visual customizations */
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  strokeColor?: string;
  gradientFrom?: string;
  gradientTo?: string;

  /** Formatting */
  valueFormatter?: (val: number) => string;
  yAxisFormatter?: (val: number) => string;
  unitLabel?: string;

  /** Dimensions & Modes */
  compact?: boolean;
  svgWidth?: number;
  svgHeight?: number;
  containerCard?: boolean;
  showSummaryStats?: boolean;
  showGrid?: boolean;
  showDots?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data = [],
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
  forcedTab,

  title,
  subtitle,
  icon,
  headerRight,
  strokeColor: customStroke,
  gradientFrom: customGradFrom,
  gradientTo: customGradTo,

  valueFormatter: customValFormatter,
  yAxisFormatter: customYFormatter,
  unitLabel,

  compact = false,
  svgHeight = compact ? 160 : 280,
  containerCard = true,
  showSummaryStats = !compact,
  showGrid = true,
  showDots = true,
  showTooltip = true,
  showXAxis = !compact,
  emptyMessage = "No activity or records found in the active timeframe.",
  className = "",
}) => {
  const isMounted = useIsMounted();

  const hasTabs = Array.isArray(tabs) && tabs.length > 0;
  const initialTabKey = defaultTab || (hasTabs ? tabs[0].key : "");
  const [internalTab, setInternalTab] = useState<string>(initialTabKey);

  const currentTabKey = forcedTab || controlledTab || internalTab;
  const activeTabConfig = hasTabs
    ? tabs.find((t) => t.key === currentTabKey) || tabs[0]
    : null;

  const handleTabSelect = (key: string) => {
    setInternalTab(key);
    onTabChange?.(key);
  };

  const rawPoints = useMemo(() => {
    if (activeTabConfig) return activeTabConfig.data || [];
    return data || [];
  }, [activeTabConfig, data]);

  const sortedPoints = useMemo(() => {
    return [...rawPoints].sort((a, b) => a.label.localeCompare(b.label));
  }, [rawPoints]);

  const strokeColor =
    customStroke ||
    activeTabConfig?.strokeColor ||
    (currentTabKey.includes("rev") || currentTabKey.includes("dollar")
      ? "#fbbf24"
      : "#34d399");

  const gradientFrom =
    customGradFrom || activeTabConfig?.gradientFrom || strokeColor;
  const gradientTo =
    customGradTo || activeTabConfig?.gradientTo || strokeColor;

  const valueFormatter =
    customValFormatter ||
    activeTabConfig?.valueFormatter ||
    ((v: number) =>
      currentTabKey.includes("rev") ||
      currentTabKey.includes("price") ||
      currentTabKey.includes("spend")
        ? `$${v.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : `${v.toLocaleString()} ${unitLabel || ""}`.trim());

  const yAxisFormatter =
    customYFormatter ||
    activeTabConfig?.yAxisFormatter ||
    ((v: number) =>
      currentTabKey.includes("rev") ||
      currentTabKey.includes("price") ||
      currentTabKey.includes("spend")
        ? `$${Math.round(v)}`
        : Math.round(v).toString());

  const totalValue = sortedPoints.reduce((acc, curr) => acc + curr.value, 0);
  const maxValue =
    sortedPoints.length > 0
      ? Math.max(...sortedPoints.map((p) => p.value), 0)
      : 0;

  const uniqueId = React.useId().replace(/:/g, "_");
  const chartHeight = svgHeight;

  const content = (
    <>
      {/* Glowing accent border line */}
      {containerCard && (
        <div
          className="absolute top-0 inset-x-0 h-[1.5px] pointer-events-none z-20 transition-all duration-300"
          style={{
            backgroundImage: `linear-gradient(to right, transparent, ${strokeColor}99, transparent)`,
          }}
        />
      )}

      {/* Ambient background glow */}
      {containerCard && (
        <>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />
        </>
      )}

      {/* Header with Title and Mode Switcher */}
      {(title || subtitle || hasTabs || headerRight) && (
        <div
          className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 ${
            containerCard ? "border-b border-white/10" : ""
          }`}
        >
          <div>
            {(title || icon) && (
              <div className="flex items-center gap-2">
                {icon ? (
                  <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400">
                    {icon}
                  </span>
                ) : (
                  <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                )}
                <h2
                  className={`${
                    compact
                      ? "text-xs font-black text-white"
                      : "text-base sm:text-lg font-black text-white tracking-tight"
                  }`}
                >
                  {title || (activeTabConfig ? activeTabConfig.label : "Trend Velocity")}
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 max-w-xl">{subtitle}</p>
            )}
          </div>

          {/* Header Controls (Tabs or Badge or custom) */}
          <div className="flex items-center gap-2">
            {headerRight}

            {hasTabs &&
              (forcedTab ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[#120824] border border-white/15 shadow-inner">
                  {activeTabConfig?.icon}
                  <span style={{ color: strokeColor }}>
                    {activeTabConfig?.badgeText || activeTabConfig?.label}
                  </span>
                </div>
              ) : (
                <div
                  className={`flex items-center bg-[#120824] border border-white/15 ${
                    compact ? "rounded-xl p-0.5 text-[10px]" : "rounded-2xl p-1 text-xs"
                  } gap-1 self-start sm:self-auto shadow-inner`}
                >
                  {tabs.map((tab) => {
                    const isSelected = tab.key === currentTabKey;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => handleTabSelect(tab.key)}
                        className={`${
                          compact
                            ? "px-2 py-0.5 rounded-lg text-[10px]"
                            : "px-3 py-1.5 rounded-xl text-xs"
                        } font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-white/15 text-white shadow-md border border-white/20"
                            : "text-slate-400 hover:text-white"
                        }`}
                        style={
                          isSelected && tab.strokeColor
                            ? {
                                backgroundColor: `${tab.strokeColor}25`,
                                borderColor: `${tab.strokeColor}60`,
                                color: tab.strokeColor,
                              }
                            : undefined
                        }
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Chart Canvas or Empty State */}
      <div className="relative z-10 mt-3 flex-1 w-full min-w-0">
        {sortedPoints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
            <Info className="w-7 h-7 text-amber-400/60" />
            <div className="text-sm font-extrabold text-white">No Activity in Range</div>
            <div className="text-xs max-w-xs text-slate-400">{emptyMessage}</div>
          </div>
        ) : (
          <>
            {/* Quick Metrics Bar above chart */}
            {showSummaryStats && (
              <div className="flex items-center justify-between mb-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-medium">Period Total:</span>
                  <span className="font-mono font-extrabold text-white text-sm">
                    {valueFormatter(totalValue)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Peak:</span>
                  <span className="font-bold" style={{ color: strokeColor }}>
                    {valueFormatter(maxValue)}
                  </span>
                </div>
              </div>
            )}

            {!isMounted ? (
              <div
                className="w-full flex items-center justify-center bg-white/[0.02] rounded-xl animate-pulse"
                style={{ height: chartHeight }}
              >
                <div className="text-xs text-slate-500">Loading trend...</div>
              </div>
            ) : (
              /* Recharts Area / Line Chart with smooth Monotone Spline and Glow */
              <div className="w-full" style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sortedPoints}
                    margin={{
                      top: 10,
                      right: compact ? 10 : 20,
                      left: compact ? -20 : -5,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id={`lineGrad_${uniqueId}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={gradientFrom}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor={gradientTo}
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>

                    {showGrid && (
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.06)"
                        vertical={false}
                      />
                    )}

                    {showXAxis && (
                      <XAxis
                        dataKey="label"
                        stroke="#94a3b8"
                        fontSize={compact ? 10 : 11}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                        dy={6}
                        tick={({ x, y, payload }) => {
                          const val = String(payload.value || "");
                          const display =
                            val.length > 10 ? `${val.slice(5)}` : val;
                          return (
                            <text
                              x={x}
                              y={y}
                              textAnchor="middle"
                              fill="#94a3b8"
                              fontSize={compact ? 10 : 11}
                            >
                              {display}
                            </text>
                          );
                        }}
                      />
                    )}

                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => {
                        if (yAxisFormatter) return yAxisFormatter(val);
                        return val >= 1000
                          ? `${(val / 1000).toFixed(1)}k`
                          : val.toString();
                      }}
                      dx={-4}
                    />

                    {showTooltip && (
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload || !payload.length) return null;
                          const val = Number(payload[0].value) || 0;
                          return (
                            <div className="bg-[#120824]/95 backdrop-blur-md border border-white/20 p-2.5 rounded-xl shadow-2xl space-y-1">
                              <div className="text-[11px] font-mono text-slate-400">
                                {label}
                              </div>
                              <div
                                className="text-xs font-black font-mono flex items-center gap-1.5"
                                style={{ color: strokeColor }}
                              >
                                <span>{valueFormatter(val)}</span>
                              </div>
                            </div>
                          );
                        }}
                        cursor={{
                          stroke: strokeColor,
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                      />
                    )}

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={strokeColor}
                      strokeWidth={2.5}
                      fill={`url(#lineGrad_${uniqueId})`}
                      dot={
                        showDots
                          ? {
                              r: 3,
                              fill: strokeColor,
                              strokeWidth: 1.5,
                              stroke: "#170d2f",
                            }
                          : false
                      }
                      activeDot={{
                        r: 6,
                        fill: strokeColor,
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                      animationDuration={900}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
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

export default LineChart;
